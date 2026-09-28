import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { FoodItem } from '../types';
import { FOOD_ITEMS } from '../data/foodData';
import { soundEffects, speakText } from '../utils/audio';

interface FoodSorterProps {
  speechEnabled: boolean;
  onFinish: (score: number, coins: number) => void;
  onBack: () => void;
}

export const FoodSorterGame: React.FC<FoodSorterProps> = ({
  speechEnabled,
  onFinish,
  onBack,
}) => {
  const [foods] = useState<FoodItem[]>(() => [...FOOD_ITEMS].sort(() => Math.random() - 0.5));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string; badge: string } | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentFood = foods[currentIndex];

  const handleClassify = (isChosenHealthy: boolean) => {
    if (feedback || !currentFood) return;

    const isCorrect = isChosenHealthy === currentFood.isHealthy;

    if (isCorrect) {
      soundEffects.correct();
      setScore(prev => prev + 50);
      setFeedback({
        isCorrect: true,
        message: currentFood.isHealthy
          ? `Tepat sekali! ${currentFood.name} adalah sahabat super untuk gigi kuat!`
          : `Benar! ${currentFood.name} banyak mengandung gula/asam yang bisa melubangi gigi. Batasi ya!`,
        badge: currentFood.badge,
      });

      if (speechEnabled) {
        speakText(currentFood.description);
      }
    } else {
      soundEffects.wrong();
      setFeedback({
        isCorrect: false,
        message: currentFood.isHealthy
          ? `Oops! Sebenarnya ${currentFood.name} sangat baik untuk gigi kita!`
          : `Kurang tepat! ${currentFood.name} dapat merusak gigi jika sering dimakan!`,
        badge: currentFood.badge,
      });

      if (speechEnabled) {
        speakText(currentFood.description);
      }
    }
  };

  const handleNextFood = () => {
    soundEffects.tap();
    setFeedback(null);

    if (currentIndex + 1 < foods.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Completed all items
      soundEffects.fanfare();
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });
      setIsFinished(true);
      const coinsEarned = Math.floor(score / 3) + 50;
      onFinish(score, coinsEarned);
    }
  };

  if (isFinished) {
    const coinsEarned = Math.floor(score / 3) + 50;
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl border-2 border-sky-200 p-7 text-center shadow-lg space-y-6">
        <div className="text-6xl animate-bounce-gentle">🍎✨</div>
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
            Tantangan Selesai!
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 font-['Fredoka']">
            Pakar Nutrisi Gigi Juara! 🥗
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Kamu telah mengenal makanan sahabat gigi dan makanan perusak gigi dengan sangat hebat!
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-around max-w-sm mx-auto">
          <div>
            <div className="text-xs font-bold text-slate-500">Total Skor</div>
            <div className="text-2xl font-black text-amber-700">{score}</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">Hadiah Koin</div>
            <div className="text-2xl font-black text-emerald-600">+{coinsEarned} 🪙</div>
          </div>
        </div>

        <button
          onClick={() => {
            soundEffects.tap();
            onBack();
          }}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-md shadow-sky-500/25 transition-transform active:scale-95"
        >
          Kembali ke Menu Utama
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-3xl border-2 border-sky-100 shadow-sm">
        <button
          onClick={() => {
            soundEffects.tap();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-transform active:scale-95"
        >
          <span>←</span>
          <span>Kembali</span>
        </button>

        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-black text-slate-800 font-['Fredoka']">
            Piring Sahabat Gigi 🍽️
          </h2>
          <div className="text-[11px] font-bold text-slate-500">
            Makanan mana yang menguatkan gigi atau merusaknya?
          </div>
        </div>

        <div className="bg-sky-50 text-sky-800 font-black text-xs px-3 py-1.5 rounded-2xl border border-sky-200">
          {currentIndex + 1} / {foods.length}
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-3xl border-2 border-sky-100 p-6 sm:p-8 shadow-sm space-y-6 text-center">
        {/* Food Item display */}
        <div className="relative inline-block mx-auto">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-tr from-sky-100 via-indigo-50 to-pink-50 border-3 border-sky-200 shadow-inner flex items-center justify-center text-7xl sm:text-8xl animate-bounce-gentle">
            {currentFood.icon}
          </div>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800 font-['Fredoka']">
            {currentFood.name}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
            Apakah makanan ini baik untuk kesehatan gigimu?
          </p>
        </div>

        {/* Choice buttons (Healthy plate vs Cavity hazard plate) */}
        {!feedback ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => handleClassify(true)}
              className="p-5 rounded-3xl bg-emerald-50 hover:bg-emerald-100 border-3 border-emerald-300 hover:border-emerald-400 text-emerald-950 flex flex-col items-center gap-2 shadow-sm transition-all active:scale-95 group"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">🍏🦷</span>
              <div className="font-black text-base sm:text-lg font-['Fredoka']">
                Sahabat Gigi Kuat!
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-white/80 px-2.5 py-0.5 rounded-full">
                Membersihkan & Menguatkan
              </span>
            </button>

            <button
              onClick={() => handleClassify(false)}
              className="p-5 rounded-3xl bg-rose-50 hover:bg-rose-100 border-3 border-rose-300 hover:border-rose-400 text-rose-950 flex flex-col items-center gap-2 shadow-sm transition-all active:scale-95 group"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">🍭👾</span>
              <div className="font-black text-base sm:text-lg font-['Fredoka']">
                Awas Gigi Berlubang!
              </div>
              <span className="text-[11px] font-bold text-rose-700 bg-white/80 px-2.5 py-0.5 rounded-full">
                Banyak Gula / Asam Perusak
              </span>
            </button>
          </div>
        ) : (
          /* Feedback card */
          <div className="space-y-4 pt-2">
            <div
              className={`p-4 rounded-3xl border-2 text-left space-y-2 ${
                feedback.isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-sm sm:text-base flex items-center gap-1.5 font-['Fredoka']">
                  <span>{feedback.isCorrect ? '🎉 Benar Banget!' : '💡 Pelajaran Menarik:'}</span>
                </span>
                <span className="text-xs font-bold bg-white/90 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {feedback.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                {currentFood.description}
              </p>
            </div>

            <button
              onClick={handleNextFood}
              className="w-full py-3.5 rounded-2xl font-black text-base text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-md shadow-sky-500/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{currentIndex + 1 < foods.length ? 'Makanan Berikutnya' : 'Selesaikan Tantangan'}</span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
