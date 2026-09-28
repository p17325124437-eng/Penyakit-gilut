import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../utils/audio';

interface GermGameProps {
  highScore: number;
  onFinishGame: (score: number, coins: number) => void;
  onBack: () => void;
}

interface ToothSlot {
  id: number;
  name: string;
  hasGerm: boolean;
  germType: 'karies' | 'karang' | 'asam';
  germAvatar: string;
  isCleaned: boolean;
}

export const GermBusterGame: React.FC<GermGameProps> = ({
  highScore,
  onFinishGame,
  onBack,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const initialTeeth: ToothSlot[] = [
    { id: 1, name: 'Geraham Kiri', hasGerm: false, germType: 'karies', germAvatar: '👾', isCleaned: false },
    { id: 2, name: 'Gigi Taring Kiri', hasGerm: false, germType: 'karang', germAvatar: '🧱', isCleaned: false },
    { id: 3, name: 'Gigi Seri Depan', hasGerm: false, germType: 'asam', germAvatar: '☣️', isCleaned: false },
    { id: 4, name: 'Gigi Seri Kanan', hasGerm: false, germType: 'karies', germAvatar: '👾', isCleaned: false },
    { id: 5, name: 'Gigi Taring Kanan', hasGerm: false, germType: 'karang', germAvatar: '🧱', isCleaned: false },
    { id: 6, name: 'Geraham Kanan', hasGerm: false, germType: 'asam', germAvatar: '☣️', isCleaned: false },
  ];

  const [teeth, setTeeth] = useState<ToothSlot[]>(initialTeeth);
  const timerRef = useRef<any>(null);
  const spawnerRef = useRef<any>(null);

  const startGame = () => {
    soundEffects.fanfare();
    setIsPlaying(true);
    setIsGameOver(false);
    setTimeLeft(30);
    setScore(0);
    setCombo(0);
    setTeeth(initialTeeth);
  };

  // Timer countdown
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      // Game over
      setIsPlaying(false);
      setIsGameOver(true);
      soundEffects.fanfare();
      const earnedCoins = Math.floor(score / 5) + 30;
      if (score > highScore) {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
      onFinishGame(score, earnedCoins);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, timeLeft]);

  // Spawn germs randomly on teeth
  useEffect(() => {
    if (!isPlaying) return;

    spawnerRef.current = setInterval(() => {
      setTeeth(prev => {
        // Pick random tooth that has no germ
        const emptyIndices = prev
          .map((t, idx) => (!t.hasGerm ? idx : -1))
          .filter(idx => idx !== -1);

        if (emptyIndices.length === 0) return prev;

        const targetIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        const germTypes: ('karies' | 'karang' | 'asam')[] = ['karies', 'karang', 'asam'];
        const avatars = { karies: '👾', karang: '🧱', asam: '☣️' };
        const randomType = germTypes[Math.floor(Math.random() * germTypes.length)];

        return prev.map((t, idx) =>
          idx === targetIdx
            ? { ...t, hasGerm: true, germType: randomType, germAvatar: avatars[randomType], isCleaned: false }
            : t
        );
      });
    }, 700);

    return () => clearInterval(spawnerRef.current);
  }, [isPlaying]);

  const handleWhackGerm = (toothId: number) => {
    if (!isPlaying) return;

    const target = teeth.find(t => t.id === toothId);
    if (target && target.hasGerm) {
      soundEffects.brush();
      soundEffects.pop();
      setCombo(prev => prev + 1);
      const points = 20 + Math.min(combo * 5, 30);
      setScore(prev => prev + points);

      setTeeth(prev =>
        prev.map(t =>
          t.id === toothId ? { ...t, hasGerm: false, isCleaned: true } : t
        )
      );

      // Reset clean highlight after 400ms
      setTimeout(() => {
        setTeeth(prev =>
          prev.map(t => (t.id === toothId ? { ...t, isCleaned: false } : t))
        );
      }, 400);
    } else {
      soundEffects.wrong();
      setCombo(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-3xl border-2 border-rose-100 shadow-sm">
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
            Basmi Kuman Gigi! 🪥👾
          </h2>
          <div className="text-[11px] font-bold text-slate-500">
            Ketuk kuman yang muncul secepat kilat!
          </div>
        </div>

        <div className="bg-rose-50 text-rose-800 font-black text-xs px-3 py-1.5 rounded-2xl border border-rose-200">
          Rekor: {Math.max(score, highScore)}
        </div>
      </div>

      {/* Game board */}
      <div className="bg-gradient-to-b from-sky-100 via-rose-50 to-pink-100 rounded-3xl border-3 border-rose-200 p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* HUD Stats */}
        <div className="flex items-center justify-between mb-6 bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-rose-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⏱️</span>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Waktu</div>
              <div className={`text-xl font-black ${timeLeft <= 5 ? 'text-red-600 animate-ping' : 'text-slate-800'}`}>
                {timeLeft}s
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Kombo Sikat</div>
            <div className="text-xl font-black text-rose-600 font-['Fredoka']">
              {combo > 1 ? `x${combo} 🔥` : '-'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase text-right">Skor</div>
              <div className="text-xl font-black text-amber-600 text-right font-['Fredoka']">
                {score}
              </div>
            </div>
            <span className="text-2xl">✨</span>
          </div>
        </div>

        {/* Teeth Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {teeth.map(tooth => (
            <div
              key={tooth.id}
              onClick={() => handleWhackGerm(tooth.id)}
              className={`h-36 rounded-3xl p-3 flex flex-col items-center justify-between border-3 cursor-pointer select-none transition-all active:scale-95 relative overflow-hidden shadow-sm ${
                tooth.isCleaned
                  ? 'bg-emerald-100 border-emerald-400 ring-4 ring-emerald-300'
                  : tooth.hasGerm
                  ? 'bg-rose-100 border-rose-400 animate-pulse'
                  : 'bg-white border-slate-200 hover:border-sky-300'
              }`}
            >
              {/* Tooth icon */}
              <div className="text-4xl sm:text-5xl mt-1">
                {tooth.isCleaned ? '✨' : '🦷'}
              </div>

              {/* Germ Monster if present */}
              {tooth.hasGerm && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-rose-500/20 backdrop-blur-2xs">
                  <span className="text-5xl sm:text-6xl animate-bounce-gentle drop-shadow-md">
                    {tooth.germAvatar}
                  </span>
                  <span className="text-[10px] font-black uppercase text-rose-800 bg-white/90 px-2 py-0.5 rounded-full mt-1">
                    Sikat Aku!
                  </span>
                </div>
              )}

              {/* Clean bubbles effect */}
              {tooth.isCleaned && (
                <div className="absolute inset-0 flex items-center justify-center bg-emerald-400/30">
                  <span className="text-sm font-black text-emerald-800 bg-white px-2 py-1 rounded-full shadow-xs">
                    BERSIH! 🪥
                  </span>
                </div>
              )}

              <span className="text-[11px] font-bold text-slate-600">
                {tooth.name}
              </span>
            </div>
          ))}
        </div>

        {/* Start Game / Game Over Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-6 z-20">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
              <div className="text-5xl">
                {isGameOver ? (score > highScore ? '🎉' : '👏') : '🪥'}
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-800 font-['Fredoka']">
                  {isGameOver ? 'Permainan Selesai!' : 'Ayo Basmi Kuman!'}
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  {isGameOver
                    ? `Kamu mengumpulkan ${score} poin! Kuman berhasil disingkirkan!`
                    : 'Kuman jahat ingin membuat gigi berlubang. Ketuk mereka secepat mungkin dengan sikat gigimu!'}
                </p>
              </div>

              {isGameOver && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center justify-around">
                  <div>
                    <div className="text-xs font-bold text-slate-500">Skor Akhir</div>
                    <div className="text-xl font-black text-amber-700">{score}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500">Hadiah Koin</div>
                    <div className="text-xl font-black text-emerald-600">+{Math.floor(score / 5) + 30} 🪙</div>
                  </div>
                </div>
              )}

              <button
                onClick={startGame}
                className="w-full py-3.5 rounded-2xl font-black text-base text-white bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-md shadow-rose-500/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span>{isGameOver ? 'Main Lagi' : 'Mulai Sekarang!'}</span>
                <span>🚀</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
