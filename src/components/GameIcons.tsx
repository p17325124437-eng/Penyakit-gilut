import React from 'react';

// ==========================================
// A. TOMBOL UTAMA 3D (GAMBAR 4 - A)
// ==========================================

export const PlayButton3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-md ${className}`}>
    <defs>
      <radialGradient id="btnGreenGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#86EFAC" />
        <stop offset="40%" stopColor="#22C55E" />
        <stop offset="100%" stopColor="#15803D" />
      </radialGradient>
      <linearGradient id="btnGreenHighlight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="34" r="28" fill="#14532D" opacity="0.4" />
    <circle cx="32" cy="32" r="28" fill="url(#btnGreenGrad)" stroke="#166534" strokeWidth="2" />
    <ellipse cx="32" cy="18" rx="18" ry="8" fill="url(#btnGreenHighlight)" />
    {/* Triangle Play Symbol */}
    <path d="M26 21L45 32L26 43V21Z" fill="#FFFFFF" stroke="#166534" strokeWidth="2" strokeLinejoin="round" />
    <path d="M26 21L45 32L26 43V21Z" fill="#FFFFFF" />
  </svg>
);

export const StoreButton3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-md ${className}`}>
    <defs>
      <radialGradient id="btnOrangeGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="35%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#C2410C" />
      </radialGradient>
      <linearGradient id="btnOrangeHighlight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="34" r="28" fill="#7C2D12" opacity="0.4" />
    <circle cx="32" cy="32" r="28" fill="url(#btnOrangeGrad)" stroke="#9A3412" strokeWidth="2" />
    <ellipse cx="32" cy="18" rx="18" ry="8" fill="url(#btnOrangeHighlight)" />
    {/* Cart Icon */}
    <path d="M20 22H24L27 38H43L46 26H26" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="28" cy="43" r="3" fill="#FFFFFF" />
    <circle cx="41" cy="43" r="3" fill="#FFFFFF" />
  </svg>
);

export const BookButton3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-md ${className}`}>
    <defs>
      <radialGradient id="btnPurpleGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#D8B4FE" />
        <stop offset="40%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#7E22CE" />
      </radialGradient>
      <linearGradient id="btnPurpleHighlight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="34" r="28" fill="#581C87" opacity="0.4" />
    <circle cx="32" cy="32" r="28" fill="url(#btnPurpleGrad)" stroke="#6B21A8" strokeWidth="2" />
    <ellipse cx="32" cy="18" rx="18" ry="8" fill="url(#btnPurpleHighlight)" />
    {/* Open Book Icon */}
    <path d="M32 26C28 22 21 23 20 24V40C22 39 28 38 32 41C36 38 42 39 44 40V24C43 23 36 22 32 26Z" fill="#FFFFFF" stroke="#581C87" strokeWidth="1.5" />
    <line x1="32" y1="26" x2="32" y2="41" stroke="#A855F7" strokeWidth="2" />
  </svg>
);

export const ToothCharButton3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-md ${className}`}>
    <defs>
      <radialGradient id="btnBlueGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#7DD3FC" />
        <stop offset="40%" stopColor="#0EA5E9" />
        <stop offset="100%" stopColor="#0369A1" />
      </radialGradient>
      <linearGradient id="btnBlueHighlight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="34" r="28" fill="#0C4A6E" opacity="0.4" />
    <circle cx="32" cy="32" r="28" fill="url(#btnBlueGrad)" stroke="#0284C7" strokeWidth="2" />
    <ellipse cx="32" cy="18" rx="18" ry="8" fill="url(#btnBlueHighlight)" />
    {/* Cute Tooth Silhouette */}
    <path d="M24 23C24 20 27 18 32 20C37 18 40 20 40 23C40 27 42 31 39 37C37 41 35 44 33 44C32 44 32 37 32 37C32 37 32 44 31 44C29 44 27 41 25 37C22 31 24 27 24 23Z" fill="#FFFFFF" />
  </svg>
);

export const SettingsButton3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-md ${className}`}>
    <defs>
      <radialGradient id="btnPinkGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="45%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#BE185D" />
      </radialGradient>
      <linearGradient id="btnPinkHighlight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="34" r="28" fill="#831843" opacity="0.4" />
    <circle cx="32" cy="32" r="28" fill="url(#btnPinkGrad)" stroke="#9D174D" strokeWidth="2" />
    <ellipse cx="32" cy="18" rx="18" ry="8" fill="url(#btnPinkHighlight)" />
    {/* Gear Icon */}
    <path d="M32 26C28.7 26 26 28.7 26 32C26 35.3 28.7 38 32 38C35.3 38 38 35.3 38 32C38 28.7 35.3 26 32 26ZM43 31H40.8C40.6 30 40.2 29.1 39.7 28.3L41.3 26.7C41.7 26.3 41.7 25.7 41.3 25.3L38.7 22.7C38.3 22.3 37.7 22.3 37.3 22.7L35.7 24.3C34.9 23.8 34 23.4 33 23.2V21C33 20.4 32.6 20 32 20H28C27.4 20 27 20.4 27 21V23.2C26 23.4 25.1 23.8 24.3 24.3L22.7 22.7C22.3 22.3 21.7 22.3 21.3 22.7L18.7 25.3C18.3 25.7 18.3 26.3 18.7 26.7L20.3 28.3C19.8 29.1 19.4 30 19.2 31H17C16.4 31 16 31.4 16 32V36C16 36.6 16.4 37 17 37H19.2C19.4 38 19.8 38.9 20.3 39.7L18.7 41.3C18.3 41.7 18.3 42.3 18.7 42.7L21.3 45.3C21.7 45.7 22.3 45.7 22.7 45.3L24.3 43.7C25.1 44.2 26 44.6 27 44.8V47C27 47.6 27.4 48 28 48H32C32.6 48 33 47.6 33 47V44.8C34 44.6 34.9 44.2 35.7 43.7L37.3 45.3C37.7 45.7 38.3 45.7 38.7 45.3L41.3 42.7C41.7 42.3 41.7 41.7 41.3 41.3L39.7 39.7C40.2 38.9 40.6 38 40.8 37H43C43.6 37 44 36.6 44 36V32C44 31.4 43.6 31 43 31Z" fill="#FFFFFF" />
  </svg>
);

export const BackButton3D: React.FC<{ size?: number; className?: string }> = ({ size = 44, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-md ${className}`}>
    <defs>
      <radialGradient id="btnBackGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="45%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0369A1" />
      </radialGradient>
      <linearGradient id="btnBackHi" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="34" r="28" fill="#082F49" opacity="0.4" />
    <circle cx="32" cy="32" r="28" fill="url(#btnBackGrad)" stroke="#0369A1" strokeWidth="2" />
    <ellipse cx="32" cy="18" rx="18" ry="8" fill="url(#btnBackHi)" />
    <path d="M38 21L23 32L38 43" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CheckButton3D: React.FC<{ size?: number; className?: string }> = ({ size = 44, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-md ${className}`}>
    <defs>
      <radialGradient id="btnCheckGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#4ADE80" />
        <stop offset="45%" stopColor="#16A34A" />
        <stop offset="100%" stopColor="#15803D" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="34" r="28" fill="#14532D" opacity="0.4" />
    <circle cx="32" cy="32" r="28" fill="url(#btnCheckGrad)" stroke="#166534" strokeWidth="2" />
    <path d="M21 33L29 41L44 24" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CancelButton3D: React.FC<{ size?: number; className?: string }> = ({ size = 44, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-md ${className}`}>
    <defs>
      <radialGradient id="btnCancelGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="45%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#991B1B" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="34" r="28" fill="#7F1D1D" opacity="0.4" />
    <circle cx="32" cy="32" r="28" fill="url(#btnCancelGrad)" stroke="#991B1B" strokeWidth="2" />
    <path d="M23 23L41 41M41 23L23 41" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

// ==========================================
// D. STATUS & INDIKATOR 3D (GAMBAR 4 - D)
// ==========================================

export const Heart3D: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={`drop-shadow-xs ${className}`}>
    <defs>
      <radialGradient id="heartGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FDA4AF" />
        <stop offset="30%" stopColor="#F43F5E" />
        <stop offset="100%" stopColor="#9F1239" />
      </radialGradient>
      <linearGradient id="heartHi" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d="M18 32S5 22 5 12C5 7.5 8.5 4 13 4C15.5 4 17.5 5.5 18 7C18.5 5.5 20.5 4 23 4C27.5 4 31 7.5 31 12C31 22 18 32 18 32Z" fill="url(#heartGrad)" stroke="#881337" strokeWidth="1.2" />
    <ellipse cx="12" cy="9" rx="4" ry="2.5" fill="url(#heartHi)" />
    <ellipse cx="24" cy="9" rx="4" ry="2.5" fill="url(#heartHi)" />
  </svg>
);

export const Coin3D: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={`drop-shadow-xs ${className}`}>
    <defs>
      <radialGradient id="goldCoinGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="40%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </radialGradient>
      <linearGradient id="coinRim" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
    </defs>
    <circle cx="18" cy="19" r="15" fill="#78350F" opacity="0.4" />
    <circle cx="18" cy="18" r="15" fill="url(#goldCoinGrad)" stroke="url(#coinRim)" strokeWidth="1.5" />
    <circle cx="18" cy="18" r="11.5" fill="none" stroke="#FEF08A" strokeWidth="1.2" strokeDasharray="3 2" />
    {/* Smiling Tooth Stamp on Coin */}
    <path d="M15 13C15 11.5 16.5 10.5 18 11.5C19.5 10.5 21 11.5 21 13C21 15 22 17 20.5 20C19.5 22 19 24 18.5 24C18 24 18 20 18 20C18 20 18 24 17.5 24C17 24 16.5 22 15.5 20C14 17 15 15 15 13Z" fill="#FFFBEB" />
  </svg>
);

export const Star3D: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={`drop-shadow-xs ${className}`}>
    <defs>
      <radialGradient id="starGrad" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FEF9C3" />
        <stop offset="35%" stopColor="#FACC15" />
        <stop offset="85%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#A16207" />
      </radialGradient>
    </defs>
    <path d="M18 2L22.5 12L33.5 13L25 21L27.5 32L18 26.5L8.5 32L11 21L2.5 13L13.5 12L18 2Z" fill="url(#starGrad)" stroke="#854D0E" strokeWidth="1.2" strokeLinejoin="round" />
    <circle cx="15" cy="11" r="2.5" fill="#FFFFFF" opacity="0.7" />
  </svg>
);

export const Gem3D: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={`drop-shadow-xs ${className}`}>
    <defs>
      <linearGradient id="gemTop" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#BAE6FD" />
        <stop offset="100%" stopColor="#38BDF8" />
      </linearGradient>
      <linearGradient id="gemBottom" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
    </defs>
    <polygon points="10,6 26,6 33,14 18,32 3,14" fill="url(#gemBottom)" stroke="#075985" strokeWidth="1.2" />
    <polygon points="10,6 26,6 33,14 3,14" fill="url(#gemTop)" />
    <polygon points="14,6 22,6 25,14 11,14" fill="#E0F2FE" opacity="0.8" />
    <polygon points="18,32 11,14 25,14" fill="#38BDF8" opacity="0.6" />
  </svg>
);

export const Trophy3D: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={`drop-shadow-sm ${className}`}>
    <defs>
      <radialGradient id="trophyGold" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="40%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </radialGradient>
    </defs>
    {/* Base Stand */}
    <rect x="14" y="38" width="20" height="6" rx="2" fill="#78350F" stroke="#451A03" strokeWidth="1" />
    <path d="M20 32H28L26 38H22L20 32Z" fill="url(#trophyGold)" stroke="#B45309" strokeWidth="1" />
    {/* Handles */}
    <path d="M12 12C7 12 7 24 14 24" fill="none" stroke="url(#trophyGold)" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M36 12C41 12 41 24 34 24" fill="none" stroke="url(#trophyGold)" strokeWidth="3.5" strokeLinecap="round" />
    {/* Cup */}
    <path d="M12 8H36V20C36 26.5 30.5 32 24 32C17.5 32 12 26.5 12 20V8Z" fill="url(#trophyGold)" stroke="#92400E" strokeWidth="1.5" />
    {/* Star on Cup */}
    <path d="M24 14L25.5 18.5L30 19L26.5 22L27.5 26.5L24 24L20.5 26.5L21.5 22L18 19L22.5 18.5L24 14Z" fill="#FFFBEB" />
  </svg>
);

export const Gift3D: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={`drop-shadow-sm ${className}`}>
    <defs>
      <linearGradient id="boxGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="ribbonGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F43F5E" />
        <stop offset="100%" stopColor="#BE123C" />
      </linearGradient>
    </defs>
    {/* Box Body */}
    <rect x="8" y="18" width="32" height="24" rx="4" fill="url(#boxGrad)" stroke="#B45309" strokeWidth="1.5" />
    {/* Box Lid */}
    <rect x="6" y="14" width="36" height="8" rx="2.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
    {/* Ribbons */}
    <rect x="21" y="14" width="6" height="28" fill="url(#ribbonGrad)" />
    <path d="M24 14C20 9 12 9 16 14C20 19 24 14 24 14Z" fill="url(#ribbonGrad)" stroke="#9F1239" strokeWidth="1" />
    <path d="M24 14C28 9 36 9 32 14C28 19 24 14 24 14Z" fill="url(#ribbonGrad)" stroke="#9F1239" strokeWidth="1" />
  </svg>
);

// ==========================================
// 3D DENTAL HEALTH & MEDICAL ICONS (GAMBAR 2)
// ==========================================

export const ToothHealthy3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-sm ${className}`}>
    <defs>
      <radialGradient id="toothWhite" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="70%" stopColor="#F0FDFA" />
        <stop offset="100%" stopColor="#CCFBF1" />
      </radialGradient>
    </defs>
    <path d="M20 16C18 10 26 8 32 12C38 8 46 10 44 16C45 25 48 35 44 48C41 57 37 60 34 56C32 53 32 42 32 42C32 42 32 53 30 56C27 60 23 57 20 48C16 35 19 25 20 16Z" fill="url(#toothWhite)" stroke="#0D9488" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Sparkle highlights */}
    <circle cx="26" cy="20" r="3" fill="#FFFFFF" />
    <circle cx="39" cy="17" r="1.5" fill="#FFFFFF" />
    {/* Happy Face */}
    <circle cx="26" cy="28" r="2.2" fill="#134E4A" />
    <circle cx="38" cy="28" r="2.2" fill="#134E4A" />
    <path d="M28 34C30 37 34 37 36 34" stroke="#134E4A" strokeWidth="2.5" strokeLinecap="round" />
    {/* Cheeks */}
    <circle cx="22" cy="32" r="3" fill="#FDA4AF" opacity="0.6" />
    <circle cx="42" cy="32" r="3" fill="#FDA4AF" opacity="0.6" />
    {/* Little Star Sparkle */}
    <path d="M48 10L49 13L52 14L49 15L48 18L47 15L44 14L47 13L48 10Z" fill="#FACC15" />
  </svg>
);

export const ToothCavity3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-sm ${className}`}>
    <defs>
      <radialGradient id="toothCavityGrad" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="70%" stopColor="#F1F5F9" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </radialGradient>
      <radialGradient id="cavityHole" cx="45%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#78350F" />
        <stop offset="70%" stopColor="#451A03" />
        <stop offset="100%" stopColor="#1C1917" />
      </radialGradient>
    </defs>
    <path d="M20 16C18 10 26 8 32 12C38 8 46 10 44 16C45 25 48 35 44 48C41 57 37 60 34 56C32 53 32 42 32 42C32 42 32 53 30 56C27 60 23 57 20 48C16 35 19 25 20 16Z" fill="url(#toothCavityGrad)" stroke="#475569" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Dark Cavity Spot */}
    <ellipse cx="26" cy="18" rx="8" ry="6" fill="url(#cavityHole)" stroke="#292524" strokeWidth="1" />
    {/* Sad / Hurt Face */}
    <circle cx="26" cy="30" r="2.2" fill="#334155" />
    <circle cx="38" cy="30" r="2.2" fill="#334155" />
    <path d="M28 38C30 35 34 35 36 38" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
    {/* Bandage or sweat drop */}
    <path d="M43 24C44 23 46 25 45 27C44 29 42 28 43 24Z" fill="#38BDF8" />
  </svg>
);

export const ToothSensitive3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-sm ${className}`}>
    <defs>
      <radialGradient id="toothCold" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="70%" stopColor="#E0F2FE" />
        <stop offset="100%" stopColor="#BAE6FD" />
      </radialGradient>
    </defs>
    <path d="M20 16C18 10 26 8 32 12C38 8 46 10 44 16C45 25 48 35 44 48C41 57 37 60 34 56C32 53 32 42 32 42C32 42 32 53 30 56C27 60 23 57 20 48C16 35 19 25 20 16Z" fill="url(#toothCold)" stroke="#0284C7" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Snowflake badge on corner */}
    <g transform="translate(42, 6) scale(0.6)">
      <circle cx="16" cy="16" r="14" fill="#0284C7" />
      <path d="M16 6V26M6 16H26M9 9L23 23M9 23L23 9" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    </g>
    {/* Cold Shivering Mouth */}
    <circle cx="26" cy="28" r="2.2" fill="#0369A1" />
    <circle cx="38" cy="28" r="2.2" fill="#0369A1" />
    <path d="M27 36L29 34L31 36L33 34L35 36" stroke="#0369A1" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Bacteria3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-sm ${className}`}>
    <defs>
      <radialGradient id="germGreen" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#BEF264" />
        <stop offset="45%" stopColor="#65A30D" />
        <stop offset="100%" stopColor="#3F6212" />
      </radialGradient>
    </defs>
    {/* Spiky germ body */}
    <path d="M32 14C35 10 39 12 39 16C43 14 47 18 45 22C50 22 51 27 48 30C52 33 49 38 46 39C49 43 45 48 41 47C40 52 35 52 33 49C29 53 25 50 24 46C20 48 17 44 19 40C14 39 14 33 18 31C14 27 17 23 21 23C19 19 23 15 27 17C28 13 32 12 32 14Z" fill="url(#germGreen)" stroke="#365314" strokeWidth="2" strokeLinejoin="round" />
    {/* Monster Eyes */}
    <circle cx="27" cy="29" r="4.5" fill="#FFFFFF" />
    <circle cx="28" cy="29" r="2.5" fill="#1C1917" />
    <circle cx="39" cy="30" r="4" fill="#FFFFFF" />
    <circle cx="39" cy="30" r="2.2" fill="#1C1917" />
    {/* Evil grin with fang */}
    <path d="M26 38C29 42 37 42 40 38" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" />
    <polygon points="30,39 33,39 31.5,43" fill="#FFFFFF" />
  </svg>
);

export const Streptococcus3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-sm ${className}`}>
    <defs>
      <radialGradient id="chainPurple" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#D8B4FE" />
        <stop offset="45%" stopColor="#9333EA" />
        <stop offset="100%" stopColor="#581C87" />
      </radialGradient>
    </defs>
    {/* Chained bacterial cocci */}
    <circle cx="16" cy="42" r="8" fill="url(#chainPurple)" stroke="#3B0764" strokeWidth="1.5" />
    <circle cx="26" cy="34" r="8.5" fill="url(#chainPurple)" stroke="#3B0764" strokeWidth="1.5" />
    <circle cx="36" cy="26" r="9" fill="url(#chainPurple)" stroke="#3B0764" strokeWidth="1.5" />
    <circle cx="48" cy="18" r="8.5" fill="url(#chainPurple)" stroke="#3B0764" strokeWidth="1.5" />
    {/* Cute mischievous eyes on main coccus */}
    <circle cx="34" cy="24" r="1.8" fill="#FFFFFF" />
    <circle cx="39" cy="25" r="1.8" fill="#FFFFFF" />
  </svg>
);

export const Plaque3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-sm ${className}`}>
    <defs>
      <radialGradient id="plaqueYellow" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#854D0E" />
      </radialGradient>
    </defs>
    {/* Plaque blob with bumpy edges */}
    <path d="M32 14C42 12 50 18 52 28C54 38 48 46 38 49C28 52 18 48 14 38C10 28 18 16 32 14Z" fill="url(#plaqueYellow)" stroke="#713F12" strokeWidth="2" />
    <circle cx="25" cy="28" r="3" fill="#1C1917" />
    <circle cx="38" cy="30" r="3" fill="#1C1917" />
    <path d="M28 37C32 40 36 39 38 37" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const Toothbrush3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-sm ${className}`}>
    <defs>
      <linearGradient id="brushHandle" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="50%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
    </defs>
    {/* Handle */}
    <path d="M12 52L36 28C38 26 42 26 44 28L46 30C48 32 48 36 46 38L22 62C18 64 12 58 12 52Z" fill="url(#brushHandle)" stroke="#075985" strokeWidth="1.5" />
    {/* Head */}
    <path d="M36 28L46 18C48 16 52 16 54 18L56 20C58 22 58 26 56 28L46 38" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
    {/* Bristles */}
    <path d="M44 14L54 24M41 17L51 27M47 11L57 21" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const Toothpaste3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-sm ${className}`}>
    <defs>
      <linearGradient id="pasteTube" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#E0F2FE" />
        <stop offset="100%" stopColor="#38BDF8" />
      </linearGradient>
    </defs>
    {/* Cap */}
    <rect x="42" y="14" width="8" height="10" rx="2" fill="#0284C7" stroke="#0369A1" strokeWidth="1" transform="rotate(45 42 14)" />
    {/* Tube */}
    <path d="M42 22L20 44C18 46 14 46 12 44L8 40C6 38 6 34 8 32L30 10C34 6 42 16 42 22Z" fill="url(#pasteTube)" stroke="#0284C7" strokeWidth="2" />
    {/* Little Tooth Graphic on Tube */}
    <circle cx="24" cy="28" r="3.5" fill="#38BDF8" />
  </svg>
);

export const Mouthwash3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-sm ${className}`}>
    <defs>
      <linearGradient id="washLiquid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5EEAD4" />
        <stop offset="50%" stopColor="#14B8A6" />
        <stop offset="100%" stopColor="#0F766E" />
      </linearGradient>
    </defs>
    {/* Cap */}
    <rect x="25" y="8" width="14" height="8" rx="2" fill="#0D9488" stroke="#115E59" strokeWidth="1.5" />
    {/* Bottle Neck */}
    <rect x="28" y="16" width="8" height="6" fill="#CCFBF1" />
    {/* Bottle Body */}
    <rect x="20" y="22" width="24" height="34" rx="6" fill="url(#washLiquid)" stroke="#0F766E" strokeWidth="2" />
    {/* Label */}
    <rect x="24" y="30" width="16" height="16" rx="3" fill="#FFFFFF" />
    <path d="M29 36C29 34 30.5 33 32 34C33.5 33 35 34 35 36C35 38 36 39 35 41C34 43 33 44 32.5 44C32 44 32 41 32 41C32 41 32 44 31.5 44C31 44 30 43 29 41C28 39 29 38 29 36Z" fill="#0D9488" />
  </svg>
);

export const DentalFloss3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-sm ${className}`}>
    <defs>
      <radialGradient id="flossGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#7DD3FC" />
        <stop offset="45%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#075985" />
      </radialGradient>
    </defs>
    {/* Floss Container */}
    <rect x="16" y="18" width="32" height="34" rx="10" fill="url(#flossGrad)" stroke="#0369A1" strokeWidth="2" />
    {/* Window with floss spool */}
    <circle cx="32" cy="35" r="9" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="2" />
    {/* Thread coming out */}
    <path d="M32 18V12C32 10 38 10 42 12" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const Shield3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-sm ${className}`}>
    <defs>
      <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="50%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
    </defs>
    <path d="M32 10L48 16V30C48 42 32 52 32 52C32 52 16 42 16 30V16L32 10Z" fill="url(#shieldGrad)" stroke="#082F49" strokeWidth="2" />
    {/* White emblem */}
    <path d="M32 16L42 20V29C42 38 32 45 32 45C32 45 22 38 22 29V20L32 16Z" fill="#FFFFFF" opacity="0.3" />
    <path d="M32 22C30 20 28 22 28 25C28 28 32 35 32 35C32 35 36 28 36 25C36 22 34 20 32 22Z" fill="#FFFFFF" />
  </svg>
);

export const Apple3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-sm ${className}`}>
    <defs>
      <radialGradient id="appleGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FCA5A5" />
        <stop offset="35%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#991B1B" />
      </radialGradient>
    </defs>
    {/* Stem & Leaf */}
    <path d="M32 16C32 10 36 8 36 8" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
    <path d="M34 10C38 8 44 11 44 14C40 16 35 13 34 10Z" fill="#22C55E" />
    {/* Apple Body */}
    <path d="M32 20C26 15 16 18 16 30C16 46 28 54 32 54C36 54 48 46 48 30C48 18 38 15 32 20Z" fill="url(#appleGrad)" stroke="#7F1D1D" strokeWidth="1.5" />
    <ellipse cx="24" cy="27" rx="4" ry="7" fill="#FFFFFF" opacity="0.4" transform="rotate(-20 24 27)" />
  </svg>
);

export const Candy3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-sm ${className}`}>
    <defs>
      <radialGradient id="candyGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="45%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#BE185D" />
      </radialGradient>
    </defs>
    {/* Stick */}
    <rect x="30" y="36" width="4" height="22" rx="2" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
    {/* Spiral Candy */}
    <circle cx="32" cy="24" r="16" fill="url(#candyGrad)" stroke="#9D174D" strokeWidth="1.5" />
    <path d="M32 12C38 12 44 18 44 24C44 31 38 36 32 36C26 36 20 31 20 24C20 18 26 12 32 12Z" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
  </svg>
);

export const Milk3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-sm ${className}`}>
    {/* Milk Carton */}
    <path d="M22 14L28 8H36L42 14H22Z" fill="#93C5FD" stroke="#1E40AF" strokeWidth="1.5" />
    <rect x="20" y="14" width="24" height="42" rx="3" fill="#EFF6FF" stroke="#1E40AF" strokeWidth="2" />
    <rect x="20" y="26" width="24" height="14" fill="#3B82F6" />
    <text x="32" y="36" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">MILK</text>
  </svg>
);

export const WaterGlass3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-sm ${className}`}>
    <defs>
      <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#BAE6FD" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>
    <path d="M18 14L22 52C22 55 26 56 32 56C38 56 42 55 42 52L46 14H18Z" fill="url(#waterGrad)" opacity="0.8" stroke="#0284C7" strokeWidth="2" />
    <ellipse cx="32" cy="14" rx="14" ry="4" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
    <path d="M25 24C28 23 35 25 39 24" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
  </svg>
);

// Map / Quest Icon (Gambar 4 - J)
export const AdventureMap3D: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={`drop-shadow-sm ${className}`}>
    <path d="M6 10L18 6L30 10L42 6V38L30 42L18 38L6 42V10Z" fill="#FEF08A" stroke="#854D0E" strokeWidth="1.5" />
    <path d="M18 6V38" stroke="#CA8A04" strokeWidth="1.5" strokeDasharray="2 2" />
    <path d="M30 10V42" stroke="#CA8A04" strokeWidth="1.5" strokeDasharray="2 2" />
    {/* Map Pin */}
    <circle cx="28" cy="20" r="4" fill="#EF4444" stroke="#7F1D1D" strokeWidth="1" />
  </svg>
);

// Gambar 2 Dental Icons:
export const Gingivitis3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-sm ${className}`}>
    <defs>
      <linearGradient id="gumRed" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FB7185" />
        <stop offset="50%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#9F1239" />
      </linearGradient>
    </defs>
    {/* Tooth top */}
    <path d="M20 18C18 12 26 10 32 14C38 10 46 12 44 18C45 25 46 32 44 40C41 40 23 40 20 40C18 32 19 25 20 18Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
    {/* Swollen Red Gum */}
    <path d="M14 36C18 32 26 34 32 32C38 34 46 32 50 36C52 42 50 50 46 54C40 58 24 58 18 54C14 50 12 42 14 36Z" fill="url(#gumRed)" stroke="#881337" strokeWidth="2" />
    {/* Blood Drop */}
    <path d="M42 42C42 40 46 34 46 34C46 34 50 40 50 42C50 44.5 48.2 46 46 46C43.8 46 42 44.5 42 42Z" fill="#BE123C" stroke="#881337" strokeWidth="1" />
    {/* Hurt Face on Tooth */}
    <circle cx="26" cy="22" r="2" fill="#475569" />
    <circle cx="38" cy="22" r="2" fill="#475569" />
    <path d="M28 28C30 26 34 26 36 28" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Sariawan3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-sm ${className}`}>
    <defs>
      <radialGradient id="mouthLip" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#FDA4AF" />
        <stop offset="100%" stopColor="#F43F5E" />
      </radialGradient>
      <radialGradient id="ulcerGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#DC2626" />
      </radialGradient>
    </defs>
    {/* Open Lips */}
    <path d="M12 32C12 24 22 18 32 18C42 18 52 24 52 32C52 42 42 48 32 48C22 48 12 42 12 32Z" fill="url(#mouthLip)" stroke="#BE123C" strokeWidth="2.5" />
    {/* Dark Mouth Cavity */}
    <ellipse cx="32" cy="33" rx="16" ry="10" fill="#881337" />
    {/* Teeth glimpse */}
    <path d="M22 26C24 28 40 28 42 26" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
    {/* Ulcer Spot */}
    <ellipse cx="32" cy="36" rx="6" ry="4.5" fill="url(#ulcerGrad)" stroke="#B91C1C" strokeWidth="1.5" />
    {/* Pain spark */}
    <path d="M46 16L48 20M43 21L47 23" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const Halitosis3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-sm ${className}`}>
    <defs>
      <linearGradient id="badOdor" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#84CC16" />
        <stop offset="100%" stopColor="#4D7C0F" />
      </linearGradient>
    </defs>
    {/* Tooth Body */}
    <path d="M20 22C18 16 26 14 32 18C38 14 46 16 44 22C45 31 48 41 44 54C41 62 37 63 34 60C32 57 32 46 32 46C32 46 32 57 30 60C27 63 23 62 20 54C16 41 19 31 20 22Z" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" />
    {/* Dizzy Mouth */}
    <circle cx="26" cy="32" r="2" fill="#475569" />
    <circle cx="38" cy="32" r="2" fill="#475569" />
    <ellipse cx="32" cy="40" rx="4" ry="5" fill="#64748B" />
    {/* Stinky Gas Waves */}
    <path d="M42 16C46 12 52 14 54 8C55 5 53 2 50 4" stroke="url(#badOdor)" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M48 24C53 20 58 24 60 18" stroke="url(#badOdor)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M38 10C40 6 44 8 46 2" stroke="url(#badOdor)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

export const AcidErosion3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-sm ${className}`}>
    <defs>
      <linearGradient id="acidGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#EAB308" />
      </linearGradient>
    </defs>
    {/* Worn down eroded tooth */}
    <path d="M22 22C24 18 28 19 32 18C36 19 40 18 42 22C43 31 46 41 42 52C39 59 36 60 33 57C32 54 32 46 32 46C32 46 32 54 31 57C28 60 25 59 22 52C18 41 21 31 22 22Z" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="2" strokeDasharray="6 2" />
    {/* Acid drops eating enamel */}
    <path d="M24 16C24 12 28 8 28 8C28 8 32 12 32 16C32 18 30 20 28 20C26 20 24 18 24 16Z" fill="url(#acidGrad)" stroke="#A16207" strokeWidth="1" />
    {/* Hurt Face */}
    <path d="M26 32L29 34M38 32L35 34" stroke="#854D0E" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="32" cy="40" r="3" fill="#854D0E" />
  </svg>
);

export const DentalMirror3D: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-sm ${className}`}>
    <defs>
      <linearGradient id="silverHandle" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F1F5F9" />
        <stop offset="50%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
      <radialGradient id="mirrorGlass" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#E0F2FE" />
        <stop offset="100%" stopColor="#7DD3FC" />
      </radialGradient>
    </defs>
    {/* Silver Stem */}
    <path d="M12 56L34 34" stroke="url(#silverHandle)" strokeWidth="5" strokeLinecap="round" />
    {/* Mirror Rim & Glass */}
    <circle cx="42" cy="22" r="16" fill="url(#silverHandle)" stroke="#334155" strokeWidth="2" />
    <circle cx="42" cy="22" r="12" fill="url(#mirrorGlass)" stroke="#0284C7" strokeWidth="1.5" />
    {/* Mirror reflection shine */}
    <ellipse cx="38" cy="18" rx="6" ry="3" fill="#FFFFFF" opacity="0.8" transform="rotate(-30 38 18)" />
  </svg>
);
