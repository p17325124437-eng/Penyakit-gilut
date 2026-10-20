import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SequentialLevel, EducationalModule, ChildProfile, AppUserProfile, QuizQuestion } from '../types';
import { SEQUENTIAL_LEVELS } from '../data/sequentialLevels';
import { soundEffects, speakText, stopSpeech } from '../utils/audio';
import { BackButton3D, ToothHealthy3D, Star3D, Coin3D, Shield3D } from './GameIcons';
import { db, doc, setDoc } from '../lib/firebase';

interface SequentialLearningProps {
  profile: ChildProfile;
  currentUser: AppUserProfile | null;
  speechEnabled: boolean;
  onProfileUpdate: (updated: ChildProfile) => void;
  onUserUpdate: (updated: AppUserProfile) => void;
  onBack: () => void;
}

export const SequentialLearningCenter: React.FC<SequentialLearningProps> = ({
  profile,
  currentUser,
  speechEnabled,
  onProfileUpdate,
  onUserUpdate,
  onBack,
}) => {
  // Current user's progress
  const currentLevelNumber = currentUser?.currentLevel || 1;
  const completedModuleIds = currentUser?.completedModuleIds || [];
  const completedLevelIds = currentUser?.completedLevelIds || [];

  const [selectedLevelNumber, setSelectedLevelNumber] = useState<number>(currentLevelNumber);
  const [activeModule, setActiveModule] = useState<EducationalModule | null>(null);
  const [isReadingAloud, setIsReadingAloud] = useState<boolean>(false);

  // In-level Quiz Runner State
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState<number>(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCorrectCount, setQuizCorrectCount] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const selectedLevel = SEQUENTIAL_LEVELS.find(l => l.levelNumber === selectedLevelNumber) || SEQUENTIAL_LEVELS[0];

  // Check if all modules in selected level are completed
  const allModulesCompletedInLevel = selectedLevel.modules.every(mod =>
    completedModuleIds.includes(mod.id)
  );

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // Open a module
  const handleOpenModule = (mod: EducationalModule, isUnlocked: boolean) => {
    if (!isUnlocked) {
      soundEffects.wrong();
      return;
    }
    soundEffects.tap();
    stopSpeech();
    setIsReadingAloud(false);
    setActiveModule(mod);
    setActiveQuizQuestions(null);
  };

  // Mark module as completed in sequence
  const handleCompleteModule = async (mod: EducationalModule) => {
    soundEffects.correct();
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
    });

    const newCompletedModuleIds = Array.from(new Set([...completedModuleIds, mod.id]));

    // Update child profile and user account
    if (currentUser) {
      const updatedUser: AppUserProfile = {
        ...currentUser,
        completedModuleIds: newCompletedModuleIds,
      };
      onUserUpdate(updatedUser);

      // Persist to Cloud Firestore
      try {
        await setDoc(doc(db, 'users', currentUser.uid), {
          completedModuleIds: newCompletedModuleIds,
        }, { merge: true });
      } catch (e) {
        console.warn('Failed to sync module progress to Firestore:', e);
      }
    }

    const updatedProfile: ChildProfile = {
      ...profile,
      coins: profile.coins + 15,
      score: profile.score + 50,
    };
    onProfileUpdate(updatedProfile);

    // Find next module in this level if exists
    const nextMod = selectedLevel.modules.find(m => m.order === mod.order + 1);
    if (nextMod) {
      setActiveModule(nextMod);
    } else {
      setActiveModule(null);
    }
  };

  // Speech read-aloud for module
  const handleToggleReadAloud = (textToRead: string) => {
    if (isReadingAloud) {
      stopSpeech();
      setIsReadingAloud(false);
    } else {
      stopSpeech();
      setIsReadingAloud(true);
      speakText(textToRead);
    }
  };

  // Start Level Quiz (only available when all modules are read in sequence!)
  const handleStartQuiz = () => {
    if (!allModulesCompletedInLevel) {
      soundEffects.wrong();
      return;
    }
    soundEffects.fanfare();
    setActiveModule(null);
    setActiveQuizQuestions(selectedLevel.quizQuestions);
    setQuizQuestionIndex(0);
    setSelectedAnswerId(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setQuizCorrectCount(0);
    setQuizFinished(false);
  };

  // Submit Answer in Level Quiz
  const handleSubmitQuizAnswer = () => {
    if (!activeQuizQuestions || !selectedAnswerId || isAnswerSubmitted) return;

    const currentQ = activeQuizQuestions[quizQuestionIndex];
    const chosen = currentQ.options.find(o => o.id === selectedAnswerId);
    const isCorrect = chosen?.isCorrect ?? false;

    setIsAnswerSubmitted(true);

    if (isCorrect) {
      soundEffects.correct();
      setQuizCorrectCount(prev => prev + 1);
      setQuizScore(prev => prev + currentQ.points);
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
    } else {
      soundEffects.wrong();
    }
  };

  // Next Question or Finish Quiz
  const handleNextQuizQuestion = async () => {
    if (!activeQuizQuestions) return;

    if (quizQuestionIndex + 1 < activeQuizQuestions.length) {
      setQuizQuestionIndex(prev => prev + 1);
      setSelectedAnswerId(null);
      setIsAnswerSubmitted(false);
      soundEffects.tap();
    } else {
      // Quiz Finished!
      soundEffects.fanfare();
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
      setQuizFinished(true);

      const passed = quizCorrectCount + (selectedAnswerId && activeQuizQuestions[quizQuestionIndex].options.find(o => o.id === selectedAnswerId)?.isCorrect ? 1 : 0) >= Math.ceil(activeQuizQuestions.length / 2);

      if (passed) {
        const nextLevelNum = Math.min(5, Math.max(currentLevelNumber, selectedLevelNumber + 1));
        const newCompletedLevels = Array.from(new Set([...completedLevelIds, selectedLevelNumber]));

        if (currentUser) {
          const updatedUser: AppUserProfile = {
            ...currentUser,
            currentLevel: nextLevelNum,
            completedLevelIds: newCompletedLevels,
            quizScores: {
              ...currentUser.quizScores,
              [selectedLevelNumber]: {
                score: quizScore + 50,
                passed: true,
                attempts: ((currentUser.quizScores?.[selectedLevelNumber]?.attempts) || 0) + 1,
                completedAt: new Date().toISOString(),
              },
            },
          };
          onUserUpdate(updatedUser);

          try {
            await setDoc(doc(db, 'users', currentUser.uid), {
              currentLevel: nextLevelNum,
              completedLevelIds: newCompletedLevels,
              quizScores: updatedUser.quizScores,
            }, { merge: true });
          } catch (e) {
            console.warn('Error saving quiz victory to Firestore:', e);
          }
        }

        const updatedProfile: ChildProfile = {
          ...profile,
          score: profile.score + selectedLevel.requiredExp + quizScore,
          coins: profile.coins + selectedLevel.rewardCoins,
          stars: profile.stars + selectedLevel.rewardStars,
          completedQuizzes: profile.completedQuizzes + 1,
        };
        onProfileUpdate(updatedProfile);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* ----------------------------------------------------
          1. HEADER & LEVEL NAVIGATOR
          ---------------------------------------------------- */}
      <div className="bg-gradient-to-r from-[#143D37] via-[#21736A] to-[#29827D] rounded-3xl p-5 sm:p-6 text-white shadow-xl border-2 border-[#6ED5B6]/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEffects.tap();
              onBack();
            }}
            className="p-1 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title="Kembali ke Beranda"
          >
            <BackButton3D size={42} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black font-['Fredoka'] tracking-wide">
                PETUALANGAN LEVEL BERTAHAP 🗺️✨
              </span>
              <span className="text-[10px] bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                Level {currentLevelNumber}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A2E7D2] font-extrabold">
              Baca Materi Berurutan • Buka Kuis Terkunci • Naik Level & Kumpulkan Bintang
            </p>
          </div>
        </div>

        {/* Level Stats Badge */}
        <div className="flex items-center gap-2 bg-black/25 px-4 py-2 rounded-2xl border border-white/20">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
            <span>⭐</span>
            <span>{profile.stars} Bintang</span>
          </div>
          <span className="text-white/40">|</span>
          <div className="flex items-center gap-1.5 text-xs font-black text-yellow-300">
            <span>🪙</span>
            <span>{profile.coins} Koin</span>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          2. LEVEL SELECTOR TABS (LEVEL 1 SAMPAI 5)
          ---------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
        {SEQUENTIAL_LEVELS.map(level => {
          const isUnlocked = level.levelNumber <= currentLevelNumber;
          const isCompleted = completedLevelIds.includes(level.levelNumber);
          const isSelected = selectedLevelNumber === level.levelNumber;

          return (
            <button
              key={level.levelNumber}
              type="button"
              disabled={!isUnlocked}
              onClick={() => {
                soundEffects.tap();
                setSelectedLevelNumber(level.levelNumber);
                setActiveModule(null);
                setActiveQuizQuestions(null);
              }}
              className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all text-center border-2 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-b from-[#21736A] to-[#143D37] text-white border-amber-400 shadow-lg scale-102'
                  : isUnlocked
                  ? 'bg-white hover:bg-emerald-50 text-[#143D37] border-emerald-300 shadow-sm'
                  : 'bg-gray-100 text-gray-400 border-gray-200 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="text-2xl relative">
                {level.icon}
                {!isUnlocked && (
                  <span className="absolute -top-1 -right-2 text-xs bg-gray-800 text-white rounded-full px-1">
                    🔒
                  </span>
                )}
                {isCompleted && (
                  <span className="absolute -top-1 -right-2 text-xs bg-emerald-500 text-white rounded-full px-1">
                    ✓
                  </span>
                )}
              </div>
              <span className="text-xs font-black font-['Fredoka']">
                Level {level.levelNumber}
              </span>
              <span className="text-[10px] font-bold line-clamp-1 opacity-90">
                {level.rankTitle.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ----------------------------------------------------
          3. MAIN LEVEL CONTENT AREA
          ---------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xl border-3 border-[#6ED5B6]/50 space-y-6">
        {/* Selected Level Banner */}
        <div className={`p-5 rounded-2xl text-white bg-gradient-to-r ${selectedLevel.bgGradient} flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md`}>
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-inner border border-white/30">
              {selectedLevel.icon}
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                {selectedLevel.rankTitle}
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-['Fredoka'] mt-1">
                {selectedLevel.title}
              </h2>
              <p className="text-xs sm:text-sm text-white/90 font-medium">
                {selectedLevel.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-white/80 block uppercase font-bold">Hadiah Level:</span>
              <span className="text-xs font-black text-amber-300">+{selectedLevel.rewardCoins} Koin • +{selectedLevel.rewardStars} Bintang</span>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------
            VIEW A: ACTIVE READING MODULE
            -------------------------------------------------- */}
        {activeModule ? (
          <div className="bg-emerald-50/50 rounded-2xl p-5 sm:p-6 border-2 border-emerald-300 space-y-5 animate-fade-in">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2.5 rounded-2xl bg-white shadow-sm border border-emerald-200">
                  {activeModule.icon}
                </span>
                <div>
                  <span className="text-xs font-extrabold text-[#21736A] uppercase tracking-wide">
                    Materi {activeModule.order} dari {selectedLevel.modules.length}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-[#143D37] font-['Fredoka']">
                    {activeModule.title}
                  </h3>
                  <h4 className="text-xs font-bold text-[#21736A]">
                    {activeModule.childTitle}
                  </h4>
                </div>
              </div>

              {/* Read Aloud Button */}
              <button
                type="button"
                onClick={() =>
                  handleToggleReadAloud(
                    `${activeModule.title}. ${activeModule.content.join(' ')}. Poin penting: ${activeModule.keyTakeaway}. Tips aksi: ${activeModule.actionTip}`
                  )
                }
                className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  isReadingAloud
                    ? 'bg-amber-500 text-white shadow-md animate-pulse'
                    : 'bg-white hover:bg-emerald-100 text-[#143D37] border border-emerald-300'
                }`}
              >
                <span>{isReadingAloud ? '🔊 Membaca...' : '🔈 Dengarkan'}</span>
              </button>
            </div>

            {/* Module Text Paragraphs */}
            <div className="space-y-3 bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm text-sm text-gray-800 leading-relaxed font-medium">
              {activeModule.content.map((p, idx) => (
                <p key={idx} className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-black mt-0.5">•</span>
                  <span>{p}</span>
                </p>
              ))}
            </div>

            {/* Key Takeaway & Action Tip Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <span className="text-xs font-black uppercase tracking-wide flex items-center gap-1">
                  <span>💡</span>
                  <span>Poin Kunci Edukasi:</span>
                </span>
                <p className="text-xs font-bold mt-1 leading-normal">
                  {activeModule.keyTakeaway}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900">
                <span className="text-xs font-black uppercase tracking-wide flex items-center gap-1">
                  <span>🎯</span>
                  <span>Aksi Pahlawan Senyum:</span>
                </span>
                <p className="text-xs font-bold mt-1 leading-normal">
                  {activeModule.actionTip}
                </p>
              </div>
            </div>

            {/* Bottom Complete & Continue Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  stopSpeech();
                  setActiveModule(null);
                }}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Tutup Materi
              </button>
              <button
                type="button"
                onClick={() => handleCompleteModule(activeModule)}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:opacity-95 text-white font-black text-sm shadow-md shadow-emerald-900/30 transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>✓ Selesai Membaca & Lanjutkan</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        ) : activeQuizQuestions ? (
          /* --------------------------------------------------
              VIEW B: ACTIVE LEVEL QUIZ (TERKUNCI SAMPAI MATERI LENGKAP)
              -------------------------------------------------- */
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-5 sm:p-7 border-2 border-indigo-200 space-y-6 animate-fade-in">
            {!quizFinished ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-indigo-200">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📝</span>
                    <span className="text-sm font-black text-indigo-950 uppercase font-['Fredoka']">
                      Ujian Kuis Level {selectedLevel.levelNumber} • Soal {quizQuestionIndex + 1} dari {activeQuizQuestions.length}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold bg-indigo-600 text-white px-3 py-1 rounded-full">
                    Skor: {quizScore}
                  </span>
                </div>

                {/* Question Text */}
                <div className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm space-y-3">
                  <span className="text-xs font-extrabold text-indigo-600 uppercase">
                    Kategori: {activeQuizQuestions[quizQuestionIndex].categoryLabel}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-gray-800 leading-snug">
                    {activeQuizQuestions[quizQuestionIndex].question}
                  </h3>
                </div>

                {/* Option Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeQuizQuestions[quizQuestionIndex].options.map(option => {
                    const isSelected = selectedAnswerId === option.id;
                    let btnStyle = 'bg-white border-gray-200 hover:bg-indigo-50/50 text-gray-800';

                    if (isAnswerSubmitted) {
                      if (option.isCorrect) {
                        btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 shadow-md font-black';
                      } else if (isSelected && !option.isCorrect) {
                        btnStyle = 'bg-rose-100 border-rose-500 text-rose-950 font-black';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-indigo-100 border-indigo-600 text-indigo-950 font-black shadow-sm';
                    }

                    return (
                      <button
                        key={option.id}
                        type="button"
                        disabled={isAnswerSubmitted}
                        onClick={() => {
                          soundEffects.tap();
                          setSelectedAnswerId(option.id);
                        }}
                        className={`p-4 rounded-2xl border-2 text-left flex items-center gap-3 transition-all cursor-pointer ${btnStyle}`}
                      >
                        <span className="text-2xl">{option.icon}</span>
                        <span className="text-sm font-bold flex-1">{option.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on Submit */}
                {isAnswerSubmitted && (
                  <div className="p-4 rounded-2xl bg-white border border-indigo-200 space-y-1 shadow-sm animate-fade-in">
                    <span className="text-xs font-black uppercase text-indigo-700">Penjelasan Dokter Gigi:</span>
                    <p className="text-xs text-gray-700 font-semibold">
                      {activeQuizQuestions[quizQuestionIndex].explanation}
                    </p>
                  </div>
                )}

                {/* Submit / Next Button */}
                <div className="flex justify-end pt-2">
                  {!isAnswerSubmitted ? (
                    <button
                      type="button"
                      disabled={!selectedAnswerId}
                      onClick={handleSubmitQuizAnswer}
                      className="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      Kirim Jawaban ✓
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNextQuizQuestion}
                      className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      {quizQuestionIndex + 1 < activeQuizQuestions.length ? 'Soal Berikutnya ➔' : 'Lihat Hasil Kuis 🏆'}
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* Quiz Result Summary */
              <div className="text-center py-6 space-y-4">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-400 flex items-center justify-center text-4xl shadow-xl animate-bounce">
                  🏆
                </div>
                <div>
                  <h3 className="text-2xl font-black font-['Fredoka'] text-indigo-950">
                    Selamat! Kuis Level {selectedLevel.levelNumber} Selesai!
                  </h3>
                  <p className="text-sm text-gray-600 font-bold mt-1">
                    Kamu berhasil menjawab benar {quizCorrectCount} dari {activeQuizQuestions.length} soal!
                  </p>
                </div>
                <div className="inline-flex items-center gap-4 bg-white px-5 py-2.5 rounded-2xl border border-indigo-200 shadow-sm text-sm font-black text-indigo-900">
                  <span>🪙 +{selectedLevel.rewardCoins} Koin</span>
                  <span>⭐ +{selectedLevel.rewardStars} Bintang</span>
                  <span>🛡️ +{quizScore} EXP</span>
                </div>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.tap();
                      setActiveQuizQuestions(null);
                    }}
                    className="py-3 px-8 rounded-2xl bg-[#21736A] hover:bg-[#143D37] text-white font-black text-sm shadow-lg transition-transform active:scale-95 cursor-pointer"
                  >
                    Kembali ke Peta Level 🗺️
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* --------------------------------------------------
              VIEW C: MODULES SEQUENCE LIST & LOCKED QUIZ BOX
              -------------------------------------------------- */
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-[#143D37] font-['Fredoka'] flex items-center gap-2">
                <span>📚</span>
                <span>Daftar Materi Pembelajaran (Harus Diselesaikan Berurutan):</span>
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Anak wajib membaca materi secara berurutan agar kuis terbuka dan pemahaman kesehatan gigi optimal.
              </p>
            </div>

            {/* Sequenced Module Cards */}
            <div className="space-y-3">
              {selectedLevel.modules.map((mod, idx) => {
                const isCompleted = completedModuleIds.includes(mod.id);
                // Module is unlocked if it's the 1st module, OR previous module is completed
                const isUnlocked = idx === 0 || completedModuleIds.includes(selectedLevel.modules[idx - 1].id);

                return (
                  <div
                    key={mod.id}
                    onClick={() => handleOpenModule(mod, isUnlocked)}
                    className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-50/70 border-emerald-300 hover:bg-emerald-50'
                        : isUnlocked
                        ? 'bg-white border-amber-300 shadow-sm hover:border-amber-400 hover:shadow-md'
                        : 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black ${
                        isCompleted
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : isUnlocked
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        {isCompleted ? '✓' : isUnlocked ? mod.icon : '🔒'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Materi {mod.order}
                          </span>
                          {isCompleted && (
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-200/60 px-2 py-0.5 rounded-full">
                              Selesai Dibaca ✓
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm sm:text-base font-black text-gray-800 mt-0.5">
                          {mod.title}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {mod.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        disabled={!isUnlocked}
                        className={`py-2 px-4 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : isUnlocked
                            ? 'bg-[#21736A] hover:bg-[#143D37] text-white shadow-sm'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isCompleted ? 'Baca Ulang 📖' : isUnlocked ? 'Mulai Baca ➔' : 'Terkunci 🔒'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* --------------------------------------------------
                LOCKED / UNLOCKED LEVEL QUIZ BOX (REQUIREMENT #3)
                -------------------------------------------------- */}
            <div className={`p-5 sm:p-6 rounded-2xl border-3 transition-all ${
              allModulesCompletedInLevel
                ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-emerald-400 shadow-md'
                : 'bg-amber-50/70 border-amber-300'
            }`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${
                    allModulesCompletedInLevel
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white animate-bounce'
                      : 'bg-amber-200 text-amber-800'
                  }`}>
                    {allModulesCompletedInLevel ? '🔓' : '🔒'}
                  </div>
                  <div>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h4 className="text-base sm:text-lg font-black text-gray-900 font-['Fredoka']">
                        Ujian Kuis Level {selectedLevel.levelNumber}
                      </h4>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        allModulesCompletedInLevel
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-300 text-amber-900'
                      }`}>
                        {allModulesCompletedInLevel ? 'Kuis Terbuka! 🌟' : 'Kuis Terkunci Sementara'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium mt-1 max-w-lg">
                      {allModulesCompletedInLevel
                        ? 'Hebat! Semua materi di level ini telah kamu baca secara berurutan. Sekarang kerjakan kuis untuk membuktikan kemampuanmu dan naik ke level berikutnya!'
                        : 'Kuis sengaja dikunci sementara. Selesaikan membaca semua materi di atas secara berurutan terlebih dahulu agar anak benar-benar memahami materi, bukan hanya menebak kuis!'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!allModulesCompletedInLevel}
                  onClick={handleStartQuiz}
                  className={`py-3 px-6 rounded-2xl font-black text-sm transition-all whitespace-nowrap shadow-md cursor-pointer ${
                    allModulesCompletedInLevel
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:opacity-95 text-white active:scale-95 shadow-emerald-900/30'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-80'
                  }`}
                >
                  {allModulesCompletedInLevel ? 'Kerjakan Kuis Level ➔' : 'Selesaikan Semua Materi 🔒'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
