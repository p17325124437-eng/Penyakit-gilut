import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { soundEffects, speakText, stopSpeech } from '../utils/audio';
import {
  BackButton3D,
  PlayButton3D,
  ToothHealthy3D,
  Toothbrush3D,
  Toothpaste3D,
  DentalFloss3D,
  Mouthwash3D,
  Coin3D,
  Star3D,
  Trophy3D,
} from './GameIcons';

interface BrushingCoachProps {
  speechEnabled: boolean;
  onFinishSession: (coins: number) => void;
  onBack: () => void;
}

interface StepInfo {
  title: string;
  quadrant: string;
  iconComponent: React.ReactNode;
  instruction: string;
  tip: string;
}

export const BrushingCoach: React.FC<BrushingCoachProps> = ({
  speechEnabled,
  onFinishSession,
  onBack,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const timerRef = useRef<any>(null);
  const audioIntervalRef = useRef<any>(null);

  const steps: StepInfo[] = [
    {
      title: 'Bagian Depan',
      quadrant: 'Gigi Seri & Taring Depan',
      iconComponent: <Toothbrush3D size={48} className="animate-bounce-gentle" />,
      instruction: 'Sikat dengan gerakan memutar bulat-bulat kecil seperti menggambar donat manis!',
      tip: 'Jangan tekan terlalu keras ya, pijat lembut gusi dan gigimu.',
    },
    {
      title: 'Geraham Belakang Kiri',
      quadrant: 'Gigi Pengunyah Kiri',
      iconComponent: <ToothHealthy3D size={48} className="animate-pulse" />,
      instruction: 'Sikat permukaan atas tempat mengunyah dengan gerakan maju-mundur!',
      tip: 'Bersihkan sisa makanan yang sering terselip di cekungan gigi geraham.',
    },
    {
      title: 'Geraham Belakang Kanan',
      quadrant: 'Gigi Pengunyah Kanan',
      iconComponent: <Toothpaste3D size={48} className="animate-bounce-gentle" />,
      instruction: 'Sekarang pindah ke sisi kanan! Sikat maju-mundur sampai berbusa lembut.',
      tip: 'Pastikan bulu sikat menjangkau gigi yang paling belakang.',
    },
    {
      title: 'Bagian Dalam & Lidah',
      quadrant: 'Dinding Dalam & Permukaan Lidah',
      iconComponent: <Mouthwash3D size={48} className="animate-spin-slow" />,
      instruction: 'Cungkil kotoran dari dalam ke luar, lalu sikat lidah dengan lembut agar napas harum!',
      tip: 'Lidah yang bersih membuat napasmu segar dan bebas naga bau mulut.',
    },
  ];

  // Each step takes 30 seconds (total 120s)
  const currentStepIndex = Math.min(Math.floor((120 - secondsLeft) / 30), 3);
  const currentStep = steps[currentStepIndex];

  // Handle timer
  useEffect(() => {
    if (isActive && secondsLeft > 0) {
      timerRef.current = setTimeout(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      // Completed 2 minutes!
      setIsActive(false);
      setIsFinished(true);
      soundEffects.fanfare();
      soundEffects.coin();
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
      });
      if (speechEnabled) {
        speakText('Hore! Dua menit selesai! Gigimu sekarang bersih, kuat, dan berkilau!');
      }
      onFinishSession(100);
    }
    return () => clearTimeout(timerRef.current);
  }, [isActive, secondsLeft]);

  // Audio brush sound during brushing
  useEffect(() => {
    if (isActive) {
      audioIntervalRef.current = setInterval(() => {
        soundEffects.brush();
      }, 1500);
    } else {
      clearInterval(audioIntervalRef.current);
    }
    return () => clearInterval(audioIntervalRef.current);
  }, [isActive]);

  const toggleTimer = () => {
    soundEffects.tap();
    if (!isActive) {
      setIsActive(true);
      if (speechEnabled && secondsLeft === 120) {
        speakText('Ayo kita mulai menyikat gigi selama dua menit! ' + currentStep.instruction);
      }
    } else {
      setIsActive(false);
      stopSpeech();
    }
  };

  const handleReset = () => {
    soundEffects.tap();
    stopSpeech();
    setIsActive(false);
    setSecondsLeft(120);
    setIsFinished(false);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = Math.round(((120 - secondsLeft) / 120) * 100);

  if (isFinished) {
    return (
      <div className="max-w-xl mx-auto bg-[#FAFDF9] rounded-3xl border-2 border-[#C4DCAC] p-7 text-center shadow-lg space-y-6">
        <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-[#21736A] via-[#29827D] to-[#6ED5B6] rounded-3xl flex items-center justify-center shadow-lg shadow-[#143D37]/25 animate-bounce-gentle">
          <ToothHealthy3D size={64} />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#21736A] bg-[#E2F8F1] px-3.5 py-1 rounded-full border border-[#6ED5B6]/50">
            Misi Berhasil!
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#143D37] font-['Fredoka']">
            Gigimu Bersinar Sempurna! ⭐
          </h2>
          <p className="text-sm text-[#143D37]/80 font-medium">
            Hebat sekali! Kamu berhasil menyikat gigi selama 2 menit penuh. Kuman karies dan plak sudah kabur!
          </p>
        </div>

        <div className="bg-[#FAF2E8] border border-[#FEE8A2] p-4 rounded-2xl flex items-center justify-around max-w-sm mx-auto shadow-inner">
          <div className="flex items-center gap-2">
            <Coin3D size={28} />
            <div className="text-left">
              <div className="text-xs font-bold text-[#8F4619]">Hadiah Disiplin</div>
              <div className="text-2xl font-black text-[#175851]">+100</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Star3D size={28} />
            <div className="text-left">
              <div className="text-xs font-bold text-[#8F4619]">Bintang Senyum</div>
              <div className="text-2xl font-black text-[#D97724]">+2</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-[#143D37] bg-[#EFF6E9] hover:bg-[#E2F8F1] border-2 border-[#C4DCAC] transition-transform active:scale-95 cursor-pointer"
          >
            Ulangi Sikat Gigi
          </button>
          <button
            onClick={() => {
              soundEffects.tap();
              onBack();
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-[#21736A] via-[#29827D] to-[#143D37] hover:opacity-95 shadow-md shadow-[#143D37]/25 transition-transform active:scale-95 cursor-pointer"
          >
            Selesai & Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 bg-[#FAFDF9] p-4 rounded-3xl border-2 border-[#C4DCAC] shadow-sm">
        <button
          onClick={() => {
            soundEffects.tap();
            stopSpeech();
            onBack();
          }}
          className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          title="Kembali"
        >
          <BackButton3D size={42} />
        </button>

        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-black text-[#143D37] font-['Fredoka'] flex items-center justify-center gap-2">
            <Toothbrush3D size={26} />
            <span>Simulator Sikat Gigi 2 Menit</span>
          </h2>
          <div className="text-[11px] font-bold text-[#21736A]">
            Panduan ceria menyikat gigi sampai bersih
          </div>
        </div>

        <div className="bg-[#E2F8F1] text-[#143D37] font-black text-xs px-3.5 py-2 rounded-2xl border-2 border-[#6ED5B6] flex items-center gap-1 shadow-xs">
          <span>Tahap {currentStepIndex + 1} / 4</span>
        </div>
      </div>

      {/* Main Timer Display & Guidance */}
      <div className="bg-[#FAFDF9] rounded-3xl border-2 border-[#C4DCAC] p-6 sm:p-8 shadow-sm space-y-6 text-center">
        {/* Animated Quadrant Visual */}
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          {/* Circular SVG Timer Ring */}
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="82"
              stroke="#EFF6E9"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="96"
              cy="96"
              r="82"
              stroke="#21736A"
              strokeWidth="12"
              strokeDasharray={515}
              strokeDashoffset={515 - (515 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Central Time and Animated Icon */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="mb-1">
              {currentStep.iconComponent}
            </div>
            <div className="text-3xl font-black text-[#143D37] font-['Fredoka'] tracking-tight">
              {formattedTime}
            </div>
            <div className="text-[11px] font-extrabold text-[#21736A] uppercase">
              {progressPercent}% Bersih
            </div>
          </div>
        </div>

        {/* Step instruction card */}
        <div className="p-4 rounded-3xl bg-[#E2F8F1] border-2 border-[#6ED5B6] text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-[#143D37] tracking-wider">
              {currentStep.title}: {currentStep.quadrant}
            </span>
            <span className="text-xs font-bold bg-[#FAFDF9] text-[#175851] px-2.5 py-0.5 rounded-full border border-[#6ED5B6]">
              30 Detik
            </span>
          </div>
          <p className="text-sm font-bold text-[#143D37] leading-snug">
            {currentStep.instruction}
          </p>
          <p className="text-xs text-[#21736A] font-medium italic">
            💡 Tips: {currentStep.tip}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={toggleTimer}
            className={`flex-1 py-4 rounded-2xl font-black text-base sm:text-lg text-white shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
              isActive
                ? 'bg-[#D97724] hover:bg-[#BF7E43] shadow-[#D97724]/30'
                : 'bg-gradient-to-r from-[#21736A] via-[#29827D] to-[#143D37] hover:opacity-95 shadow-[#143D37]/30'
            }`}
          >
            <span>{isActive ? '⏸️ Jeda Sebentar' : 'Mulai Sikat Gigi!'}</span>
            {!isActive && <PlayButton3D size={28} />}
          </button>

          <button
            onClick={handleReset}
            className="p-4 rounded-2xl bg-[#EFF6E9] hover:bg-[#E2F8F1] text-[#143D37] border-2 border-[#C4DCAC] font-bold transition-all active:scale-95 cursor-pointer text-xl"
            title="Ulangi dari awal"
          >
            🔄
          </button>
        </div>
      </div>
    </div>
  );
};
