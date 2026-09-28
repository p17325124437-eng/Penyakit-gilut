import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { soundEffects, speakText, stopSpeech } from '../utils/audio';

interface BrushingCoachProps {
  speechEnabled: boolean;
  onFinishSession: (coins: number) => void;
  onBack: () => void;
}

interface StepInfo {
  title: string;
  quadrant: string;
  icon: string;
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
      icon: '😁',
      instruction: 'Sikat dengan gerakan memutar bulat-bulat kecil seperti menggambar donat manis!',
      tip: 'Jangan tekan terlalu keras ya, pijat lembut gusi dan gigimu.',
    },
    {
      title: 'Geraham Belakang Kiri',
      quadrant: 'Gigi Pengunyah Kiri',
      icon: '👈',
      instruction: 'Sikat permukaan atas tempat mengunyah dengan gerakan maju-mundur!',
      tip: 'Bersihkan sisa makanan yang sering terselip di cekungan gigi geraham.',
    },
    {
      title: 'Geraham Belakang Kanan',
      quadrant: 'Gigi Pengunyah Kanan',
      icon: '👉',
      instruction: 'Sekarang pindah ke sisi kanan! Sikat maju-mundur sampai berbusa lembut.',
      tip: 'Pastikan bulu sikat menjangkau gigi yang paling belakang.',
    },
    {
      title: 'Bagian Dalam & Lidah',
      quadrant: 'Dinding Dalam & Permukaan Lidah',
      icon: '👅',
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
      <div className="max-w-xl mx-auto bg-white rounded-3xl border-2 border-cyan-200 p-7 text-center shadow-lg space-y-6">
        <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-cyan-400 to-teal-400 rounded-3xl flex items-center justify-center text-6xl shadow-lg shadow-cyan-300/40 animate-bounce-gentle">
          ✨🦷
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-100 px-3 py-1 rounded-full">
            Misi Berhasil!
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 font-['Fredoka']">
            Gigimu Bersinar Sempurna! ⭐
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Hebat sekali! Kamu berhasil menyikat gigi selama 2 menit penuh. Kuman karies dan plak sudah kabur!
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-around max-w-sm mx-auto">
          <div>
            <div className="text-xs font-bold text-slate-500">Hadiah Disiplin</div>
            <div className="text-2xl font-black text-emerald-600">+100 🪙</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">Bintang Senyum</div>
            <div className="text-2xl font-black text-yellow-600">+2 ⭐</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-slate-700 bg-slate-100 hover:bg-slate-200 transition-transform active:scale-95"
          >
            Ulangi Sikat Gigi
          </button>
          <button
            onClick={() => {
              soundEffects.tap();
              onBack();
            }}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl font-black text-white bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 shadow-md shadow-cyan-500/25 transition-transform active:scale-95"
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
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-3xl border-2 border-cyan-100 shadow-sm">
        <button
          onClick={() => {
            soundEffects.tap();
            stopSpeech();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-transform active:scale-95"
        >
          <span>←</span>
          <span>Kembali</span>
        </button>

        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-black text-slate-800 font-['Fredoka']">
            Simulator Sikat Gigi 2 Menit 🪥
          </h2>
          <div className="text-[11px] font-bold text-slate-500">
            Panduan ceria menyikat gigi sampai bersih
          </div>
        </div>

        <div className="bg-cyan-50 text-cyan-800 font-black text-xs px-3 py-1.5 rounded-2xl border border-cyan-200">
          Tahap {currentStepIndex + 1} / 4
        </div>
      </div>

      {/* Main Timer Display & Guidance */}
      <div className="bg-white rounded-3xl border-2 border-cyan-100 p-6 sm:p-8 shadow-sm space-y-6 text-center">
        {/* Animated Quadrant Visual */}
        <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
          {/* Circular SVG Timer Ring */}
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="88"
              cy="88"
              r="76"
              stroke="#E2E8F0"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="88"
              cy="88"
              r="76"
              stroke="#06B6D4"
              strokeWidth="12"
              strokeDasharray={477}
              strokeDashoffset={477 - (477 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Central Time and Animated Icon */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl ${isActive ? 'animate-bounce-gentle' : ''}`}>
              {currentStep.icon}
            </span>
            <div className="text-3xl font-black text-slate-800 font-['Fredoka'] tracking-tight">
              {formattedTime}
            </div>
            <div className="text-[11px] font-extrabold text-cyan-600 uppercase">
              {progressPercent}% Bersih
            </div>
          </div>
        </div>

        {/* Step instruction card */}
        <div className="p-4 rounded-3xl bg-cyan-50 border-2 border-cyan-200 text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-cyan-800 tracking-wider">
              {currentStep.title}: {currentStep.quadrant}
            </span>
            <span className="text-xs font-bold bg-white text-cyan-700 px-2 py-0.5 rounded-full border border-cyan-200">
              30 Detik
            </span>
          </div>
          <p className="text-sm font-bold text-slate-800 leading-snug">
            {currentStep.instruction}
          </p>
          <p className="text-xs text-slate-500 font-medium italic">
            💡 Tips: {currentStep.tip}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={toggleTimer}
            className={`flex-1 py-4 rounded-2xl font-black text-base sm:text-lg text-white shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 ${
              isActive
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
                : 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 shadow-cyan-500/30'
            }`}
          >
            <span>{isActive ? '⏸️ Jeda Sebentar' : '▶️ Mulai Sikat Gigi!'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-all active:scale-95"
            title="Ulangi dari awal"
          >
            🔄
          </button>
        </div>
      </div>
    </div>
  );
};
