import React, { useState, useEffect } from 'react';
import {
  ChildProfile,
  ParentSettings,
  DailyPlayTracker,
  DentalDiseaseId,
  AppUserProfile,
  RiskWarningData,
  AppCustomizationConfig,
} from './types';
import {
  loadProfileFromStorage,
  saveProfileToStorage,
  loadParentSettings,
  saveParentSettings,
  loadDailyTracker,
  saveDailyTracker,
  getTodayDateString,
} from './utils/syncManager';
import { DEFAULT_APP_CUSTOMIZATION } from './data/appCustomization';
import {
  auth,
  onAuthStateChanged,
  db,
  doc,
  getDoc,
  setDoc,
  SUPER_ADMIN_EMAIL,
} from './lib/firebase';
import { HeaderNavBar } from './components/HeaderNavBar';
import { ModeSelector } from './components/ModeSelector';
import { DiseaseExplorer } from './components/DiseaseExplorer';
import { InteractiveQuiz } from './components/InteractiveQuiz';
import { GermBusterGame } from './components/GermBusterGame';
import { FoodSorterGame } from './components/FoodSorterGame';
import { BrushingCoach } from './components/BrushingCoach';
import { RewardWardrobe } from './components/RewardWardrobe';
import { LeaderboardModal } from './components/LeaderboardModal';
import { ParentDashboard } from './components/ParentDashboard';
import { CommunityForum } from './components/CommunityForum';
import { AuthModal } from './components/AuthModal';
import { SuperAdminPanel } from './components/SuperAdminPanel';
import { ClinicalAnalysisDashboard } from './components/ClinicalAnalysisDashboard';
import { SequentialLearningCenter } from './components/SequentialLearningCenter';
import { RiskWarningModal } from './components/RiskWarningModal';
import { soundEffects } from './utils/audio';

const STORAGE_USER_KEY = 'dentika_auth_profile_v1';
const STORAGE_CUSTOMIZATION_KEY = 'dentika_app_customization_v1';

export default function App() {
  const [profile, setProfile] = useState<ChildProfile>(loadProfileFromStorage);
  const [settings, setSettings] = useState<ParentSettings>(loadParentSettings);
  const [dailyTracker, setDailyTracker] = useState<DailyPlayTracker>(loadDailyTracker);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // User Authentication & Role State
  const [currentUser, setCurrentUser] = useState<AppUserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return null;
  });

  // App Layout & Color Customization
  const [appConfig, setAppConfig] = useState<AppCustomizationConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CUSTOMIZATION_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return DEFAULT_APP_CUSTOMIZATION;
  });

  // App Navigation & Modals
  const [currentMode, setCurrentMode] = useState<
    'home' | 'clinic' | 'quiz' | 'germ_game' | 'food_game' | 'brushing' | 'forum' | 'sequential_levels'
  >('home');
  const [showParentModal, setShowParentModal] = useState(false);
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showClinicalModal, setShowClinicalModal] = useState(false);

  // Risk Warning Notification State
  const [riskWarningModal, setRiskWarningModal] = useState<RiskWarningData | null>(null);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const isSuperAdmin = fbUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
        try {
          const userRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userRef);

          if (snap.exists()) {
            const data = snap.data() as AppUserProfile;
            const finalRole = isSuperAdmin ? 'super_admin' : data.primaryRole;
            const updatedUser: AppUserProfile = {
              ...data,
              uid: fbUser.uid,
              email: fbUser.email || data.email,
              displayName: fbUser.displayName || data.displayName,
              photoURL: fbUser.photoURL || data.photoURL,
              primaryRole: finalRole,
              activeRole: isSuperAdmin ? 'super_admin' : (data.activeRole || data.primaryRole),
            };
            setCurrentUser(updatedUser);
            localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updatedUser));
          } else {
            // New user registration record
            const newUser: AppUserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || 'Sahabat Dentika',
              photoURL: fbUser.photoURL || undefined,
              primaryRole: isSuperAdmin ? 'super_admin' : 'anak',
              activeRole: isSuperAdmin ? 'super_admin' : 'anak',
              hasParentRole: isSuperAdmin,
              hasChildRole: true,
              age: isSuperAdmin ? 30 : 8,
              gender: 'Laki-laki',
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
              currentLevel: 1,
              completedModuleIds: [],
              completedLevelIds: [],
              quizScores: {},
            };
            await setDoc(userRef, newUser);
            setCurrentUser(newUser);
            localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newUser));
          }
        } catch (e) {
          console.warn('Error fetching user profile from Firestore:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Load Customization Config from Firestore
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const snap = await getDoc(doc(db, 'app_customization', 'main_layout'));
        if (snap.exists()) {
          const cfg = snap.data() as AppCustomizationConfig;
          setAppConfig(cfg);
          localStorage.setItem(STORAGE_CUSTOMIZATION_KEY, JSON.stringify(cfg));
        }
      } catch (e) {
        console.warn('Notice loading app config:', e);
      }
    };
    loadConfig();
  }, []);

  // Check and update streak on load
  useEffect(() => {
    const today = getTodayDateString();
    if (profile.lastPlayedDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = profile.streakDays;
      if (profile.lastPlayedDate === yesterdayStr) {
        newStreak += 1;
      } else if (profile.lastPlayedDate < yesterdayStr) {
        newStreak = 1;
      }

      const updated = {
        ...profile,
        streakDays: newStreak,
        lastPlayedDate: today,
      };
      setProfile(updated);
      saveProfileToStorage(updated);
    }
  }, []);

  // Daily play tracking (Requirement 7: time restriction lock completely removed)
  useEffect(() => {
    const interval = setInterval(() => {
      setDailyTracker(prev => {
        const nextSeconds = prev.secondsPlayedToday + 1;
        const updated = { ...prev, secondsPlayedToday: nextSeconds };
        saveDailyTracker(updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle User Change from Auth Modal
  const handleUserChange = (user: AppUserProfile | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
      // Sync child name to child profile if set
      if (user.childName && user.childName !== profile.name) {
        const updated = { ...profile, name: user.childName };
        setProfile(updated);
        saveProfileToStorage(updated);
      }
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  };

  // Handle Update App Customization Config
  const handleUpdateAppConfig = async (newConfig: AppCustomizationConfig) => {
    setAppConfig(newConfig);
    localStorage.setItem(STORAGE_CUSTOMIZATION_KEY, JSON.stringify(newConfig));
    try {
      await setDoc(doc(db, 'app_customization', 'main_layout'), newConfig);
    } catch (e) {
      console.warn('Notice saving app config to Firestore:', e);
    }
  };

  // Handle Quiz Completion
  const handleQuizComplete = (results: {
    correct: number;
    total: number;
    scoreEarned: number;
    coinsEarned: number;
  }) => {
    setProfile(prev => {
      const newScore = prev.score + results.scoreEarned;
      const newCoins = prev.coins + results.coinsEarned;
      const newStars = prev.stars + Math.ceil(results.correct / 2);
      const newCorrect = prev.correctAnswers + results.correct;
      const newTotalQ = prev.totalQuestionsAnswered + results.total;
      const newCompleted = prev.completedQuizzes + 1;

      // Update badges
      const updatedBadges = prev.badges.map(b => {
        if (b.id === 'quiz_master') {
          const prog = Math.min(b.maxProgress, newCorrect);
          return { ...b, progress: prog, unlocked: prog >= b.maxProgress };
        }
        if (b.id === 'diamond_smile') {
          const prog = Math.min(b.maxProgress, newCoins);
          return { ...b, progress: prog, unlocked: prog >= b.maxProgress };
        }
        return b;
      });

      const updated: ChildProfile = {
        ...prev,
        score: newScore,
        coins: newCoins,
        stars: newStars,
        correctAnswers: newCorrect,
        totalQuestionsAnswered: newTotalQ,
        completedQuizzes: newCompleted,
        badges: updatedBadges,
      };

      saveProfileToStorage(updated);
      return updated;
    });
  };

  // Handle Disease Studied
  const handleMarkExplored = (diseaseId: DentalDiseaseId) => {
    setProfile(prev => {
      if (prev.exploredDiseases.includes(diseaseId)) return prev;

      const newExplored = [...prev.exploredDiseases, diseaseId];
      const newCoins = prev.coins + 50;
      const newStars = prev.stars + 1;

      const updatedBadges = prev.badges.map(b => {
        if (b.id === 'explorer') {
          const prog = newExplored.length;
          return { ...b, progress: prog, unlocked: prog >= b.maxProgress };
        }
        return b;
      });

      const updated: ChildProfile = {
        ...prev,
        coins: newCoins,
        stars: newStars,
        exploredDiseases: newExplored,
        badges: updatedBadges,
      };

      saveProfileToStorage(updated);
      return updated;
    });
  };

  // Handle Germ Game Finish
  const handleFinishGermGame = (score: number, coinsEarned: number) => {
    setProfile(prev => {
      const newHigh = Math.max(prev.germBusterHighScore, score);
      const newScore = prev.score + score;
      const newCoins = prev.coins + coinsEarned;
      const newStars = prev.stars + (score >= 200 ? 2 : 1);

      const updatedBadges = prev.badges.map(b => {
        if (b.id === 'germ_slayer') {
          const prog = Math.max(b.progress, newHigh);
          return { ...b, progress: prog, unlocked: prog >= b.maxProgress };
        }
        return b;
      });

      const updated: ChildProfile = {
        ...prev,
        score: newScore,
        coins: newCoins,
        stars: newStars,
        germBusterHighScore: newHigh,
        badges: updatedBadges,
      };

      saveProfileToStorage(updated);
      return updated;
    });
  };

  // Handle Food Sorter Finish
  const handleFinishFoodGame = (score: number, coinsEarned: number) => {
    setProfile(prev => {
      const newHigh = Math.max(prev.foodSorterHighScore, score);
      const newScore = prev.score + score;
      const newCoins = prev.coins + coinsEarned;
      const newStars = prev.stars + 2;

      const updatedBadges = prev.badges.map(b => {
        if (b.id === 'healthy_eater') {
          const prog = b.maxProgress;
          return { ...b, progress: prog, unlocked: true };
        }
        return b;
      });

      const updated: ChildProfile = {
        ...prev,
        score: newScore,
        coins: newCoins,
        stars: newStars,
        foodSorterHighScore: newHigh,
        badges: updatedBadges,
      };

      saveProfileToStorage(updated);
      return updated;
    });
  };

  // Handle Brushing Session Finish
  const handleFinishBrushingSession = (coinsEarned: number) => {
    setProfile(prev => {
      const newSessions = prev.brushingSessionsCompleted + 1;
      const newCoins = prev.coins + coinsEarned;
      const newStars = prev.stars + 2;

      const updatedBadges = prev.badges.map(b => {
        if (b.id === 'first_brush') {
          return { ...b, progress: 1, unlocked: true };
        }
        return b;
      });

      const updated: ChildProfile = {
        ...prev,
        coins: newCoins,
        stars: newStars,
        brushingSessionsCompleted: newSessions,
        badges: updatedBadges,
      };

      saveProfileToStorage(updated);
      return updated;
    });

    setDailyTracker(prev => {
      const updated = { ...prev, brushingDoneMorning: true };
      saveDailyTracker(updated);
      return updated;
    });
  };

  // Wardrobe Profile Equip Update
  const handleUpdateEquipped = (updatedData: Partial<ChildProfile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...updatedData };
      saveProfileToStorage(updated);
      return updated;
    });
  };

  // Toggle Text-to-Speech Voiceover
  const handleToggleSpeech = () => {
    const updated = { ...settings, speechAudioEnabled: !settings.speechAudioEnabled };
    setSettings(updated);
    saveParentSettings(updated);
  };

  return (
    <div
      style={{
        backgroundColor: appConfig.themeBgColor || '#FAFDF9',
        color: appConfig.themeSecondaryColor || '#143D37',
      }}
      className="min-h-screen flex flex-col font-sans transition-colors duration-300"
    >
      {/* Top Header Navigation Bar */}
      <HeaderNavBar
        profile={profile}
        settings={settings}
        currentUser={currentUser}
        isOnline={isOnline}
        onOpenParent={() => setShowParentModal(true)}
        onOpenWardrobe={() => setShowWardrobe(true)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenAdmin={() => setShowAdminModal(true)}
        onOpenClinical={() => setShowClinicalModal(true)}
        onToggleSpeech={handleToggleSpeech}
        onNavigateHome={() => setCurrentMode('home')}
        onSelectMode={mode => setCurrentMode(mode as any)}
        currentMode={currentMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 pb-12">
        {currentMode === 'home' && (
          <ModeSelector
            profile={profile}
            currentUser={currentUser}
            appConfig={appConfig}
            speechEnabled={settings.speechAudioEnabled}
            onSelectMode={mode => setCurrentMode(mode as any)}
            onOpenWardrobe={() => setShowWardrobe(true)}
            onOpenLeaderboard={() => setShowLeaderboard(true)}
            onOpenAdmin={() => setShowAdminModal(true)}
            onOpenClinical={() => setShowClinicalModal(true)}
          />
        )}

        {currentMode === 'sequential_levels' && (
          <SequentialLearningCenter
            profile={profile}
            currentUser={currentUser}
            speechEnabled={settings.speechAudioEnabled}
            onProfileUpdate={setProfile}
            onUserUpdate={handleUserChange}
            onBack={() => setCurrentMode('home')}
          />
        )}

        {currentMode === 'clinic' && (
          <DiseaseExplorer
            exploredIds={profile.exploredDiseases}
            speechEnabled={settings.speechAudioEnabled}
            onMarkExplored={handleMarkExplored}
            onBack={() => setCurrentMode('home')}
          />
        )}

        {currentMode === 'quiz' && (
          <InteractiveQuiz
            speechEnabled={settings.speechAudioEnabled}
            onQuizComplete={handleQuizComplete}
            onBack={() => setCurrentMode('home')}
          />
        )}

        {currentMode === 'germ_game' && (
          <GermBusterGame
            highScore={profile.germBusterHighScore}
            onFinishGame={handleFinishGermGame}
            onBack={() => setCurrentMode('home')}
          />
        )}

        {currentMode === 'food_game' && (
          <FoodSorterGame
            speechEnabled={settings.speechAudioEnabled}
            onFinish={handleFinishFoodGame}
            onBack={() => setCurrentMode('home')}
          />
        )}

        {currentMode === 'brushing' && (
          <BrushingCoach
            speechEnabled={settings.speechAudioEnabled}
            onFinishSession={handleFinishBrushingSession}
            onBack={() => setCurrentMode('home')}
          />
        )}

        {currentMode === 'forum' && (
          <CommunityForum
            profile={profile}
            speechEnabled={settings.speechAudioEnabled}
            onBack={() => setCurrentMode('home')}
          />
        )}
      </main>

      {/* Wardrobe Modal */}
      {showWardrobe && (
        <div className="fixed inset-0 bg-[#143D37]/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="max-w-4xl w-full my-auto">
            <RewardWardrobe
              profile={profile}
              onUpdateEquipped={handleUpdateEquipped}
              onBack={() => setShowWardrobe(false)}
            />
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-[#143D37]/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="max-w-2xl w-full my-auto">
            <LeaderboardModal
              profile={profile}
              onBack={() => setShowLeaderboard(false)}
            />
          </div>
        </div>
      )}

      {/* Parent Dashboard Modal */}
      {showParentModal && (
        <ParentDashboard
          profile={profile}
          settings={settings}
          dailyTracker={dailyTracker}
          isOnline={isOnline}
          onUpdateProfile={setProfile}
          onUpdateSettings={setSettings}
          onClose={() => setShowParentModal(false)}
        />
      )}

      {/* Auth / Gmail Login Modal */}
      {showAuthModal && (
        <AuthModal
          currentUser={currentUser}
          onUserChange={handleUserChange}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Super Admin Control Panel Modal */}
      {showAdminModal && currentUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="max-w-5xl w-full my-auto">
            <SuperAdminPanel
              currentUser={currentUser}
              appConfig={appConfig}
              onUpdateAppConfig={handleUpdateAppConfig}
              onRequestRiskWarning={setRiskWarningModal}
              onBack={() => setShowAdminModal(false)}
            />
          </div>
        </div>
      )}

      {/* Clinical Analysis Dashboard Modal */}
      {showClinicalModal && currentUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="max-w-5xl w-full my-auto">
            <ClinicalAnalysisDashboard
              currentUser={currentUser}
              onRequestRiskWarning={setRiskWarningModal}
              onBack={() => setShowClinicalModal(false)}
            />
          </div>
        </div>
      )}

      {/* Risk Warning Notification Modal with Risk Explanations */}
      {riskWarningModal && (
        <RiskWarningModal
          data={riskWarningModal}
          onClose={() => setRiskWarningModal(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-[#C4DCAC] bg-[#FAFDF9]/90 py-4 text-center text-xs text-[#21736A] font-semibold">
        {appConfig.appTitle || 'Dentika'}: {appConfig.appSubtitle || 'Petualangan Gigi Sehat'} &copy; {new Date().getFullYear()} &bull; Game Edukasi Kesehatan Gigi & Mulut Ramah Anak
      </footer>
    </div>
  );
}
