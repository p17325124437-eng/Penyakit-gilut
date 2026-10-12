import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { FoodItem } from '../types';
import { FOOD_ITEMS } from '../data/foodData';
import { soundEffects, speakText } from '../utils/audio';
import {
  BackButton3D,
  ToothHealthy3D,
  ToothCavity3D,
  Apple3D,
  Candy3D,
  Milk3D,
  WaterGlass3D,
  Coin3D,
  Star3D,
  Trophy3D,
} from './GameIcons';

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

  // Render 3D icon for special foods or fall back to emoji
  const renderFoodGraphic = (food: FoodItem) => {
    if (food.id === 'apple' || food.name.toLowerCase().includes('apel')) {
      return <Apple3D size={84} className="animate-bounce-gentle" />;
    }
    if (food.id === 'candy' || food.name.toLowerCase().includes('permen') || food.name.toLowerCase().includes('cokelat')) {
      return <Candy3D size={84} className="animate-bounce-gentle" />;
    }
    if (food.id === 'milk' || food.name.toLowerCase().includes('susu') || food.name.toLowerCase().includes('keju')) {
      return <Milk3D size={84} className="animate-bounce-gentle" />;
    }
    if (food.id === 'water' || food.name.toLowerCase().includes('air')) {
      return <WaterGlass3D size={84} className="animate-bounce-gentle" />;
    }
    return <span className="text-7xl sm:text-8xl animate-bounce-gentle">{food.icon}</span>;
  };

  if (isFinished) {
    const coinsEarned = Math.floor(score / 3) + 50;
    return (
      <div className="max-w-xl mx-auto bg-[#FAFDF9] rounded-3xl border-2 border-[#C4DCAC] p-7 text-center shadow-lg space-y-6">
        <div className="flex justify-center">
          <Trophy3D size={80} className="animate-bounce-gentle" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#21736A] bg-[#E2F8F1] px-3.5 py-1 rounded-full border border-[#6ED5B6]/50">
            Tantangan Selesai!
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#143D37] font-['Fredoka']">
            Pakar Nutrisi Gigi Juara! 🥗
          </h2>
          <p className="text-sm text-[#143D37]/80 font-medium">
            Kamu telah mengenal makanan sahabat gigi dan makanan perusak gigi dengan sangat hebat!
          </p>
        </div>

        <div className="bg-[#FAF2E8] border border-[#FEE8A2] p-4 rounded-2xl flex items-center justify-around max-w-sm mx-auto shadow-inner">
          <div className="flex items-center gap-2">
            <Star3D size={28} />
            <div className="text-left">
              <div className="text-xs font-bold text-[#8F4619]">Total Skor</div>
              <div className="text-2xl font-black text-[#8F4619]">{score}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Coin3D size={28} />
            <div className="text-left">
              <div className="text-xs font-bold text-[#175851]">Hadiah Koin</div>
              <div className="text-2xl font-black text-[#21736A]">+{coinsEarned}</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            soundEffects.tap();
            onBack();
          }}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-[#21736A] via-[#29827D] to-[#143D37] hover:opacity-95 shadow-md shadow-[#143D37]/20 transition-transform active:scale-95 cursor-pointer"
        >
          Kembali ke Menu Utama
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 bg-[#FAFDF9] p-4 rounded-3xl border-2 border-[#C4DCAC] shadow-sm">
        <button
          onClick={() => {
            soundEffects.tap();
            onBack();
          }}
          className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          title="Kembali"
        >
          <BackButton3D size={42} />
        </button>

        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-black text-[#143D37] font-['Fredoka'] flex items-center justify-center gap-2">
            <Apple3D size={26} />
            <span>Piring Sahabat Gigi</span>
            <Candy3D size={26} />
          </h2>
          <div className="text-[11px] font-bold text-[#21736A]">
            Makanan mana yang menguatkan gigi atau merusaknya?
          </div>
        </div>

        <div className="bg-[#E2F8F1] text-[#143D37] font-black text-xs px-3.5 py-2 rounded-2xl border-2 border-[#6ED5B6] flex items-center gap-1.5 shadow-xs">
          <span>{currentIndex + 1} / {foods.length}</span>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-[#FAFDF9] rounded-3xl border-2 border-[#C4DCAC] p-6 sm:p-8 shadow-sm space-y-6 text-center">
        {/* Food Item display */}
        <div className="relative inline-block mx-auto">
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-tr from-[#EFF6E9] via-[#E2F8F1] to-[#FAF2E8] border-3 border-[#AEC892] shadow-inner flex items-center justify-center">
            {renderFoodGraphic(currentFood)}
          </div>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#143D37] font-['Fredoka']">
            {currentFood.name}
          </h3>
          <p className="text-xs sm:text-sm text-[#143D37]/75 font-semibold mt-1">
            Apakah makanan ini baik untuk kesehatan gigimu?
          </p>
        </div>

        {/* Choice buttons (Healthy plate vs Cavity hazard plate) */}
        {!feedback ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => handleClassify(true)}
              className="p-5 rounded-3xl bg-[#E2F8F1] hover:bg-[#A2E7D2]/40 border-3 border-[#6ED5B6] text-[#143D37] flex flex-col items-center gap-2 shadow-sm transition-all active:scale-95 group cursor-pointer"
            >
              <div className="flex items-center gap-2 group-hover:scale-110 transition-transform">
                <Apple3D size={44} />
                <ToothHealthy3D size={44} />
              </div>
              <div className="font-black text-base sm:text-lg font-['Fredoka'] text-[#143D37]">
                Sahabat Gigi Kuat!
              </div>
              <span className="text-[11px] font-bold text-[#175851] bg-[#FAFDF9] px-2.5 py-0.5 rounded-full border border-[#6ED5B6]/60">
                Membersihkan & Menguatkan
              </span>
            </button>

            <button
              onClick={() => handleClassify(false)}
              className="p-5 rounded-3xl bg-[#FDF0E9] hover:bg-[#FBE4D6] border-3 border-[#D97724] text-[#143D37] flex flex-col items-center gap-2 shadow-sm transition-all active:scale-95 group cursor-pointer"
            >
              <div className="flex items-center gap-2 group-hover:scale-110 transition-transform">
                <Candy3D size={44} />
                <ToothCavity3D size={44} />
              </div>
              <div className="font-black text-base sm:text-lg font-['Fredoka'] text-[#8F4619]">
                Awas Gigi Berlubang!
              </div>
              <span className="text-[11px] font-bold text-[#8F4619] bg-[#FAFDF9] px-2.5 py-0.5 rounded-full border border-[#D97724]/60">
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
                  ? 'bg-[#E2F8F1] border-[#6ED5B6] text-[#143D37]'
                  : 'bg-[#FAF2E8] border-[#F5B842] text-[#8F4619]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-sm sm:text-base flex items-center gap-1.5 font-['Fredoka']">
                  <span>{feedback.isCorrect ? '🎉 Benar Banget!' : '💡 Pelajaran Menarik:'}</span>
                </span>
                <span className="text-xs font-bold bg-[#FAFDF9] px-2.5 py-0.5 rounded-full border border-[#AEC892]">
                  {feedback.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                {currentFood.description}
              </p>
            </div>

            <button
              onClick={handleNextFood}
              className="w-full py-3.5 rounded-2xl font-black text-base text-white bg-gradient-to-r from-[#21736A] via-[#29827D] to-[#143D37] hover:opacity-95 shadow-md shadow-[#143D37]/25 transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
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
