import React from 'react';
import { ToothSkinMaterial, ToothExpression, BackgroundScene, AvatarBaseCharacter } from '../types';

interface MascotProps {
  baseCharacter?: AvatarBaseCharacter;
  skinMaterial?: ToothSkinMaterial;
  expression?: ToothExpression | 'happy' | 'excited' | 'sparkle' | 'thinking' | 'brushing';
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
      case 'angkasa':
        return (
          <div className="absolute inset-0 -m-3 rounded-3xl bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#311042] border-2 border-indigo-400/50 shadow-inner z-0 overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="15" cy="20" r="1.5" fill="#FFFFFF" />
              <circle cx="85" cy="25" r="2" fill="#FEF08A" />
              <circle cx="35" cy="15" r="1.5" fill="#38BDF8" />
              <circle cx="75" cy="70" r="1" fill="#FFFFFF" />
              <circle cx="80" cy="40" r="7" fill="#F59E0B" />
              <ellipse cx="80" cy="40" rx="14" ry="3" fill="none" stroke="#FDE68A" strokeWidth="1.2" transform="rotate(-20 80 40)" />
              <path d="M 10 75 Q 30 70 50 85" stroke="#C084FC" strokeWidth="2" strokeDasharray="3 3" fill="none" opacity="0.5" />
            </svg>
          </div>
        );
      case 'pantai':
        return (
          <div className="absolute inset-0 -m-3 rounded-3xl bg-gradient-to-b from-[#BAE6FD] via-[#7DD3FC] to-[#FDE68A] border-2 border-amber-300/80 shadow-inner z-0 overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="20" cy="20" r="9" fill="#F59E0B" opacity="0.8" />
              <path d="M 85 80 Q 82 50 88 35" stroke="#78350F" strokeWidth="2.5" fill="none" />
              <path d="M 88 35 Q 75 30 70 40 M 88 35 Q 98 25 102 38" stroke="#16A34A" strokeWidth="2.5" fill="none" />
              <path d="M 0 65 Q 50 60 100 68 V 100 H 0 Z" fill="#0284C7" opacity="0.3" />
              <path d="M 0 78 Q 50 72 100 80 V 100 H 0 Z" fill="#FBBF24" opacity="0.7" />
            </svg>
          </div>
        );
      case 'kastil':
        return (
          <div className="absolute inset-0 -m-3 rounded-3xl bg-gradient-to-b from-[#FDE047]/30 via-[#FCE7F3] to-[#F3E8FF] border-2 border-amber-400/80 shadow-inner z-0 overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
              <rect x="25" y="45" width="50" height="40" fill="#E2E8F0" stroke="#94A3B8" />
              <polygon points="20,45 35,45 27.5,25" fill="#3B82F6" />
              <polygon points="65,45 80,45 72.5,25" fill="#3B82F6" />
              <polygon points="40,35 60,35 50,15" fill="#EF4444" />
              <path d="M 45 15 L 45 8 L 52 11.5 Z" fill="#F59E0B" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center transition-transform hover:scale-105 select-none ${sizeClasses} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Background Scene Backdrop */}
      {backgroundScene && renderBackgroundArt(backgroundScene)}

      {/* Extra Aura Power */}
      {activeExtra === 'extra_aura' && (
        <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-r from-purple-500/50 via-fuchsia-400/60 to-indigo-500/50 blur-2xl animate-pulse z-0" />
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

      {/* Superhero Cape Behind Body */}
      {(activeOutfit === 'outfit_superhero' || cape === 'cape_hero') && (
        <div className="absolute -bottom-1 -left-2 w-full h-full z-0 pointer-events-none">
          <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-md">
            <path
              d="M 45 90 C 20 130 15 190 30 215 C 80 195 120 195 170 215 C 185 190 180 130 155 90 Z"
              fill="#EF4444"
              stroke="#B91C1C"
              strokeWidth="4"
            />
          </svg>
        </div>
      )}

      {/* Main Tooth Character SVG */}
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

          {/* Shadow Filter */}
          <radialGradient id="cuteGroundShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0F172A" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ground Soft Shadow */}
        <ellipse cx="100" cy="208" rx="68" ry="10" fill="url(#cuteGroundShadow)" />

        {/* ----------------------------------------------------
            CUTE CHUBBY FEET / BOOTIES (Berdiri manis di tanah)
            ---------------------------------------------------- */}
        {(() => {
          let shoeFill = activeSkin === 'black' ? '#1E293B' : activeSkin === 'gold' ? '#F59E0B' : '#E0F2FE';
          let shoeStroke = activeSkin === 'black' ? '#FBBF24' : activeSkin === 'gold' ? '#854D0E' : '#0284C7';
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

        {/* ----------------------------------------------------
            CUTE CHUBBY ARMS / HANDS (Tangan mungil menyapa)
            ---------------------------------------------------- */}
        {(() => {
          let handFill = activeSkin === 'gold' ? '#FACC15' : activeSkin === 'black' ? '#1E293B' : activeSkin === 'diamond' ? '#E0F2FE' : '#FFFFFF';
          let handStroke = activeSkin === 'gold' ? '#854D0E' : activeSkin === 'black' ? '#FBBF24' : '#0284C7';
          return (
            <g className="cute-arms">
              {/* Left Arm (Waving cute hello hand) */}
              <path
                d="M 44 112 C 24 100 16 90 22 80 C 28 72 38 80 48 95 Z"
                fill={handFill}
                stroke={handStroke}
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <circle cx="21" cy="80" r="7" fill={handFill} stroke={handStroke} strokeWidth="3" />

              {/* Right Arm (Cute rounded rest arm or ready to hold item) */}
              <path
                d="M 156 112 C 176 108 184 102 180 92 C 174 84 164 92 152 104 Z"
                fill={handFill}
                stroke={handStroke}
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <circle cx="178" cy="94" r="7" fill={handFill} stroke={handStroke} strokeWidth="3" />
            </g>
          );
        })()}

        {/* ----------------------------------------------------
            CUTE TOOTH BODY (CHUBBY, SOFT, MARSHMALLOW SHAPE)
            Tidak kurus, tidak lancip, sangat empuk dan menggemaskan!
            ---------------------------------------------------- */}
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
            strokeColor = '#FBBF24'; // Radiant gold outline
            strokeWidth = '5';
          } else if (activeSkin === 'diamond') {
            fillUrl = 'url(#skinDiamondCuteGrad)';
            strokeColor = '#0284C7';
            strokeWidth = '5';
          }

          // Body silhouette variations based on baseCharacter
          let bodyPath = '';
          if (baseCharacter === 'molar') {
            // Extra plump twin-crown molar
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
            // Super bouncy squishy round tooth
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
            // Standard 'chibi' & 'hero': Perfect cute, plump, adorable baby tooth
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

        {/* ----------------------------------------------------
            3D SPECULAR ENAMEL GLOSS HIGHLIGHTS (Kilau 3D Imut)
            ---------------------------------------------------- */}
        {/* Top-left lobe 3D bubble shine */}
        <path
          d="M 54 44 C 62 34, 76 33, 86 38 C 76 43, 62 48, 54 44 Z"
          fill="#FFFFFF"
          opacity={activeSkin === 'black' ? 0.35 : 0.85}
        />
        <ellipse cx="62" cy="52" rx="4" ry="2.5" fill="#FFFFFF" opacity={activeSkin === 'black' ? 0.4 : 0.9} transform="rotate(-20 62 52)" />

        {/* Right lobe secondary highlight */}
        <path
          d="M 120 38 C 130 34, 142 36, 146 44 C 140 46, 128 44, 120 38 Z"
          fill="#FFFFFF"
          opacity={activeSkin === 'black' ? 0.25 : 0.6}
        />

        {/* Diamond Geometric Facet Lines */}
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

        {/* ----------------------------------------------------
            CHUBBY ROSY CHEEKS (Pipi Tembem Merona)
            ---------------------------------------------------- */}
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

        {/* Extra Cheek Sticker */}
        {activeExtra === 'extra_sticker' && (
          <g transform="translate(46, 108) scale(0.8)">
            <polygon points="10,0 13,7 20,8 15,13 16,20 10,16 4,20 5,13 0,8 7,7" fill="#F43F5E" />
          </g>
        )}

        {/* ----------------------------------------------------
            CUTE ANIME / CHIBI EYES & MOUTH
            (12 Ekspresi Karakteristik dari Gambar 3)
            ---------------------------------------------------- */}
        <g className="cute-eyes-and-mouth">
          {/* 1. WINK (Kedip Lucu) */}
          {expression === 'wink' ? (
            <>
              {/* Left Eye: Playful Winking Curve with eyelashes */}
              <path
                d="M 58 98 Q 72 86 84 98"
                stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'}
                strokeWidth="5.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Wink star sparkle flare */}
              <path d="M 50 94 L 52 98 L 56 99 L 52 100 L 50 104 L 48 100 L 44 99 L 48 98 Z" fill="#FACC15" />

              {/* Right Eye: Big Shiny Anime Eye */}
              <ellipse cx="128" cy="96" rx="11" ry="14" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <circle cx="124" cy="91" r="5" fill="#FFFFFF" />
              <circle cx="132" cy="101" r="2.5" fill="#FFFFFF" />
            </>
          ) : expression === 'bahagia' ? (
            /* 2. BAHAGIA (Super sparkling big anime eyes with starry glint) */
            <>
              <ellipse cx="72" cy="95" rx="12" ry="15" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <circle cx="68" cy="89" r="5.5" fill="#FFFFFF" />
              <circle cx="76" cy="101" r="2.5" fill="#FFFFFF" />
              <polygon points="72,94 73,97 76,98 73,99 72,102 71,99 68,98 71,97" fill="#FEF08A" />

              <ellipse cx="128" cy="95" rx="12" ry="15" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <circle cx="124" cy="89" r="5.5" fill="#FFFFFF" />
              <circle cx="132" cy="101" r="2.5" fill="#FFFFFF" />
              <polygon points="128,94 129,97 132,98 129,99 128,102 127,99 124,98 127,97" fill="#FEF08A" />
            </>
          ) : expression === 'tertawa' ? (
            /* 3. TERTAWA (Happy squinting crescent arches) */
            <>
              <path
                d="M 58 98 Q 72 84 86 98"
                stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'}
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 114 98 Q 128 84 142 98"
                stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'}
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : expression === 'semangat' ? (
            /* 4. SEMANGAT (Pahlawan anime, energetic star in eyes) */
            <>
              <ellipse cx="72" cy="95" rx="11" ry="14" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <polygon points="72,89 74,94 79,95 74,97 72,102 70,97 65,95 70,94" fill="#FACC15" />
              <circle cx="68" cy="90" r="3.5" fill="#FFFFFF" />

              <ellipse cx="128" cy="95" rx="11" ry="14" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <polygon points="128,89 130,94 135,95 130,97 128,102 126,97 121,95 126,94" fill="#FACC15" />
              <circle cx="124" cy="90" r="3.5" fill="#FFFFFF" />
            </>
          ) : expression === 'sayang' ? (
            /* 5. SAYANG (Heart eyes) */
            <>
              <path
                d="M 72 104 C 65 94 52 94 56 86 C 59 80 72 84 72 90 C 72 84 85 80 88 86 C 92 94 79 94 72 104 Z"
                fill="#F43F5E"
                stroke="#BE123C"
                strokeWidth="1.5"
              />
              <path
                d="M 128 104 C 121 94 108 94 112 86 C 115 80 128 84 128 90 C 128 84 141 80 144 86 C 148 94 135 94 128 104 Z"
                fill="#F43F5E"
                stroke="#BE123C"
                strokeWidth="1.5"
              />
              {/* Floating heart */}
              <path d="M 148 65 C 144 60 138 60 140 56 C 141 52 148 54 148 58 C 148 54 155 52 156 56 C 158 60 152 60 148 65 Z" fill="#FB7185" />
            </>
          ) : expression === 'kaget' ? (
            /* 6. KAGET (Shocked big round eyes) */
            <>
              <ellipse cx="72" cy="94" rx="13" ry="15" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <circle cx="70" cy="90" r="5" fill="#FFFFFF" />
              <ellipse cx="128" cy="94" rx="13" ry="15" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <circle cx="126" cy="90" r="5" fill="#FFFFFF" />
            </>
          ) : expression === 'sedih' ? (
            /* 7. SEDIH (Watery puppy eyes with soft tears) */
            <>
              <ellipse cx="72" cy="96" rx="10" ry="13" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <circle cx="70" cy="92" r="4.5" fill="#FFFFFF" />
              <ellipse cx="128" cy="96" rx="10" ry="13" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <circle cx="126" cy="92" r="4.5" fill="#FFFFFF" />
              {/* Cute tear droplets */}
              <circle cx="82" cy="110" r="3.5" fill="#38BDF8" opacity="0.85" />
              <circle cx="118" cy="110" r="3.5" fill="#38BDF8" opacity="0.85" />
            </>
          ) : expression === 'marah' ? (
            /* 8. MARAH (Pouting brows with anime anger pop) */
            <>
              <line x1="60" y1="84" x2="82" y2="92" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="5" strokeLinecap="round" />
              <line x1="140" y1="84" x2="118" y2="92" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="5" strokeLinecap="round" />
              <ellipse cx="73" cy="98" rx="9" ry="11" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <ellipse cx="127" cy="98" rx="9" ry="11" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              {/* Manga anger vein */}
              <path d="M 148 64 L 158 64 M 153 59 L 153 69" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : expression === 'malu' ? (
            /* 9. MALU (Shy downward looking eyes + blush hatch) */
            <>
              <ellipse cx="72" cy="98" rx="9" ry="11" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <circle cx="70" cy="95" r="4" fill="#FFFFFF" />
              <ellipse cx="128" cy="98" rx="9" ry="11" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <circle cx="126" cy="95" r="4" fill="#FFFFFF" />
              <line x1="50" y1="112" x2="54" y2="118" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="56" y1="112" x2="60" y2="118" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="140" y1="112" x2="144" y2="118" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="146" y1="112" x2="150" y2="118" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : expression === 'ngantuk' ? (
            /* 10. NGANTUK (Sleeping eyes + Zzz) */
            <>
              <path d="M 60 96 Q 72 102 84 96" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="5" strokeLinecap="round" fill="none" />
              <path d="M 116 96 Q 128 102 140 96" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="5" strokeLinecap="round" fill="none" />
              <text x="146" y="68" fill="#38BDF8" fontSize="16" fontWeight="900" fontFamily="sans-serif">Z</text>
              <text x="157" y="56" fill="#38BDF8" fontSize="12" fontWeight="900" fontFamily="sans-serif">z</text>
              <text x="165" y="47" fill="#38BDF8" fontSize="9" fontWeight="900" fontFamily="sans-serif">z</text>
            </>
          ) : (
            /* 11 & 12. SENYUM / KEREN (Default big shiny kawaii anime eyes) */
            <>
              <ellipse cx="72" cy="95" rx="11" ry="14" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <circle cx="68" cy="89" r="5" fill="#FFFFFF" />
              <circle cx="76" cy="100" r="2.5" fill="#FFFFFF" />

              <ellipse cx="128" cy="95" rx="11" ry="14" fill={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} />
              <circle cx="124" cy="89" r="5" fill="#FFFFFF" />
              <circle cx="132" cy="100" r="2.5" fill="#FFFFFF" />
            </>
          )}

          {/* CUTE MOUTH (Mulut Imut dengan lidah merah muda) */}
          {expression === 'tertawa' || expression === 'bahagia' ? (
            /* Open laughing mouth with tongue */
            <g>
              <path
                d="M 82 110 Q 100 136 118 110 Z"
                fill="#E11D48"
                stroke="#881337"
                strokeWidth="2.5"
              />
              <path d="M 90 126 Q 100 120 110 126 Q 100 134 90 126 Z" fill="#FB7185" />
            </g>
          ) : expression === 'kaget' ? (
            <ellipse cx="100" cy="118" rx="8" ry="11" fill="#881337" stroke="#4C0519" strokeWidth="2" />
          ) : expression === 'sedih' ? (
            <path d="M 88 122 Q 100 110 112 122" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="4.5" strokeLinecap="round" fill="none" />
          ) : expression === 'marah' ? (
            <path d="M 90 122 L 110 122" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="4.5" strokeLinecap="round" fill="none" />
          ) : expression === 'malu' ? (
            <path d="M 92 114 Q 100 122 108 114" stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'} strokeWidth="4" strokeLinecap="round" fill="none" />
          ) : (
            /* Classic sweet happy smile */
            <path
              d="M 84 112 Q 100 130 116 112"
              stroke={activeSkin === 'black' ? '#F8FAFC' : '#0F2C27'}
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </g>

        {/* ----------------------------------------------------
            CUTE VECTOR OUTFITS (Pakaian Pas & Cantik)
            ---------------------------------------------------- */}
        {activeOutfit === 'outfit_hoodie' && (
          <g className="cute-outfit-hoodie">
            {/* Hoodie body */}
            <path
              d="M 50 144 C 70 138 130 138 150 144 C 146 172 138 186 126 186 C 100 168 100 168 74 186 C 62 186 54 172 50 144 Z"
              fill="#0284C7"
              stroke="#0369A1"
              strokeWidth="3.5"
            />
            {/* White hood collar folds */}
            <path d="M 80 144 Q 100 155 120 144" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Cords */}
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
            {/* Red Collar Ring */}
            <path d="M 82 142 Q 100 152 118 142" stroke="#EF4444" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Golden Star / Tooth Emblem */}
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
            {/* Overalls Straps */}
            <rect x="74" y="136" width="9" height="26" fill="#1D4ED8" rx="2.5" />
            <rect x="117" y="136" width="9" height="26" fill="#1D4ED8" rx="2.5" />
            <circle cx="78.5" cy="155" r="3" fill="#FACC15" />
            <circle cx="121.5" cy="155" r="3" fill="#FACC15" />
            {/* Front Pocket */}
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
            {/* Golden Hero Belt */}
            <rect x="66" y="162" width="68" height="7" rx="2" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
            <circle cx="100" cy="165.5" r="5" fill="#EF4444" stroke="#FACC15" strokeWidth="1.5" />
            {/* Chest Crest */}
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
            {/* White Shirt Triangle */}
            <polygon points="100,172 84,142 116,142" fill="#FFFFFF" />
            {/* Red Bowtie */}
            <polygon points="92,143 100,147 92,151" fill="#DC2626" />
            <polygon points="108,143 100,147 108,151" fill="#DC2626" />
            <circle cx="100" cy="147" r="2.5" fill="#991B1B" />
          </g>
        )}
      </svg>

      {/* ----------------------------------------------------
          HAND-HELD ITEMS (Senjata & Perlengkapan Lucu di Tangan)
          ---------------------------------------------------- */}
      {heldItem === 'hand_brush' && (
        <div className="absolute bottom-[10%] -right-[12%] z-20 pointer-events-none drop-shadow-lg">
          <svg width="48" height="48" viewBox="0 0 48 48">
            {/* Toothbrush handle */}
            <path d="M 12 42 L 34 16" stroke="#0284C7" strokeWidth="6" strokeLinecap="round" />
            <path d="M 16 38 L 28 24" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
            {/* Bristles head */}
            <rect x="28" y="8" width="14" height="10" rx="3" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" transform="rotate(-40 28 8)" />
            <line x1="32" y1="9" x2="36" y2="15" stroke="#38BDF8" strokeWidth="2" />
            {/* Cute toothpaste swirl */}
            <path d="M 32 4 C 36 2, 42 4, 38 8" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      )}

      {heldItem === 'hand_shield' && (
        <div className="absolute bottom-[12%] -left-[12%] z-20 pointer-events-none drop-shadow-lg">
          <svg width="48" height="48" viewBox="0 0 48 48">
            <path d="M 24 6 L 40 12 V 24 C 40 34 24 44 24 44 C 24 44 8 34 8 24 V 12 L 24 6 Z" fill="#0284C7" stroke="#FACC15" strokeWidth="2.5" />
            <path d="M 24 10 L 36 15 V 24 C 36 31 24 39 24 39 C 24 39 12 31 12 24 V 15 L 24 10 Z" fill="#0369A1" />
            {/* Tooth emblem on shield */}
            <path d="M 24 18 C 22 16 19 18 19 22 C 19 26 24 32 24 32 C 24 32 29 26 29 22 C 29 18 26 16 24 18 Z" fill="#FFFFFF" />
          </svg>
        </div>
      )}

      {heldItem === 'hand_paste' && (
        <div className="absolute bottom-[8%] -right-[8%] z-20 pointer-events-none drop-shadow-lg">
          <svg width="42" height="42" viewBox="0 0 48 48">
            <rect x="18" y="14" width="14" height="24" rx="4" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" transform="rotate(25 18 14)" />
            <rect x="23" y="7" width="8" height="8" rx="2" fill="#0284C7" transform="rotate(25 23 7)" />
            <path d="M 22 22 L 30 25" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {heldItem === 'hand_glass' && (
        <div className="absolute bottom-[10%] -left-[10%] z-20 pointer-events-none drop-shadow-lg">
          <svg width="44" height="44" viewBox="0 0 48 48">
            <circle cx="20" cy="20" r="12" fill="#E0F2FE" fillOpacity="0.6" stroke="#0284C7" strokeWidth="3.5" />
            <path d="M 16 14 Q 22 12 24 18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <line x1="29" y1="29" x2="42" y2="42" stroke="#64748B" strokeWidth="5.5" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {heldItem === 'hand_mirror' && (
        <div className="absolute bottom-[10%] -right-[10%] z-20 pointer-events-none drop-shadow-lg">
          <svg width="44" height="44" viewBox="0 0 48 48">
            <circle cx="34" cy="14" r="9" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3" />
            <ellipse cx="32" cy="12" rx="4" ry="2" fill="#FFFFFF" />
            <line x1="28" y1="20" x2="14" y2="40" stroke="#64748B" strokeWidth="4.5" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* ----------------------------------------------------
          HANDCRAFTED VECTOR HATS (Hiasan Kepala Keren)
          ---------------------------------------------------- */}
      {activeHat === 'hat_cap' && (
        <div className="absolute -top-[16%] left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-md">
          <svg width="68" height="40" viewBox="0 0 68 40">
            <path d="M 14 26 C 14 10 54 10 54 26 Z" fill="#0284C7" stroke="#0369A1" strokeWidth="2.5" />
            {/* Cap bill */}
            <path d="M 40 26 C 50 26 66 28 66 32 C 66 35 48 36 36 34 Z" fill="#0369A1" stroke="#0284C7" strokeWidth="1" />
            <circle cx="34" cy="11" r="2.5" fill="#FFFFFF" />
            {/* Front Star badge */}
            <circle cx="34" cy="20" r="5" fill="#FACC15" />
          </svg>
        </div>
      )}

      {activeHat === 'hat_crown' && (
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-lg animate-bounce-gentle">
          <svg width="64" height="44" viewBox="0 0 64 44">
            <polygon points="8,36 12,14 26,24 32,8 38,24 52,14 56,36" fill="#FACC15" stroke="#B45309" strokeWidth="2.5" />
            <rect x="8" y="35" width="48" height="6" rx="2" fill="#EAB308" stroke="#B45309" strokeWidth="1.5" />
            {/* Jewels */}
            <circle cx="32" cy="11" r="3.5" fill="#DC2626" />
            <circle cx="14" cy="16" r="3" fill="#3B82F6" />
            <circle cx="50" cy="16" r="3" fill="#3B82F6" />
            <circle cx="20" cy="38" r="2" fill="#DC2626" />
            <circle cx="32" cy="38" r="2" fill="#10B981" />
            <circle cx="44" cy="38" r="2" fill="#DC2626" />
          </svg>
        </div>
      )}

      {activeHat === 'hat_ribbon' && (
        <div className="absolute -top-[14%] right-[8%] z-20 pointer-events-none drop-shadow-md animate-bounce-gentle">
          <svg width="48" height="40" viewBox="0 0 48 40">
            {/* Left Bow Loop */}
            <path d="M 24 20 C 14 10 4 12 6 22 C 8 30 18 24 24 20 Z" fill="#FB7185" stroke="#E11D48" strokeWidth="2" />
            {/* Right Bow Loop */}
            <path d="M 24 20 C 34 10 44 12 42 22 C 40 30 30 24 24 20 Z" fill="#FB7185" stroke="#E11D48" strokeWidth="2" />
            {/* Center knot */}
            <circle cx="24" cy="20" r="5" fill="#E11D48" />
            {/* Ribbon ribbons tail */}
            <path d="M 22 22 L 16 36 M 26 22 L 32 36" stroke="#FB7185" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {activeHat === 'hat_grad' && (
        <div className="absolute -top-[18%] left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-md">
          <svg width="72" height="44" viewBox="0 0 72 44">
            <polygon points="36,6 68,18 36,28 4,18" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            <rect x="25" y="26" width="22" height="9" rx="2.5" fill="#0F172A" />
            <path d="M 58 20 V 34" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="58" cy="35" r="2.5" fill="#FACC15" />
          </svg>
        </div>
      )}

      {activeHat === 'hat_doctor' && (
        <div className="absolute -top-[16%] left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-md">
          <svg width="56" height="38" viewBox="0 0 56 38">
            {/* Head mirror band */}
            <path d="M 6 28 Q 28 20 50 28" stroke="#0D9488" strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Circular doctor reflector mirror */}
            <circle cx="28" cy="18" r="12" fill="#E0F2FE" stroke="#0D9488" strokeWidth="2.5" />
            <circle cx="28" cy="18" r="4" fill="#0D9488" />
            <ellipse cx="25" cy="15" rx="3" ry="1.5" fill="#FFFFFF" />
          </svg>
        </div>
      )}

      {activeHat === 'hat_nurse' && (
        <div className="absolute -top-[14%] left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-md">
          <svg width="48" height="32" viewBox="0 0 48 32">
            <path d="M 6 26 L 10 10 L 38 10 L 42 26 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <path d="M 24 14 V 22 M 20 18 H 28" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {activeHat === 'hat_police' && (
        <div className="absolute -top-[16%] left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-md">
          <svg width="60" height="36" viewBox="0 0 60 36">
            <path d="M 12 24 C 12 8 48 8 48 24 Z" fill="#1E3A8A" stroke="#172554" strokeWidth="2" />
            <rect x="10" y="24" width="40" height="5" rx="2" fill="#172554" />
            <circle cx="30" cy="16" r="4.5" fill="#FACC15" />
          </svg>
        </div>
      )}

      {activeHat === 'hat_fire' && (
        <div className="absolute -top-[16%] left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-md">
          <svg width="64" height="36" viewBox="0 0 64 36">
            <path d="M 14 24 C 14 8 50 8 50 24 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
            <path d="M 6 24 Q 32 20 58 24" stroke="#991B1B" strokeWidth="4" strokeLinecap="round" fill="none" />
            <polygon points="32,12 36,18 28,18" fill="#FACC15" />
          </svg>
        </div>
      )}

      {activeHat === 'hat_pilot' && (
        <div className="absolute -top-[16%] left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-md">
          <svg width="64" height="36" viewBox="0 0 64 36">
            <path d="M 14 24 C 14 8 50 8 50 24 Z" fill="#0F172A" stroke="#0284C7" strokeWidth="2" />
            <rect x="12" y="22" width="40" height="4" fill="#FACC15" />
            <polygon points="32,12 36,16 28,16" fill="#FACC15" />
          </svg>
        </div>
      )}

      {activeHat === 'hat_chef' && (
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-md">
          <svg width="60" height="44" viewBox="0 0 60 44">
            <path
              d="M 16 34 C 8 28 8 16 18 16 C 18 8 42 8 42 16 C 52 16 52 28 44 34 Z"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="2.5"
            />
            <rect x="16" y="32" width="28" height="6" rx="1.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          </svg>
        </div>
      )}

      {/* ----------------------------------------------------
          GLASSES & EYEWEAR (Kacamata Keren)
          ---------------------------------------------------- */}
      {activeAccessory === 'acc_glasses' && (
        <div className="absolute top-[38%] left-[16%] right-[16%] z-20 pointer-events-none drop-shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-full border-3 border-slate-900 bg-cyan-200/25 flex items-center justify-center">
              <div className="w-3 h-1.5 bg-white/60 rounded-full rotate-45" />
            </div>
            <div className="w-5 h-1 bg-slate-900" />
            <div className="w-9 h-9 rounded-full border-3 border-slate-900 bg-cyan-200/25 flex items-center justify-center">
              <div className="w-3 h-1.5 bg-white/60 rounded-full rotate-45" />
            </div>
          </div>
        </div>
      )}

      {(activeAccessory === 'glasses_cool' || expression === 'keren') && (
        <div className="absolute top-[38%] left-[16%] right-[16%] z-20 pointer-events-none drop-shadow-md">
          <div className="flex items-center justify-between">
            <div className="w-10 h-7 rounded-lg bg-slate-950 border border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-1 left-1 w-6 h-1 bg-white/30 rounded-full -rotate-12" />
            </div>
            <div className="w-4 h-2 bg-slate-950" />
            <div className="w-10 h-7 rounded-lg bg-slate-950 border border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-1 left-1 w-6 h-1 bg-white/30 rounded-full -rotate-12" />
            </div>
          </div>
        </div>
      )}

      {/* Scarf / Bowtie / Medal / Backpack */}
      {activeAccessory === 'acc_bowtie' && (
        <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-md">
          <svg width="36" height="24" viewBox="0 0 36 24">
            <polygon points="6,6 18,12 6,18" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
            <polygon points="30,6 18,12 30,18" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
            <circle cx="18" cy="12" r="4" fill="#991B1B" />
          </svg>
        </div>
      )}

      {activeAccessory === 'acc_scarf' && (
        <div className="absolute bottom-[24%] left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-md">
          <svg width="60" height="28" viewBox="0 0 60 28">
            <path d="M 8 10 Q 30 18 52 10" stroke="#EF4444" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M 40 10 L 44 26" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
            <line x1="40" y1="26" x2="48" y2="26" stroke="#FACC15" strokeWidth="2" />
          </svg>
        </div>
      )}

      {activeAccessory === 'acc_medal' && (
        <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-md">
          <svg width="36" height="36" viewBox="0 0 36 36">
            <polygon points="18,6 12,18 24,18" fill="#DC2626" />
            <circle cx="18" cy="24" r="9" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
            <circle cx="18" cy="24" r="5" fill="#EAB308" />
            <text x="16" y="27" fill="#FFFFFF" fontSize="8" fontWeight="900" fontFamily="sans-serif">★</text>
          </svg>
        </div>
      )}

      {activeAccessory === 'acc_backpack' && (
        <div className="absolute bottom-[26%] -left-[6%] z-20 pointer-events-none drop-shadow-md">
          <svg width="34" height="38" viewBox="0 0 34 38">
            <rect x="4" y="8" width="26" height="26" rx="6" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
            <rect x="8" y="16" width="18" height="12" rx="3" fill="#B91C1C" />
            <circle cx="17" cy="22" r="2" fill="#FACC15" />
          </svg>
        </div>
      )}

      {/* ----------------------------------------------------
          PROFESSION GEAR ILLUSTRATIONS (Badge & Atribut Profesi)
          ---------------------------------------------------- */}
      {profession === 'prof_dokter' && (
        <div className="absolute -bottom-1 -right-1 bg-white border-2 border-teal-500 rounded-full p-1.5 shadow-md flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 4v5a4 4 0 0 0 8 0V4" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M8 13v3a4 4 0 0 0 8 0v-1" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="16" cy="14" r="2.5" fill="#0D9488" />
          </svg>
        </div>
      )}
      {profession === 'prof_perawat' && (
        <div className="absolute -bottom-1 -right-1 bg-white border-2 border-pink-500 rounded-full p-1.5 shadow-md flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="4" width="14" height="16" rx="2" stroke="#EC4899" strokeWidth="2" />
            <path d="M12 9v6M9 12h6" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}
      {profession === 'prof_ilmuwan' && (
        <div className="absolute -bottom-1 -right-1 bg-white border-2 border-purple-500 rounded-full p-1.5 shadow-md flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M10 3h4M12 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
            <circle cx="11" cy="16" r="1.5" fill="#8B5CF6" />
            <circle cx="14" cy="14" r="1" fill="#8B5CF6" />
          </svg>
        </div>
      )}
      {profession === 'prof_guru' && (
        <div className="absolute -bottom-1 -right-1 bg-white border-2 border-amber-600 rounded-full p-1.5 shadow-md flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#D97706" strokeWidth="2" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#D97706" strokeWidth="2" />
          </svg>
        </div>
      )}
      {profession === 'prof_polisi' && (
        <div className="absolute -bottom-1 -right-1 bg-white border-2 border-blue-600 rounded-full p-1.5 shadow-md flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 3l7 3v6c0 5-7 9-7 9s-7-4-7-9V6l7-3z" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.5" />
            <circle cx="12" cy="11" r="2.5" fill="#FACC15" />
          </svg>
        </div>
      )}
      {profession === 'prof_pemadam' && (
        <div className="absolute -bottom-1 -right-1 bg-white border-2 border-red-600 rounded-full p-1.5 shadow-md flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2c0 4-4 6-4 10a6 6 0 0 0 12 0c0-4-4-6-4-10z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
            <path d="M12 12c0 2-2 3-2 5a3 3 0 0 0 6 0c0-2-2-3-2-5z" fill="#FACC15" />
          </svg>
        </div>
      )}
      {profession === 'prof_pilot' && (
        <div className="absolute -bottom-1 -right-1 bg-white border-2 border-sky-600 rounded-full p-1.5 shadow-md flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l3 7h6l-5 4 2 7-6-4-6 4 2-7-5-4h6z" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
          </svg>
        </div>
      )}
      {profession === 'prof_koki' && (
        <div className="absolute -bottom-1 -right-1 bg-white border-2 border-amber-600 rounded-full p-1.5 shadow-md flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M6 13.8V4a2 2 0 1 1 4 0v9.8" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
            <path d="M14 4v16M18 4v16" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}
      {profession === 'prof_atlet' && (
        <div className="absolute -bottom-1 -right-1 bg-white border-2 border-orange-600 rounded-full p-1.5 shadow-md flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" fill="#EA580C" stroke="#C2410C" strokeWidth="1.5" />
            <path d="M3 12h18M12 3v18" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      )}
      {profession === 'prof_musisi' && (
        <div className="absolute -bottom-1 -right-1 bg-white border-2 border-rose-500 rounded-full p-1.5 shadow-md flex items-center justify-center">
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
