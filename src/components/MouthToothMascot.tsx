import React from 'react';

interface MascotProps {
  hat?: string;
  glasses?: string;
  cape?: string;
  glow?: string;
  expression?: 'happy' | 'excited' | 'sparkle' | 'thinking' | 'brushing';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export const MouthToothMascot: React.FC<MascotProps> = ({
  hat = 'hat_doctor',
  glasses,
  cape,
  glow,
  expression = 'happy',
  size = 'md',
  className = '',
  onClick,
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-44 h-44',
    xl: 'w-60 h-60',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center transition-transform hover:scale-105 select-none ${sizeClasses} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Glow Aura */}
      {glow === 'glow_sparkle' && (
        <div className="absolute inset-0 -m-3 rounded-full bg-yellow-300/40 blur-xl animate-pulse" />
      )}
      {glow === 'glow_rainbow' && (
        <div className="absolute inset-0 -m-3 rounded-full bg-gradient-to-r from-pink-400 via-yellow-300 to-cyan-400 blur-xl opacity-60 animate-spin-slow" />
      )}

      {/* Cape behind tooth */}
      {cape === 'cape_hero' && (
        <div className="absolute -bottom-2 -left-3 w-full h-full text-red-500 z-0">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <path d="M 20 40 Q 5 70 15 95 Q 50 85 85 95 Q 95 70 80 40 Z" fill="#EF4444" />
          </svg>
        </div>
      )}
      {cape === 'cape_fairy' && (
        <div className="absolute -inset-4 text-cyan-300 z-0 opacity-80">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-bounce-gentle">
            <path d="M 15 35 Q -5 20 10 5 Q 35 15 30 45 Z" fill="#67E8F9" opacity="0.7" />
            <path d="M 85 35 Q 105 20 90 5 Q 65 15 70 45 Z" fill="#67E8F9" opacity="0.7" />
          </svg>
        </div>
      )}

      {/* Tooth Body SVG */}
      <svg
        viewBox="0 0 200 220"
        className="w-full h-full relative z-10 drop-shadow-lg"
      >
        <defs>
          <linearGradient id="toothGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#F0FDF4" />
            <stop offset="100%" stopColor="#DCFCE7" />
          </linearGradient>
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#065f46" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Friendly cute tooth shape */}
        <path
          d="M 50 40 
             C 50 15, 80 15, 100 25 
             C 120 15, 150 15, 150 40 
             C 165 80, 160 130, 140 190 
             C 130 215, 115 200, 100 150 
             C 85 200, 70 215, 60 190 
             C 40 130, 35 80, 50 40 Z"
          fill="url(#toothGradient)"
          stroke="#059669"
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Shiny cheek blush */}
        <circle cx="58" cy="98" r="9" fill="#FDA4AF" opacity="0.8" />
        <circle cx="142" cy="98" r="9" fill="#FDA4AF" opacity="0.8" />

        {/* Cute Big Sparkling Eyes */}
        <g className="eyes">
          {expression === 'thinking' ? (
            <>
              <circle cx="70" cy="80" r="7" fill="#0F172A" />
              <circle cx="130" cy="76" r="7" fill="#0F172A" />
              <path d="M 60 68 Q 70 64 80 68" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 120 62 Q 130 66 140 64" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Left Eye */}
              <ellipse cx="70" cy="80" rx="9" ry="12" fill="#0F172A" />
              <circle cx="67" cy="76" r="3.5" fill="#FFFFFF" />
              <circle cx="73" cy="84" r="1.5" fill="#FFFFFF" />

              {/* Right Eye */}
              <ellipse cx="130" cy="80" rx="9" ry="12" fill="#0F172A" />
              <circle cx="127" cy="76" r="3.5" fill="#FFFFFF" />
              <circle cx="133" cy="84" r="1.5" fill="#FFFFFF" />
            </>
          )}
        </g>

        {/* Cute Smile Mouth */}
        {expression === 'excited' || expression === 'sparkle' ? (
          <path
            d="M 80 100 Q 100 125 120 100 Z"
            fill="#EF4444"
            stroke="#991B1B"
            strokeWidth="3"
          />
        ) : (
          <path
            d="M 82 98 Q 100 118 118 98"
            stroke="#0F172A"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Sparkle Glint on Enamel */}
        <path
          d="M 58 45 L 62 48 L 58 51 L 54 48 Z"
          fill="#38BDF8"
          className="animate-ping"
          style={{ animationDuration: '3s' }}
        />
        <circle cx="68" cy="40" r="3" fill="#38BDF8" />
      </svg>

      {/* Equipped Accessories Overlay */}
      {/* Glasses */}
      {glasses === 'glasses_cool' && (
        <div className="absolute top-[35%] left-[22%] right-[22%] z-20 pointer-events-none">
          <div className="flex items-center justify-between">
            <div className="w-6 h-4 bg-slate-900 rounded-sm border border-slate-700 shadow-sm" />
            <div className="w-4 h-1 bg-slate-800" />
            <div className="w-6 h-4 bg-slate-900 rounded-sm border border-slate-700 shadow-sm" />
          </div>
        </div>
      )}
      {glasses === 'glasses_detective' && (
        <div className="absolute top-[32%] right-[18%] z-20 pointer-events-none text-2xl animate-spin-gentle">
          🔍
        </div>
      )}
      {glasses === 'glasses_star' && (
        <div className="absolute top-[32%] left-[20%] right-[20%] z-20 flex justify-between text-xl pointer-events-none">
          <span>⭐</span>
          <span>⭐</span>
        </div>
      )}

      {/* Hats */}
      {hat === 'hat_doctor' && (
        <div className="absolute -top-[14%] left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-white border-2 border-emerald-500 rounded-t-xl px-3 py-1 shadow-md flex items-center justify-center">
            <span className="text-emerald-600 font-black text-sm">✚</span>
          </div>
        </div>
      )}
      {hat === 'hat_crown' && (
        <div className="absolute -top-[18%] left-1/2 -translate-x-1/2 z-20 text-3xl pointer-events-none drop-shadow-md">
          👑
        </div>
      )}
      {hat === 'hat_bunny' && (
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 z-20 text-3xl pointer-events-none">
          🐰
        </div>
      )}
      {hat === 'hat_pirate' && (
        <div className="absolute -top-[16%] left-1/2 -translate-x-1/2 z-20 text-3xl pointer-events-none">
          🏴‍☠️
        </div>
      )}
    </div>
  );
};
