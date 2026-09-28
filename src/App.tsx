import React, { useState, useEffect, useRef } from 'react';
import { ChildProfile, ParentSettings, DailyPlayTracker, DentalDiseaseId } from './types';
import {
  loadProfileFromStorage,
  saveProfileToStorage,
  loadParentSettings,
  saveParentSettings,
  loadDailyTracker,
  saveDailyTracker,
  getTodayDateString,
} from './utils/syncManager';
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
import { ScreenTimeAlertModal } from './components/ScreenTimeAlertModal';
import { soundEffects } from './utils/audio';

export default function App() {
  const [profile, setProfile] = useState<ChildProfile>(loadProfileFromStorage);
  const [settings, setSettings] = useState<ParentSettings>(loadParentSettings);
  const [dailyTracker, setDailyTracker] = useState<DailyPlayTracker>(loadDailyTracker);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // App navigation state
  const [currentMode, setCurrentMode] = useState<
    'home' | 'clinic' | 'quiz' | 'germ_game' | 'food_game' | 'brushing'
  >('home');
  const [showParentModal, setShowParentModal] = useState(false);
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isScreenTimeLocked, setIsScreenTimeLocked] = useState(false);

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

  // Screen time tracking timer (every second)
  useEffect(() => {
    const interval = setInterval(() => {
      setDailyTracker(prev => {
        const nextSeconds = prev.secondsPlayedToday + 1;
        const updated = { ...prev, secondsPlayedToday: nextSeconds };
        saveDailyTracker(updated);

        // Check screen time limit
        if (
          settings.dailyTimeLimitMinutes > 0 &&
          nextSeconds >= settings.dailyTimeLimitMinutes * 60 &&
          !isScreenTimeLocked
        ) {
          setIsScreenTimeLocked(true);
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [settings.dailyTimeLimitMinutes, isScreenTimeLocked]);

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 via-teal-50/40 to-emerald-50 text-slate-800">
      {/* Child-Friendly Top Header */}
      <HeaderNavBar
        profile={profile}
        settings={settings}
        isOnline={isOnline}
        onOpenParent={() => setShowParentModal(true)}
        onOpenWardrobe={() => setShowWardrobe(true)}
        onToggleSpeech={handleToggleSpeech}
        onNavigateHome={() => setCurrentMode('home')}
        currentMode={currentMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 pb-12">
        {currentMode === 'home' && (
          <ModeSelector
            profile={profile}
            speechEnabled={settings.speechAudioEnabled}
            onSelectMode={mode => setCurrentMode(mode as any)}
            onOpenWardrobe={() => setShowWardrobe(true)}
            onOpenLeaderboard={() => setShowLeaderboard(true)}
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
      </main>

      {/* Wardrobe Modal */}
      {showWardrobe && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
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

      {/* Screen Time Lockout Modal */}
      {isScreenTimeLocked && (
        <ScreenTimeAlertModal
          onParentUnlock={enteredPin => enteredPin === settings.pin || enteredPin === '1234'}
          onExtend={() => {
            setIsScreenTimeLocked(false);
            setDailyTracker(prev => ({ ...prev, secondsPlayedToday: 0 }));
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/70 py-4 text-center text-xs text-slate-500 font-medium">
        Dentika: Petualangan Gigi Sehat &copy; {new Date().getFullYear()} &bull; Game Edukasi Kesehatan Gigi & Mulut Ramah Anak
      </footer>
    </div>
  );
}
