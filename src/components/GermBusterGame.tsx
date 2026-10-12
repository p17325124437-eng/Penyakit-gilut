import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../utils/audio';
import {
  BackButton3D,
  PlayButton3D,
  ToothHealthy3D,
  Bacteria3D,
  Streptococcus3D,
  Plaque3D,
  AcidErosion3D,
  Toothbrush3D,
  Coin3D,
  Star3D,
  Trophy3D,
} from './GameIcons';

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
    { id: 1, name: 'Geraham Kiri', hasGerm: false, germType: 'karies', isCleaned: false },
    { id: 2, name: 'Taring Kiri', hasGerm: false, germType: 'karang', isCleaned: false },
    { id: 3, name: 'Seri Depan', hasGerm: false, germType: 'asam', isCleaned: false },
    { id: 4, name: 'Seri Kanan', hasGerm: false, germType: 'karies', isCleaned: false },
    { id: 5, name: 'Taring Kanan', hasGerm: false, germType: 'karang', isCleaned: false },
    { id: 6, name: 'Geraham Kanan', hasGerm: false, germType: 'asam', isCleaned: false },
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
        const emptyIndices = prev
          .map((t, idx) => (!t.hasGerm ? idx : -1))
          .filter(idx => idx !== -1);

        if (emptyIndices.length === 0) return prev;

        const targetIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        const germTypes: ('karies' | 'karang' | 'asam')[] = ['karies', 'karang', 'asam'];
        const randomType = germTypes[Math.floor(Math.random() * germTypes.length)];

        return prev.map((t, idx) =>
          idx === targetIdx
            ? { ...t, hasGerm: true, germType: randomType, isCleaned: false }
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

  const renderGermIcon = (type: 'karies' | 'karang' | 'asam') => {
    switch (type) {
      case 'karies':
        return <Bacteria3D size={56} className="animate-bounce" />;
      case 'karang':
        return <Plaque3D size={56} className="animate-pulse" />;
      case 'asam':
        return <AcidErosion3D size={56} className="animate-spin-slow" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Top Header */}
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
            <Toothbrush3D size={28} />
            <span>Basmi Kuman Gigi!</span>
            <Bacteria3D size={28} />
          </h2>
          <div className="text-[11px] font-bold text-[#4AA294]">
            Ketuk kuman yang muncul secepat kilat!
          </div>
        </div>

        <div className="bg-[#FAF2E8] text-[#BF7E43] font-black text-xs px-3.5 py-2 rounded-2xl border-2 border-[#F5B842] flex items-center gap-1.5 shadow-xs">
          <Trophy3D size={20} />
          <span>Rekor: {Math.max(score, highScore)}</span>
        </div>
      </div>

      {/* Game board */}
      <div className="bg-gradient-to-b from-[#143D37] via-[#21736A] to-[#29827D] rounded-3xl border-3 border-[#5AB3AC]/60 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* HUD Stats */}
        <div className="flex items-center justify-between mb-6 bg-[#FAFDF9]/95 backdrop-blur-md p-3.5 rounded-2xl border-2 border-[#C4DCAC] shadow-md relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⏱️</span>
            <div>
              <div className="text-[10px] font-black text-[#767459] uppercase">Waktu</div>
              <div className={`text-xl font-black ${timeLeft <= 5 ? 'text-[#B86238] animate-ping' : 'text-[#143D37]'}`}>
                {timeLeft}s
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-[10px] font-black text-[#767459] uppercase">Kombo Sikat</div>
            <div className="text-xl font-black text-[#BF7E43] font-['Fredoka']">
              {combo > 1 ? `x${combo} 🔥` : '-'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Star3D size={28} />
            <div>
              <div className="text-[10px] font-black text-[#767459] uppercase text-right">Skor</div>
              <div className="text-xl font-black text-[#21736A] text-right font-['Fredoka']">
                {score}
              </div>
            </div>
          </div>
        </div>

        {/* Teeth Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 relative z-10">
          {teeth.map(tooth => (
            <div
              key={tooth.id}
              onClick={() => handleWhackGerm(tooth.id)}
              className={`h-40 rounded-3xl p-3 flex flex-col items-center justify-between border-3 cursor-pointer select-none transition-all active:scale-95 relative overflow-hidden shadow-sm ${
                tooth.isCleaned
                  ? 'bg-[#E2F8F1] border-[#6ED5B6] ring-4 ring-[#6ED5B6]'
                  : tooth.hasGerm
                  ? 'bg-[#FDF0E9] border-[#B86238] ring-2 ring-[#B86238]/60'
                  : 'bg-[#FAFDF9] border-[#C4DCAC] hover:border-[#6ED5B6]'
              }`}
            >
              {/* Tooth icon */}
              <div className="mt-1 flex items-center justify-center">
                {tooth.isCleaned ? (
                  <div className="relative">
                    <ToothHealthy3D size={52} />
                    <span className="absolute -top-1 -right-1 text-xl">✨</span>
                  </div>
                ) : (
                  <ToothHealthy3D size={48} />
                )}
              </div>

              {/* Germ Monster if present */}
              {tooth.hasGerm && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#B86238]/25 backdrop-blur-2xs">
                  {renderGermIcon(tooth.germType)}
                  <span className="text-[10px] font-black uppercase text-[#B86238] bg-white/95 px-2.5 py-0.5 rounded-full mt-1 border border-[#B86238]/30 shadow-xs flex items-center gap-1">
                    <Toothbrush3D size={14} /> Sikat!
                  </span>
                </div>
              )}

              {/* Clean bubbles effect */}
              {tooth.isCleaned && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#6ED5B6]/30">
                  <span className="text-xs font-black text-[#143D37] bg-white px-3 py-1 rounded-full shadow-xs border border-[#6ED5B6]">
                    BERSIH! ✨
                  </span>
                </div>
              )}

              <span className="text-[11px] font-black text-[#143D37]">
                {tooth.name}
              </span>
            </div>
          ))}
        </div>

        {/* Start Game / Game Over Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-[#0D2824]/75 backdrop-blur-xs flex items-center justify-center p-6 z-20">
            <div className="bg-[#FAFDF9] rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border-2 border-[#C4DCAC]">
              <div className="flex justify-center">
                {isGameOver ? (
                  <Trophy3D size={64} />
                ) : (
                  <Toothbrush3D size={64} />
                )}
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#143D37] font-['Fredoka']">
                  {isGameOver ? 'Permainan Selesai!' : 'Ayo Basmi Kuman!'}
                </h3>
                <p className="text-xs text-[#44665E] font-bold mt-1">
                  {isGameOver
                    ? `Hebat! Kamu meraih ${score} poin! Kuman gigi berhasil disingkirkan!`
                    : 'Kuman jahat ingin membuat gigi berlubang. Ketuk mereka secepat mungkin dengan sikat gigimu!'}
                </p>
              </div>

              {isGameOver && (
                <div className="bg-[#FAF2E8] border border-[#BF7E43]/40 p-3 rounded-2xl flex items-center justify-around">
                  <div className="flex items-center gap-2">
                    <Star3D size={24} />
                    <div className="text-left">
                      <div className="text-[10px] font-bold text-[#767459]">Skor</div>
                      <div className="text-lg font-black text-[#BF7E43]">{score}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coin3D size={24} />
                    <div className="text-left">
                      <div className="text-[10px] font-bold text-[#767459]">Hadiah</div>
                      <div className="text-lg font-black text-[#21736A]">+{Math.floor(score / 5) + 30}</div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={startGame}
                className="w-full py-3.5 rounded-2xl font-black text-base text-white bg-gradient-to-r from-[#21736A] to-[#29827D] hover:from-[#1A5C55] hover:to-[#21736A] shadow-md shadow-[#21736A]/30 transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isGameOver ? 'Main Lagi' : 'Mulai Sekarang!'}</span>
                <PlayButton3D size={28} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
