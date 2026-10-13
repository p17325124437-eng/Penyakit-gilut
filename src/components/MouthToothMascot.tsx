import React from 'react';
import { ToothSkinMaterial, ToothExpression, BackgroundScene, AvatarBaseCharacter } from '../types';

interface MascotProps {
  baseCharacter?: AvatarBaseCharacter;
  skinMaterial?: ToothSkinMaterial;
  expression?: ToothExpression | 'happy' | 'excited' | 'sparkle' | 'thinking' | 'brushing' | 'kagum' | 'lucu' | string;
  outfit?: string;
  heldItem?: string;
  hat?: string;
  accessory?: string;
  profession?: string;
  extra?: string;
  backgroundScene?: BackgroundScene;
  glasses?: string;
  cape?: string;
  glow?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export const MouthToothMascot: React.FC<MascotProps> = ({
  baseCharacter = 'chibi',
  skinMaterial = 'white',
  expression = 'senyum',
  outfit,
  heldItem,
  hat,
  accessory,
  profession,
  extra,
  backgroundScene,
  glasses,
  cape,
  glow,
  size = 'md',
  className = '',
  onClick,
}) => {
  const sizeClasses = {
    xs: 'w-10 h-10',
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-44 h-44',
    xl: 'w-64 h-64',
  }[size];

  // Resolve legacy & combined props
  const activeSkin = skinMaterial;
  const activeHat =
    hat ||
    (profession === 'prof_perawat'
      ? 'hat_nurse'
      : profession === 'prof_polisi'
      ? 'hat_police'
      : profession === 'prof_pemadam'
      ? 'hat_fire'
      : profession === 'prof_pilot'
      ? 'hat_pilot'
      : profession === 'prof_koki'
      ? 'hat_chef'
      : undefined);
  const activeOutfit = outfit || (cape === 'cape_hero' ? 'outfit_superhero' : undefined);
  const activeAccessory = accessory || glasses;
  const activeExtra = extra || glow;

  // Background Scene mini-illustrations
  const renderBackgroundArt = (bg: BackgroundScene) => {
    switch (bg) {
      case 'kamar':
        return (
          <div className="absolute inset-0 -m-3 rounded-3xl bg-gradient-to-b from-[#FEF3C7] via-[#EFF6FF] to-[#DBEAFE] border-2 border-amber-200/80 shadow-inner z-0 overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
              <rect x="10" y="20" width="25" height="30" rx="3" fill="#93C5FD" stroke="#60A5FA" />
              <line x1="22.5" y1="20" x2="22.5" y2="50" stroke="#FFFFFF" strokeWidth="1.5" />
              <line x1="10" y1="35" x2="35" y2="35" stroke="#FFFFFF" strokeWidth="1.5" />
              <rect x="0" y="80" width="100" height="20" fill="#D97706" opacity="0.3" />
            </svg>
          </div>
        );
      case 'klinik':
        return (
          <div className="absolute inset-0 -m-3 rounded-3xl bg-gradient-to-b from-[#CCFBF1] via-[#E0F2FE] to-[#F0FDFA] border-2 border-teal-200/80 shadow-inner z-0 overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-35">
              <rect x="65" y="45" width="28" height="35" rx="4" fill="#0D9488" opacity="0.4" />
              <path d="M 15 15 H 35 M 25 5 V 25" stroke="#0D9488" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
              <rect x="0" y="82" width="100" height="18" fill="#14B8A6" opacity="0.2" />
            </svg>
          </div>
        );
      case 'lab':
        return (
          <div className="absolute inset-0 -m-3 rounded-3xl bg-gradient-to-b from-[#EDE9FE] via-[#DDD6FE] to-[#C7D2FE] border-2 border-purple-200/80 shadow-inner z-0 overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-35">
              <path d="M 75 30 L 75 45 L 65 65 H 85 L 75 45 Z" fill="#8B5CF6" opacity="0.5" />
              <circle cx="20" cy="30" r="3" fill="#10B981" />
              <circle cx="28" cy="22" r="2" fill="#3B82F6" />
              <circle cx="24" cy="40" r="4" fill="#EC4899" />
              <rect x="0" y="82" width="100" height="18" fill="#6D28D9" opacity="0.25" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  // Determine skin styles for arms and body
  const handFill =
    activeSkin === 'gold'
      ? '#FACC15'
      : activeSkin === 'black'
      ? '#1E293B'
      : activeSkin === 'diamond'
      ? '#E0F2FE'
      : '#FFFFFF';
  const handStroke =
    activeSkin === 'gold'
      ? '#854D0E'
      : activeSkin === 'black'
      ? '#FBBF24'
      : '#0284C7';

  return (
    <div
      className={`relative inline-flex items-center justify-center transition-transform hover:scale-105 select-none ${sizeClasses} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Background Scene Backdrop */}
      {backgroundScene && renderBackgroundArt(backgroundScene)}

      {/* Extra Aura Power */}
      {activeExtra === 'extra_aura' && (
        <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-r from-purple-500/50 via-fuchsia-400/60 to-indigo-500/50 blur-2xl animate-pulse z-0 pointer-events-none" />
      )}

      {/* Extra Sparkle */}
      {activeExtra === 'extra_sparkle' && (
        <div className="absolute inset-0 -m-5 rounded-full pointer-events-none z-20">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-pulse">
            <path d="M 15 20 L 17 25 L 22 27 L 17 29 L 15 34 L 13 29 L 8 27 L 13 25 Z" fill="#FACC15" />
            <path d="M 85 25 L 87 29 L 91 30 L 87 31 L 85 35 L 83 31 L 79 30 L 83 29 Z" fill="#FACC15" />
            <path d="M 20 80 L 22 84 L 26 85 L 22 86 L 20 90 L 18 86 L 14 85 L 18 84 Z" fill="#FDE047" />
            <path d="M 82 75 L 84 79 L 88 80 L 84 81 L 82 85 L 80 81 L 76 80 L 80 79 Z" fill="#FDE047" />
          </svg>
        </div>
      )}

      {/* Main Vector Character SVG Canvas */}
      <svg
        viewBox="0 0 200 220"
        className="w-full h-full relative z-10 drop-shadow-xl overflow-visible"
      >
        <defs>
          {/* 1. White Pearl Kawaii Skin Gradient */}
          <linearGradient id="skinWhiteCuteGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#F5FCFF" />
            <stop offset="90%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#BAE6FD" />
          </linearGradient>

          {/* 2. Gold Shimmer Skin */}
          <linearGradient id="skinGoldCuteGrad" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#FEF9C3" />
            <stop offset="35%" stopColor="#FACC15" />
            <stop offset="75%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#A16207" />
          </linearGradient>

          {/* 3. Obsidian Black Skin with Cyber Glow */}
          <linearGradient id="skinBlackCuteGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0B0F19" />
          </linearGradient>

          {/* 4. Diamond Crystal Skin */}
          <linearGradient id="skinDiamondCuteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#E0F2FE" />
            <stop offset="50%" stopColor="#C7D2FE" />
            <stop offset="75%" stopColor="#FBCFE8" />
            <stop offset="100%" stopColor="#7DD3FC" />
          </linearGradient>

          {/* 5. Doctor Mirror Radial Specular */}
          <radialGradient id="doctorMirrorGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#BAE6FD" />
            <stop offset="100%" stopColor="#0284C7" />
          </radialGradient>

          {/* 6. Gold Metallic Gradient */}
          <linearGradient id="goldMetallicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="40%" stopColor="#FACC15" />
            <stop offset="70%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>

          {/* Ground Shadow Filter */}
          <radialGradient id="cuteGroundShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0F172A" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ====================================================
            LAYER 0: GROUND SHADOW
            ==================================================== */}
        <ellipse cx="100" cy="208" rx="68" ry="10" fill="url(#cuteGroundShadow)" />

        {/* ====================================================
            LAYER 1: BEHIND BODY (CAPE & BACKPACK)
            ==================================================== */}
        {(activeOutfit === 'outfit_superhero' || cape === 'cape_hero') && (
          <g className="cute-cape">
            <path
              d="M 46 92 C 18 135 14 195 28 215 C 78 198 122 198 172 215 C 186 195 182 135 154 92 Z"
              fill="#EF4444"
              stroke="#B91C1C"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path d="M 40 185 Q 100 178 160 185" stroke="#DC2626" strokeWidth="2.5" fill="none" opacity="0.6" />
          </g>
        )}

        {activeAccessory === 'acc_backpack' && (
          <g className="cute-backpack-behind">
            <rect x="22" y="112" width="26" height="34" rx="7" fill="#DC2626" stroke="#991B1B" strokeWidth="3" transform="rotate(8 22 112)" />
            <rect x="25" y="122" width="18" height="14" rx="4" fill="#B91C1C" transform="rotate(8 25 122)" />
            <circle cx="34" cy="129" r="2.5" fill="#FACC15" />
          </g>
        )}

        {/* ====================================================
            LAYER 2: CUTE CHUBBY FEET / BOOTIES
            ==================================================== */}
        {(() => {
          const shoeFill = activeSkin === 'black' ? '#1E293B' : activeSkin === 'gold' ? '#F59E0B' : '#E0F2FE';
          const shoeStroke = activeSkin === 'black' ? '#FBBF24' : activeSkin === 'gold' ? '#854D0E' : '#0284C7';
          return (
            <g className="cute-feet">
              {/* Left foot */}
              <ellipse cx="74" cy="196" rx="16" ry="11" fill={shoeFill} stroke={shoeStroke} strokeWidth="4" />
              <ellipse cx="71" cy="194" rx="8" ry="4" fill="#FFFFFF" opacity="0.6" />
              {/* Right foot */}
              <ellipse cx="126" cy="196" rx="16" ry="11" fill={shoeFill} stroke={shoeStroke} strokeWidth="4" />
              <ellipse cx="123" cy="194" rx="8" ry="4" fill="#FFFFFF" opacity="0.6" />
            </g>
          );
        })()}

        {/* ====================================================
            LAYER 3: CHUBBY MARSHMALLOW TOOTH BODY
            ==================================================== */}
        {(() => {
          let fillUrl = 'url(#skinWhiteCuteGrad)';
          let strokeColor = '#0284C7';
          let strokeWidth = '5';

          if (activeSkin === 'gold') {
            fillUrl = 'url(#skinGoldCuteGrad)';
            strokeColor = '#854D0E';
            strokeWidth = '5';
          } else if (activeSkin === 'black') {
            fillUrl = 'url(#skinBlackCuteGrad)';
            strokeColor = '#FBBF24';
            strokeWidth = '5';
          } else if (activeSkin === 'diamond') {
            fillUrl = 'url(#skinDiamondCuteGrad)';
            strokeColor = '#0284C7';
            strokeWidth = '5';
          }

          let bodyPath = '';
          if (baseCharacter === 'molar') {
            bodyPath = `
              M 42 58
              C 40 32, 70 24, 98 42
              C 126 24, 156 32, 158 58
              C 178 95, 178 150, 150 188
              C 134 200, 116 194, 100 178
              C 84 194, 66 200, 50 188
              C 22 150, 22 95, 42 58 Z
            `;
          } else if (baseCharacter === 'boba') {
            bodyPath = `
              M 48 55
              C 48 30, 75 25, 100 36
              C 125 25, 152 30, 152 55
              C 175 90, 172 155, 146 186
              C 130 196, 115 190, 100 176
              C 85 190, 70 196, 54 186
              C 28 155, 25 90, 48 55 Z
            `;
          } else {
            // Default 'chibi' & 'hero'
            bodyPath = `
              M 46 54
              C 44 26, 75 22, 100 36
              C 125 22, 156 26, 154 54
              C 174 88, 170 152, 146 186
              C 132 198, 116 190, 100 175
              C 84 190, 68 198, 54 186
              C 30 152, 26 88, 46 54 Z
            `;
          }

          return (
            <path
              d={bodyPath}
              fill={fillUrl}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })()}

        {/* 3D Specular Lobe Bubble Highlights */}
        <path
          d="M 54 44 C 62 34, 76 33, 86 38 C 76 43, 62 48, 54 44 Z"
          fill="#FFFFFF"
          opacity={activeSkin === 'black' ? 0.35 : 0.85}
        />
        <ellipse cx="62" cy="52" rx="4" ry="2.5" fill="#FFFFFF" opacity={activeSkin === 'black' ? 0.4 : 0.9} transform="rotate(-20 62 52)" />

        <path
          d="M 120 38 C 130 34, 142 36, 146 44 C 140 46, 128 44, 120 38 Z"
          fill="#FFFFFF"
          opacity={activeSkin === 'black' ? 0.25 : 0.6}
        />

        {/* Diamond Geometric Lines */}
        {activeSkin === 'diamond' && (
          <g opacity="0.65" stroke="#FFFFFF" strokeWidth="2.5">
            <polygon points="100,38 72,62 100,82 128,62" fill="none" />
            <line x1="72" y1="62" x2="48" y2="88" />
            <line x1="128" y1="62" x2="152" y2="88" />
            <polygon points="100,82 76,132 100,158 124,132" fill="#FFFFFF" fillOpacity="0.25" />
          </g>
        )}

        {/* Gold Shimmer Stars */}
        {activeSkin === 'gold' && (
          <g fill="#FEF08A">
            <path d="M 60 48 L 63 52 L 60 56 L 57 52 Z" />
            <path d="M 142 48 L 145 52 L 142 56 L 139 52 Z" />
            <circle cx="100" cy="45" r="3" fill="#FFFFFF" />
          </g>
        )}

        {/* Chubby Rosy Blushing Cheeks */}
        <ellipse
          cx="56"
          cy="114"
          rx="12"
          ry="7.5"
          fill={activeSkin === 'black' ? '#FB7185' : '#FDA4AF'}
          opacity={activeSkin === 'black' ? 0.8 : 0.85}
        />
        <ellipse
          cx="144"
          cy="114"
          rx="12"
          ry="7.5"
          fill={activeSkin === 'black' ? '#FB7185' : '#FDA4AF'}
          opacity={activeSkin === 'black' ? 0.8 : 0.85}
        />

        {activeExtra === 'extra_sticker' && (
          <g transform="translate(46, 108) scale(0.8)">
            <polygon points="10,0 13,7 20,8 15,13 16,20 10,16 4,20 5,13 0,8 7,7" fill="#F43F5E" />
          </g>
        )}

        {/* ====================================================
            LAYER 4: CUTE CHIBI EYES & MOUTH
            ==================================================== */}
        <g className="cute-eyes-and-mouth">
          {expression === 'wink' ? (
            <>
              <path
                d="M 58 98 Q 72 86 84 98"
                stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'}
                strokeWidth="5.5"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M 50 94 L 52 98 L 56 99 L 52 100 L 50 104 L 48 100 L 44 99 L 48 98 Z" fill="#FACC15" />
              <ellipse cx="128" cy="96" rx="11" ry="14" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <circle cx="124" cy="91" r="5" fill="#FFFFFF" />
              <circle cx="132" cy="101" r="2.5" fill="#FFFFFF" />
              <path d="M 88 116 Q 100 128 112 116" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M 100 120 C 100 125, 105 125, 105 120 Z" fill="#F43F5E" />
            </>
          ) : expression === 'bahagia' ? (
            <>
              <ellipse cx="72" cy="95" rx="12" ry="15" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <circle cx="68" cy="89" r="5.5" fill="#FFFFFF" />
              <circle cx="76" cy="101" r="2.5" fill="#FFFFFF" />
              <ellipse cx="128" cy="95" rx="12" ry="15" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <circle cx="124" cy="89" r="5.5" fill="#FFFFFF" />
              <circle cx="132" cy="101" r="2.5" fill="#FFFFFF" />
              <path d="M 84 114 Q 100 134 116 114 Z" fill="#DC2626" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="3" />
              <ellipse cx="100" cy="122" rx="7" ry="4" fill="#FB7185" />
            </>
          ) : expression === 'kagum' ? (
            <>
              <circle cx="72" cy="94" r="14" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <circle cx="68" cy="88" r="6" fill="#FFFFFF" />
              <circle cx="78" cy="100" r="3" fill="#FFFFFF" />
              <circle cx="128" cy="94" r="14" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <circle cx="124" cy="88" r="6" fill="#FFFFFF" />
              <circle cx="134" cy="100" r="3" fill="#FFFFFF" />
              <ellipse cx="100" cy="120" rx="9" ry="11" fill="#DC2626" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="3.5" />
              <ellipse cx="100" cy="125" rx="6" ry="4" fill="#FB7185" />
            </>
          ) : expression === 'semangat' ? (
            <>
              <path d="M 60 84 L 84 94" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 140 84 L 116 94" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="4.5" strokeLinecap="round" />
              <ellipse cx="72" cy="98" rx="10" ry="12" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <circle cx="70" cy="94" r="4.5" fill="#FFFFFF" />
              <ellipse cx="128" cy="98" rx="10" ry="12" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <circle cx="126" cy="94" r="4.5" fill="#FFFFFF" />
              <path d="M 85 116 Q 100 130 115 116 Z" fill="#FFFFFF" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="3.5" />
            </>
          ) : expression === 'lucu' ? (
            <>
              <path d="M 62 96 Q 72 88 82 96" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M 118 96 Q 128 88 138 96" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M 88 115 Q 100 120 112 115" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 96 117 C 96 128 108 128 108 117 Z" fill="#FB7185" stroke="#E11D48" strokeWidth="2" />
            </>
          ) : expression === 'malu' ? (
            <>
              <path d="M 64 96 C 68 88 78 88 82 96" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M 118 96 C 122 88 132 88 136 96" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M 92 116 Q 100 122 108 116" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="4" strokeLinecap="round" fill="none" />
            </>
          ) : expression === 'thinking' ? (
            <>
              <path d="M 62 82 Q 72 78 82 85" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <ellipse cx="72" cy="92" rx="9" ry="11" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <circle cx="70" cy="88" r="4" fill="#FFFFFF" />
              <ellipse cx="128" cy="92" rx="9" ry="11" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <circle cx="126" cy="88" r="4" fill="#FFFFFF" />
              <ellipse cx="106" cy="116" rx="5" ry="6" fill="#DC2626" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="2.5" />
            </>
          ) : expression === 'ngantuk' ? (
            <>
              <path d="M 62 96 Q 72 102 82 96" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M 118 96 Q 128 102 138 96" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M 92 116 Q 100 120 108 116" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <text x="144" y="80" fill="#38BDF8" fontSize="12" fontWeight="bold">z</text>
              <text x="154" y="70" fill="#0284C7" fontSize="16" fontWeight="bold">Z</text>
            </>
          ) : expression === 'tertawa' ? (
            <>
              <path d="M 62 96 Q 72 84 82 96" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="5" strokeLinecap="round" fill="none" />
              <path d="M 118 96 Q 128 84 138 96" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="5" strokeLinecap="round" fill="none" />
              <path d="M 82 112 Q 100 136 118 112 Z" fill="#DC2626" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="3" />
              <ellipse cx="100" cy="122" rx="7" ry="4" fill="#FB7185" />
            </>
          ) : (
            /* Default 'senyum' */
            <>
              <ellipse cx="72" cy="95" rx="10" ry="13" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <circle cx="69" cy="90" r="4.5" fill="#FFFFFF" />
              <circle cx="75" cy="101" r="2" fill="#FFFFFF" />
              <ellipse cx="128" cy="95" rx="10" ry="13" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <circle cx="125" cy="90" r="4.5" fill="#FFFFFF" />
              <circle cx="131" cy="101" r="2" fill="#FFFFFF" />
              <path d="M 86 115 Q 100 128 114 115" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="4.5" strokeLinecap="round" fill="none" />
            </>
          )}
        </g>

        {/* ====================================================
            LAYER 5: OUTFITS (CLOTHING)
            ==================================================== */}
        {activeOutfit === 'outfit_hoodie' && (
          <g className="cute-outfit-hoodie">
            <path
              d="M 50 144 C 70 138 130 138 150 144 C 146 172 138 186 126 186 C 100 168 100 168 74 186 C 62 186 54 172 50 144 Z"
              fill="#0284C7"
              stroke="#0369A1"
              strokeWidth="3.5"
            />
            <path d="M 80 144 Q 100 155 120 144" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
            <line x1="94" y1="148" x2="94" y2="162" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="106" y1="148" x2="106" y2="162" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="94" cy="163" r="2.5" fill="#FFFFFF" />
            <circle cx="106" cy="163" r="2.5" fill="#FFFFFF" />
          </g>
        )}

        {activeOutfit === 'outfit_tshirt' && (
          <g className="cute-outfit-tshirt">
            <path
              d="M 50 144 C 70 138 130 138 150 144 C 146 172 138 186 126 186 C 100 168 100 168 74 186 C 62 186 54 172 50 144 Z"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="3.5"
            />
            <path d="M 82 142 Q 100 152 118 142" stroke="#EF4444" strokeWidth="4" fill="none" strokeLinecap="round" />
            <circle cx="100" cy="158" r="8" fill="#FACC15" stroke="#EAB308" strokeWidth="1.5" />
            <path d="M 100 153 L 102 157 L 106 158 L 103 160 L 104 164 L 100 161 L 96 164 L 97 160 L 94 158 L 98 157 Z" fill="#FFFFFF" />
          </g>
        )}

        {activeOutfit === 'outfit_overalls' && (
          <g className="cute-outfit-overalls">
            <path
              d="M 52 146 C 70 142 130 142 148 146 C 144 172 136 186 126 186 C 100 168 100 168 74 186 C 64 186 56 172 52 146 Z"
              fill="#2563EB"
              stroke="#1E40AF"
              strokeWidth="3.5"
            />
            <rect x="74" y="136" width="9" height="26" fill="#1D4ED8" rx="2.5" />
            <rect x="117" y="136" width="9" height="26" fill="#1D4ED8" rx="2.5" />
            <circle cx="78.5" cy="155" r="3" fill="#FACC15" />
            <circle cx="121.5" cy="155" r="3" fill="#FACC15" />
            <path d="M 90 162 H 110 V 172 C 110 176 90 176 90 172 Z" fill="#1D4ED8" stroke="#1E40AF" strokeWidth="1.5" />
          </g>
        )}

        {activeOutfit === 'outfit_superhero' && (
          <g className="cute-outfit-hero">
            <path
              d="M 50 142 C 70 136 130 136 150 142 C 146 172 138 186 126 186 C 100 168 100 168 74 186 C 62 186 54 172 50 142 Z"
              fill="#2563EB"
              stroke="#1D4ED8"
              strokeWidth="3.5"
            />
            <rect x="66" y="162" width="68" height="7" rx="2" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
            <circle cx="100" cy="165.5" r="5" fill="#EF4444" stroke="#FACC15" strokeWidth="1.5" />
            <polygon points="100,144 110,152 106,160 94,160 90,152" fill="#EF4444" stroke="#FACC15" strokeWidth="1.5" />
            <text x="96" y="157" fill="#FFFFFF" fontSize="10" fontWeight="900" fontFamily="sans-serif">S</text>
          </g>
        )}

        {activeOutfit === 'outfit_tuxedo' && (
          <g className="cute-outfit-tuxedo">
            <path
              d="M 50 142 C 70 136 130 136 150 142 C 146 172 138 186 126 186 C 100 168 100 168 74 186 C 62 186 54 172 50 142 Z"
              fill="#0F172A"
              stroke="#334155"
              strokeWidth="3.5"
            />
            <polygon points="100,172 84,142 116,142" fill="#FFFFFF" />
            <polygon points="92,143 100,147 92,151" fill="#DC2626" />
            <polygon points="108,143 100,147 108,151" fill="#DC2626" />
            <circle cx="100" cy="147" r="2.5" fill="#991B1B" />
          </g>
        )}

        {/* ====================================================
            LAYER 6: CHEST & NECK ACCESSORIES (BOWTIE, SCARF, MEDAL)
            ==================================================== */}
        {activeAccessory === 'acc_bowtie' && (
          <g className="cute-accessory-bowtie">
            <polygon points="86,138 100,143 86,148" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
            <polygon points="114,138 100,143 114,148" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
            <circle cx="100" cy="143" r="4.5" fill="#991B1B" />
          </g>
        )}

        {activeAccessory === 'acc_scarf' && (
          <g className="cute-accessory-scarf">
            <path d="M 64 138 Q 100 148 136 138" stroke="#EF4444" strokeWidth="10" strokeLinecap="round" fill="none" />
            <path d="M 118 140 L 122 168" stroke="#EF4444" strokeWidth="9" strokeLinecap="round" />
            <line x1="117" y1="168" x2="127" y2="168" stroke="#FACC15" strokeWidth="3" />
          </g>
        )}

        {activeAccessory === 'acc_medal' && (
          <g className="cute-accessory-medal">
            <polygon points="100,140 92,154 108,154" fill="#DC2626" />
            <circle cx="100" cy="162" r="11" fill="url(#goldMetallicGrad)" stroke="#CA8A04" strokeWidth="2" />
            <circle cx="100" cy="162" r="7" fill="#EAB308" />
            <text x="96" y="166" fill="#FFFFFF" fontSize="10" fontWeight="900" fontFamily="sans-serif">★</text>
          </g>
        )}

        {/* ====================================================
            LAYER 7: EYEWEAR (GLASSES) - SNUGLY RESTING ON EYES
            ==================================================== */}
        {activeAccessory === 'acc_glasses' && (
          <g className="cute-glasses-smart">
            {/* Left lens */}
            <rect x="56" y="80" width="32" height="28" rx="8" fill="#38BDF8" fillOpacity="0.25" stroke="#0F172A" strokeWidth="4" />
            <line x1="60" y1="84" x2="68" y2="92" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            {/* Right lens */}
            <rect x="112" y="80" width="32" height="28" rx="8" fill="#38BDF8" fillOpacity="0.25" stroke="#0F172A" strokeWidth="4" />
            <line x1="116" y1="84" x2="124" y2="92" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            {/* Bridge */}
            <path d="M 88 92 Q 100 88 112 92" stroke="#0F172A" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Temple arms wrapping cheeks */}
            <line x1="56" y1="90" x2="42" y2="96" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="144" y1="90" x2="158" y2="96" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        )}

        {(activeAccessory === 'glasses_cool' || expression === 'keren') && (
          <g className="cute-glasses-sunglasses">
            {/* Left dark lens */}
            <rect x="54" y="80" width="34" height="28" rx="7" fill="#0F172A" stroke="#1E293B" strokeWidth="2.5" />
            <line x1="58" y1="84" x2="72" y2="84" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            {/* Right dark lens */}
            <rect x="112" y="80" width="34" height="28" rx="7" fill="#0F172A" stroke="#1E293B" strokeWidth="2.5" />
            <line x1="116" y1="84" x2="130" y2="84" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            {/* Center bridge */}
            <rect x="88" y="88" width="24" height="5" rx="2" fill="#0F172A" />
            {/* Left & Right temple */}
            <line x1="54" y1="90" x2="40" y2="96" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="146" y1="90" x2="160" y2="96" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        )}

        {/* ====================================================
            LAYER 8: HATS / HEAD ACCESSORIES
            SEMPURNA MENEMPEL DI ATAS KEPALA GIGI (TIDAK MELAYANG)
            ==================================================== */}
        {activeHat === 'hat_cap' && (
          <g className="cute-hat-cap">
            {/* Contact shadow on tooth forehead */}
            <ellipse cx="100" cy="46" rx="42" ry="5" fill="#0F172A" opacity="0.18" />
            {/* Cap dome hugging top lobes */}
            <path
              d="M 52 44 C 48 18, 76 8, 100 8 C 124 8, 152 18, 148 44 Z"
              fill="#0284C7"
              stroke="#0369A1"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Cap seams */}
            <path d="M 100 8 Q 100 28 100 44" stroke="#0369A1" strokeWidth="2.5" fill="none" />
            <path d="M 100 8 Q 74 24 56 42" stroke="#0369A1" strokeWidth="2" fill="none" />
            <path d="M 100 8 Q 126 24 144 42" stroke="#0369A1" strokeWidth="2" fill="none" />
            {/* Cap visor curving firmly forward across forehead */}
            <path
              d="M 52 44 C 54 52, 74 54, 100 54 C 126 54, 146 52, 148 44 C 136 49, 118 50, 100 50 C 82 50, 64 49, 52 44 Z"
              fill="#0369A1"
              stroke="#0284C7"
              strokeWidth="1.5"
            />
            {/* Top button */}
            <circle cx="100" cy="8" r="4" fill="#FACC15" />
            {/* Front gold star emblem */}
            <circle cx="100" cy="28" r="7" fill="#FACC15" stroke="#EAB308" strokeWidth="1.5" />
            <path d="M 100 24 L 101.5 27.5 L 105 28 L 102.5 30.5 L 103 34 L 100 32 L 97 34 L 97.5 30.5 L 95 28 L 98.5 27.5 Z" fill="#FFFFFF" />
          </g>
        )}

        {activeHat === 'hat_crown' && (
          <g className="cute-hat-crown">
            {/* Contact shadow on head */}
            <ellipse cx="100" cy="40" rx="36" ry="4" fill="#0F172A" opacity="0.2" />
            {/* Velvet cushion inside dip */}
            <path d="M 66 36 C 76 22, 124 22, 134 36 Z" fill="#DC2626" />
            {/* Gold crown base band resting on head contour */}
            <path
              d="M 60 36 C 78 32, 122 32, 140 36 L 140 43 C 122 39, 78 39, 60 43 Z"
              fill="#EAB308"
              stroke="#854D0E"
              strokeWidth="2.5"
            />
            {/* Crown golden peaks */}
            <polygon
              points="60,39 64,16 80,26 100,8 120,26 136,16 140,39"
              fill="url(#goldMetallicGrad)"
              stroke="#854D0E"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Jewels */}
            <circle cx="100" cy="12" r="5" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
            <circle cx="64" cy="18" r="3.5" fill="#3B82F6" />
            <circle cx="136" cy="18" r="3.5" fill="#3B82F6" />
            <circle cx="80" cy="27" r="3" fill="#10B981" />
            <circle cx="120" cy="27" r="3" fill="#10B981" />
            {/* Lower band jewels */}
            <circle cx="75" cy="40" r="2.5" fill="#DC2626" />
            <circle cx="100" cy="38" r="3" fill="#3B82F6" />
            <circle cx="125" cy="40" r="2.5" fill="#DC2626" />
          </g>
        )}

        {activeHat === 'hat_ribbon' && (
          <g className="cute-hat-ribbon">
            {/* Headband hugging the top lobes */}
            <path
              d="M 46 54 C 48 22, 72 16, 100 16 C 128 16, 152 22, 154 54"
              fill="none"
              stroke="#FB7185"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M 52 50 C 54 26, 74 20, 100 20 C 126 20, 146 26, 148 50"
              fill="none"
              stroke="#FDA4AF"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Big cute anime bow perched firmly on right lobe */}
            {/* Left bow wing */}
            <path d="M 136 24 C 120 12, 114 18, 120 28 C 124 34, 134 28, 136 24 Z" fill="#FB7185" stroke="#E11D48" strokeWidth="2.5" />
            {/* Right bow wing */}
            <path d="M 136 24 C 152 12, 158 18, 152 28 C 148 34, 138 28, 136 24 Z" fill="#FB7185" stroke="#E11D48" strokeWidth="2.5" />
            {/* Center knot */}
            <circle cx="136" cy="24" r="6" fill="#E11D48" />
            {/* Tails */}
            <path d="M 134 28 C 130 38, 128 48, 126 56" stroke="#FB7185" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 138 28 C 144 38, 150 48, 154 56" stroke="#FB7185" strokeWidth="4.5" strokeLinecap="round" />
          </g>
        )}

        {activeHat === 'hat_grad' && (
          <g className="cute-hat-grad">
            {/* Contact shadow on head */}
            <ellipse cx="100" cy="42" rx="34" ry="4" fill="#0F172A" opacity="0.2" />
            {/* Skullcap base fitting over head curve */}
            <path
              d="M 70 38 C 84 34, 116 34, 130 38 L 128 48 C 116 44, 84 44, 72 48 Z"
              fill="#0F172A"
              stroke="#1E293B"
              strokeWidth="2.5"
            />
            {/* Mortarboard square */}
            <polygon points="100,10 156,22 100,34 44,22" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
            <polygon points="44,22 100,34 100,38 44,26" fill="#0F172A" />
            <polygon points="156,22 100,34 100,38 156,26" fill="#0B0F19" />
            {/* Center golden button */}
            <circle cx="100" cy="22" r="3.5" fill="#FACC15" />
            {/* Tassel cord dangling down left side */}
            <path d="M 100 22 C 78 22, 60 28, 56 42" stroke="#FACC15" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="56" cy="44" r="2.5" fill="#EAB308" />
            <path d="M 56 44 L 54 64" stroke="#FACC15" strokeWidth="5" strokeLinecap="round" />
          </g>
        )}

        {activeHat === 'hat_doctor' && (
          <g className="cute-hat-doctor">
            {/* Elastic headband hugging forehead */}
            <path d="M 48 50 C 72 42, 128 42, 152 50" stroke="#0D9488" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 50 49 C 74 42, 126 42, 150 49" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Head mirror unit resting directly on forehead */}
            <rect x="71" y="36" width="6" height="8" rx="2" fill="#475569" />
            <circle cx="74" cy="32" r="14" fill="#E0F2FE" stroke="#0D9488" strokeWidth="3" />
            <circle cx="74" cy="32" r="10" fill="url(#doctorMirrorGrad)" />
            <circle cx="74" cy="32" r="3.5" fill="#0D9488" />
            <path d="M 68 26 Q 78 24 80 30" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {activeHat === 'hat_nurse' && (
          <g className="cute-hat-nurse">
            {/* Contact shadow in dip */}
            <ellipse cx="100" cy="40" rx="30" ry="3.5" fill="#0F172A" opacity="0.15" />
            {/* Nurse cap body */}
            <path
              d="M 68 38 L 74 16 C 88 14, 112 14, 126 16 L 132 38 Z"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Lower cuff band */}
            <path
              d="M 66 38 C 82 35, 118 35, 134 38 L 132 44 C 118 41, 82 41, 68 44 Z"
              fill="#F1F5F9"
              stroke="#CBD5E1"
              strokeWidth="2"
            />
            {/* Red cross emblem */}
            <path d="M 100 20 V 32 M 94 26 H 106" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
          </g>
        )}

        {activeHat === 'hat_police' && (
          <g className="cute-hat-police">
            {/* Contact shadow */}
            <ellipse cx="100" cy="44" rx="38" ry="4" fill="#0F172A" opacity="0.2" />
            {/* Cap dome */}
            <path
              d="M 58 40 C 50 20, 75 12, 100 12 C 125 12, 150 20, 142 40 Z"
              fill="#1E3A8A"
              stroke="#172554"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Middle band */}
            <path
              d="M 58 40 C 78 35, 122 35, 142 40 L 140 47 C 122 42, 78 42, 60 47 Z"
              fill="#172554"
              stroke="#0F172A"
              strokeWidth="2"
            />
            {/* Black visor over forehead */}
            <path
              d="M 62 46 C 76 54, 124 54, 138 46 C 124 50, 76 50, 62 46 Z"
              fill="#0F172A"
              stroke="#000000"
              strokeWidth="1.5"
            />
            <path d="M 72 48 Q 100 52 128 48" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
            {/* Gold Police shield badge */}
            <polygon points="100,22 105,27 103,34 97,34 95,27" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
            <circle cx="100" cy="28" r="2" fill="#FFFFFF" />
          </g>
        )}

        {activeHat === 'hat_fire' && (
          <g className="cute-hat-fire">
            {/* Contact shadow */}
            <ellipse cx="100" cy="44" rx="40" ry="4.5" fill="#0F172A" opacity="0.2" />
            {/* Flared brim */}
            <path
              d="M 48 44 C 70 38, 130 38, 152 44 C 136 50, 64 50, 48 44 Z"
              fill="#991B1B"
              stroke="#7F1D1D"
              strokeWidth="2.5"
            />
            {/* Helmet dome */}
            <path
              d="M 56 42 C 52 20, 78 10, 100 10 C 122 10, 148 20, 144 42 Z"
              fill="#DC2626"
              stroke="#991B1B"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Center ridge */}
            <path d="M 100 8 Q 100 24 100 42" stroke="#EF4444" strokeWidth="5.5" strokeLinecap="round" />
            {/* Golden shield badge */}
            <path d="M 94 24 L 106 24 L 104 36 L 100 39 L 96 36 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
            <path d="M 100 28 C 98 31, 98 34, 100 36 C 102 34, 102 31, 100 28 Z" fill="#EF4444" />
          </g>
        )}

        {activeHat === 'hat_pilot' && (
          <g className="cute-hat-pilot">
            {/* Contact shadow */}
            <ellipse cx="100" cy="44" rx="38" ry="4" fill="#0F172A" opacity="0.2" />
            {/* Pilot peaked cap dome */}
            <path
              d="M 60 40 C 54 22, 76 14, 100 14 C 124 14, 146 22, 140 40 Z"
              fill="#0F172A"
              stroke="#0284C7"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Dark navy band */}
            <path
              d="M 60 40 C 78 35, 122 35, 140 40 L 138 47 C 122 42, 78 42, 62 47 Z"
              fill="#0B0F19"
              stroke="#0284C7"
              strokeWidth="1.5"
            />
            {/* Gold braided cord */}
            <path d="M 62 44 Q 100 48 138 44" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Black visor */}
            <path
              d="M 64 46 C 78 54, 122 54, 136 46 C 124 50, 76 50, 64 46 Z"
              fill="#020617"
            />
            {/* Golden wings crest */}
            <polygon points="100,22 104,26 114,24 107,29 100,32 93,29 86,24 96,26" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
            <circle cx="100" cy="27" r="2.5" fill="#38BDF8" />
          </g>
        )}

        {activeHat === 'hat_chef' && (
          <g className="cute-hat-chef">
            {/* Contact shadow */}
            <ellipse cx="100" cy="42" rx="32" ry="4" fill="#0F172A" opacity="0.15" />
            {/* Base headband fitted into crown */}
            <path
              d="M 70 38 C 84 34, 116 34, 130 38 L 130 46 C 116 42, 84 42, 70 46 Z"
              fill="#F8FAFC"
              stroke="#CBD5E1"
              strokeWidth="2.5"
            />
            {/* Puffed chef toque rising above */}
            <path
              d="M 70 38 C 48 30, 46 10, 68 8 C 76 -4, 96 -6, 104 2 C 114 -6, 134 -4, 138 10 C 154 14, 150 32, 130 38 Z"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Pleats */}
            <path d="M 80 34 Q 84 18 90 8 M 100 34 V 4 M 120 34 Q 116 18 112 8" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {/* ====================================================
            LAYER 9: ARMS, HANDS, & HANDHELD ACCESSORIES
            (BENAR-BENAR MENEMPEL DAN DIPEGANG OLEH TANGAN)
            ==================================================== */}
        {/* --- LEFT HAND & SHIELD --- */}
        {heldItem === 'hand_shield' ? (
          <g className="cute-left-arm-holding-shield">
            {/* Left Arm extended forward to hold shield */}
            <path
              d="M 44 112 C 30 110 24 118 28 128 C 34 136 46 128 50 120 Z"
              fill={handFill}
              stroke={handStroke}
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Protective Enamel Shield held firmly */}
            <g className="handheld-shield-item">
              {/* Outer Golden Border */}
              <path
                d="M 32 86 L 56 94 V 122 C 56 142 32 158 32 158 C 32 158 8 142 8 122 V 94 L 32 86 Z"
                fill="#0284C7"
                stroke="#FACC15"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              {/* Inner Shield Gradient Field */}
              <path
                d="M 32 92 L 50 98 V 120 C 50 136 32 148 32 148 C 32 148 14 136 14 120 V 98 L 32 92 Z"
                fill="#0369A1"
              />
              {/* Center Pure Enamel Tooth Crest */}
              <path
                d="M 32 108 C 28 104 22 107 22 113 C 22 119 32 130 32 130 C 32 130 42 119 42 113 C 42 107 36 104 32 108 Z"
                fill="#FFFFFF"
              />
              <circle cx="32" cy="116" r="2" fill="#38BDF8" />
              {/* Shield Glint */}
              <line x1="16" y1="98" x2="28" y2="94" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </g>

            {/* Left Hand Fingers CLAMPING FIRMLY over shield edge / handle! */}
            <g className="left-hand-fingers-grip">
              <ellipse cx="44" cy="120" rx="7" ry="8" fill={handFill} stroke={handStroke} strokeWidth="3" />
              {/* Chubby fingers curled over edge */}
              <path d="M 39 116 Q 44 114 48 116" stroke={handStroke} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 40 121 Q 45 119 49 121" stroke={handStroke} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 41 126 Q 46 124 50 126" stroke={handStroke} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          </g>
        ) : (
          /* Default Left Arm: Friendly Waving Chibi Hand */
          <g className="cute-left-arm-default">
            <path
              d="M 44 112 C 24 100 16 90 22 80 C 28 72 38 80 48 95 Z"
              fill={handFill}
              stroke={handStroke}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Waving Chibi Palm */}
            <circle cx="21" cy="80" r="7.5" fill={handFill} stroke={handStroke} strokeWidth="3" />
            {/* Cute waving finger bumps */}
            <circle cx="16" cy="76" r="3" fill={handFill} />
            <circle cx="21" cy="73" r="3" fill={handFill} />
            <circle cx="26" cy="75" r="3" fill={handFill} />
          </g>
        )}

        {/* --- RIGHT HAND & ITEMS --- */}
        {heldItem === 'hand_brush' ? (
          /* 1. SIKAT GIGI SAKTI CERIA (DIPEGANG ERAT DI TANGAN KANAN) */
          <g className="cute-right-arm-holding-brush">
            {/* Arm reaching out from body */}
            <path
              d="M 152 110 C 166 112 174 116 172 126 C 168 132 154 126 148 118 Z"
              fill={handFill}
              stroke={handStroke}
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Toothbrush Handle passing through hand */}
            {/* Lower handle below hand */}
            <path d="M 164 124 L 156 160" stroke="#0284C7" strokeWidth="6" strokeLinecap="round" />
            <path d="M 163 124 L 157 156" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />

            {/* Upper handle above hand leading to brush head */}
            <path d="M 172 118 L 186 78" stroke="#0284C7" strokeWidth="6" strokeLinecap="round" />
            <path d="M 171 118 L 184 82" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />

            {/* Bristles Head */}
            <rect
              x="180"
              y="62"
              width="16"
              height="12"
              rx="3.5"
              fill="#E0F2FE"
              stroke="#0284C7"
              strokeWidth="2"
              transform="rotate(-30 180 62)"
            />
            <line x1="184" y1="63" x2="190" y2="70" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="190" y1="60" x2="196" y2="67" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
            {/* Sparkle and foam */}
            <circle cx="198" cy="62" r="3.5" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="1" />
            <circle cx="204" cy="68" r="2.5" fill="#FFFFFF" />
            <path d="M 188 52 L 190 56 L 194 57 L 190 58 L 188 62 L 186 58 L 182 57 L 186 56 Z" fill="#FACC15" />

            {/* Right Hand Fingers WRAPPED DIRECTLY OVER HANDLE */}
            <ellipse cx="168" cy="122" rx="7" ry="8" fill={handFill} stroke={handStroke} strokeWidth="3.5" />
            <path d="M 163 118 Q 167 116 171 118" stroke={handStroke} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 163 123 Q 168 121 172 123" stroke={handStroke} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 164 128 Q 169 126 173 128" stroke={handStroke} strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Thumb holding handle */}
            <ellipse cx="163" cy="117" rx="3.5" ry="3" fill={handFill} stroke={handStroke} strokeWidth="2" />
          </g>
        ) : heldItem === 'hand_paste' ? (
          /* 2. PASTA GIGI AJAIB FLUORIDE (DIPEGANG & DIREMAS DI TANGAN) */
          <g className="cute-right-arm-holding-paste">
            <path
              d="M 152 110 C 166 112 174 116 172 126 C 168 132 154 126 148 118 Z"
              fill={handFill}
              stroke={handStroke}
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Toothpaste Tube Body passing through hand */}
            <g transform="rotate(18 168 120)">
              {/* Bottom fold */}
              <rect x="156" y="132" width="22" height="6" rx="1.5" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
              {/* Tube body */}
              <path d="M 158 132 L 160 98 L 174 98 L 176 132 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="2.5" />
              <line x1="162" y1="110" x2="172" y2="110" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              {/* Nozzle */}
              <rect x="164" y="92" width="6" height="6" rx="1" fill="#0284C7" />
              {/* Cute Fluoride Dollop swirl */}
              <path d="M 167 92 C 167 86, 174 84, 172 88 C 170 92, 168 92, 167 92 Z" fill="#F43F5E" stroke="#E11D48" strokeWidth="1" />
              <circle cx="174" cy="86" r="2" fill="#FFFFFF" />
            </g>

            {/* Hand Fingers Wrapped and Squeezing Tube */}
            <ellipse cx="166" cy="122" rx="7.5" ry="8.5" fill={handFill} stroke={handStroke} strokeWidth="3.5" />
            <path d="M 161 118 Q 166 116 170 118" stroke={handStroke} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 161 123 Q 166 121 171 123" stroke={handStroke} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 162 128 Q 167 126 172 128" stroke={handStroke} strokeWidth="3" fill="none" strokeLinecap="round" />
            <ellipse cx="161" cy="116" rx="3.5" ry="3" fill={handFill} stroke={handStroke} strokeWidth="2" />
          </g>
        ) : heldItem === 'hand_glass' ? (
          /* 3. KACA PEMBESAR DETEKTIF GIGI (DIPEGANG DI TANGAN) */
          <g className="cute-right-arm-holding-glass">
            <path
              d="M 152 110 C 166 112 174 116 172 126 C 168 132 154 126 148 118 Z"
              fill={handFill}
              stroke={handStroke}
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Handle lower part */}
            <line x1="168" y1="126" x2="160" y2="156" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
            <line x1="168" y1="126" x2="161" y2="152" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />

            {/* Upper rod leading to lens */}
            <line x1="168" y1="116" x2="178" y2="92" stroke="#475569" strokeWidth="5" strokeLinecap="round" />

            {/* Magnifying Glass Head */}
            <circle cx="186" cy="74" r="15" fill="#E0F2FE" fillOpacity="0.45" stroke="#0284C7" strokeWidth="4" />
            <path d="M 178 68 Q 186 64 192 70" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Hand Fingers Grip */}
            <ellipse cx="168" cy="122" rx="7" ry="8" fill={handFill} stroke={handStroke} strokeWidth="3.5" />
            <path d="M 163 118 Q 167 116 171 118" stroke={handStroke} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 163 123 Q 168 121 172 123" stroke={handStroke} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 164 128 Q 169 126 173 128" stroke={handStroke} strokeWidth="3" fill="none" strokeLinecap="round" />
            <ellipse cx="163" cy="117" rx="3.5" ry="3" fill={handFill} stroke={handStroke} strokeWidth="2" />
          </g>
        ) : heldItem === 'hand_mirror' ? (
          /* 4. CERMIN DOKTER GIGI CILIK (DIPEGANG DI TANGAN) */
          <g className="cute-right-arm-holding-mirror">
            <path
              d="M 152 110 C 166 112 174 116 172 126 C 168 132 154 126 148 118 Z"
              fill={handFill}
              stroke={handStroke}
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Stainless Handle through hand */}
            <line x1="166" y1="126" x2="158" y2="156" stroke="#64748B" strokeWidth="5" strokeLinecap="round" />
            <line x1="166" y1="126" x2="160" y2="152" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
            <line x1="168" y1="116" x2="182" y2="76" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />

            {/* Angled Inspection Mirror tilted toward tooth smile */}
            <circle cx="188" cy="68" r="11" fill="#E0F2FE" stroke="#0D9488" strokeWidth="3" />
            <ellipse cx="186" cy="65" rx="5" ry="2.5" fill="#FFFFFF" />

            {/* Hand Fingers Grip */}
            <ellipse cx="168" cy="122" rx="7" ry="8" fill={handFill} stroke={handStroke} strokeWidth="3.5" />
            <path d="M 163 118 Q 167 116 171 118" stroke={handStroke} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 163 123 Q 168 121 172 123" stroke={handStroke} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 164 128 Q 169 126 173 128" stroke={handStroke} strokeWidth="3" fill="none" strokeLinecap="round" />
            <ellipse cx="163" cy="117" rx="3.5" ry="3" fill={handFill} stroke={handStroke} strokeWidth="2" />
          </g>
        ) : (
          /* Default Right Arm: Resting by hip / Happy wave */
          <g className="cute-right-arm-default">
            <path
              d="M 156 112 C 176 108 184 102 180 92 C 174 84 164 92 152 104 Z"
              fill={handFill}
              stroke={handStroke}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <circle cx="178" cy="94" r="7.5" fill={handFill} stroke={handStroke} strokeWidth="3" />
            <circle cx="183" cy="91" r="3" fill={handFill} />
            <circle cx="181" cy="86" r="3" fill={handFill} />
          </g>
        )}
      </svg>

      {/* ====================================================
          PROFESSION GEAR BADGE (POJOK KANAN BAWAH)
          ==================================================== */}
      {profession === 'prof_dokter' && (
        <div className="absolute -bottom-1 -right-1 bg-white border-2 border-teal-500 rounded-full p-1.5 shadow-md flex items-center justify-center pointer-events-none">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 4v5a4 4 0 0 0 8 0V4" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M8 13v3a4 4 0 0 0 8 0v-1" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="16" cy="14" r="2.5" fill="#0D9488" />
          </svg>
        </div>
      )}
      {profession === 'prof_perawat' && (
        <div className="absolute -bottom-1 -right-1 bg-white border-2 border-pink-500 rounded-full p-1.5 shadow-md flex items-center justify-center pointer-events-none">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="4" width="14" height="16" rx="2" stroke="#EC4899" strokeWidth="2" />
            <path d="M12 9v6M9 12h6" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}
      {profession === 'prof_ilmuwan' && (
        <div className="absolute -bottom-1 -right-1 bg-white border-2 border-purple-500 rounded-full p-1.5 shadow-md flex items-center justify-center pointer-events-none">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M10 3h4M12 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
            <circle cx="11" cy="16" r="1.5" fill="#8B5CF6" />
            <circle cx="14" cy="14" r="1" fill="#8B5CF6" />
          </svg>
        </div>
      )}
      {profession === 'prof_guru' && (
        <div className="absolute -bottom-1 -right-1 bg-white border-2 border-amber-600 rounded-full p-1.5 shadow-md flex items-center justify-center pointer-events-none">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#D97706" strokeWidth="2" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#D97706" strokeWidth="2" />
          </svg>
        </div>
      )}
      {profession === 'prof_polisi' && (
        <div className="absolute -bottom-1 -right-1 bg-white border-2 border-blue-600 rounded-full p-1.5 shadow-md flex items-center justify-center pointer-events-none">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 3l7 3v6c0 5-7 9-7 9s-7-4-7-9V6l7-3z" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.5" />
            <circle cx="12" cy="11" r="2.5" fill="#FACC15" />
          </svg>
        </div>
      )}
      {profession === 'prof_pemadam' && (
        <div className="absolute -bottom-1 -right-1 bg-white border-2 border-red-600 rounded-full p-1.5 shadow-md flex items-center justify-center pointer-events-none">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2c0 4-4 6-4 10a6 6 0 0 0 12 0c0-4-4-6-4-10z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
            <path d="M12 12c0 2-2 3-2 5a3 3 0 0 0 6 0c0-2-2-3-2-5z" fill="#FACC15" />
          </svg>
        </div>
      )}
      {profession === 'prof_pilot' && (
        <div className="absolute -bottom-1 -right-1 bg-white border-2 border-sky-600 rounded-full p-1.5 shadow-md flex items-center justify-center pointer-events-none">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l3 7h6l-5 4 2 7-6-4-6 4 2-7-5-4h6z" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
          </svg>
        </div>
      )}
      {profession === 'prof_koki' && (
        <div className="absolute -bottom-1 -right-1 bg-white border-2 border-amber-600 rounded-full p-1.5 shadow-md flex items-center justify-center pointer-events-none">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M6 13.8V4a2 2 0 1 1 4 0v9.8" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
            <path d="M14 4v16M18 4v16" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}
      {profession === 'prof_atlet' && (
        <div className="absolute -bottom-1 -right-1 bg-white border-2 border-orange-600 rounded-full p-1.5 shadow-md flex items-center justify-center pointer-events-none">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" fill="#EA580C" stroke="#C2410C" strokeWidth="1.5" />
            <path d="M3 12h18M12 3v18" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      )}
      {profession === 'prof_musisi' && (
        <div className="absolute -bottom-1 -right-1 bg-white border-2 border-rose-500 rounded-full p-1.5 shadow-md flex items-center justify-center pointer-events-none">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="8" cy="16" r="3" fill="#E11D48" />
            <circle cx="16" cy="14" r="3" fill="#E11D48" />
            <path d="M11 16V6l8-2v10" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </div>
  );
};
