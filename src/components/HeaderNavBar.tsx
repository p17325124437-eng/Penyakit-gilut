import React from 'react';
import { ChildProfile, ParentSettings } from '../types';
import { soundEffects } from '../utils/audio';

interface HeaderProps {
  profile: ChildProfile;
  settings: ParentSettings;
  isOnline: boolean;
  onOpenParent: () => void;
  onOpenWardrobe: () => void;
  onToggleSpeech: () => void;
  onNavigateHome: () => void;
  currentMode: string;
}

export const HeaderNavBar: React.FC<HeaderProps> = ({
  profile,
  settings,
  isOnline,
  onOpenParent,
  onOpenWardrobe,
  onToggleSpeech,
  onNavigateHome,
  currentMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-2 border-emerald-100 px-3 py-2.5 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Brand / Home link */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { soundEffects.tap(); onNavigateHome(); }}>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-400 p-0.5 shadow-md shadow-emerald-200 flex items-center justify-center text-2xl">
            🦷
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg md:text-xl tracking-tight bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent font-['Fredoka']">
                Dentika
              </span>
              <span className="hidden sm:inline-block text-[11px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full">
                Gigi Sehat
              </span>
            </div>
            <div className="text-[11px] font-semibold text-slate-500 hidden sm:block">
              Petualangan Senyum Juara
            </div>
          </div>
        </div>

        {/* Child Profile & Gamification Stats */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Online / Offline badge */}
          <div
            title={isOnline ? 'Terhubung ke server (Online)' : 'Mode Luring Aktif (Data tersimpan di perangkat)'}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold transition-colors ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="hidden md:inline">{isOnline ? 'Online' : 'Mode Luring'}</span>
          </div>

          {/* Tooth Coins */}
          <div
            onClick={() => { soundEffects.coin(); onOpenWardrobe(); }}
            className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-2xl cursor-pointer shadow-xs transition-transform active:scale-95"
            title="Koin Gigi Sehat - Klik untuk belanja kostum!"
          >
            <span className="text-base sm:text-lg animate-bounce-gentle">🪙</span>
            <span className="font-black text-amber-700 text-xs sm:text-sm">{profile.coins}</span>
          </div>

          {/* Stars */}
          <div
            className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 px-2.5 py-1 rounded-2xl shadow-xs"
            title="Bintang Senyum"
          >
            <span className="text-base sm:text-lg">⭐</span>
            <span className="font-black text-yellow-700 text-xs sm:text-sm">{profile.stars}</span>
          </div>

          {/* Daily Streak */}
          <div
            className="hidden sm:flex items-center gap-1 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-2xl shadow-xs"
            title="Hari Belajar Berturut-turut"
          >
            <span className="text-base">🔥</span>
            <span className="font-black text-rose-600 text-xs">{profile.streakDays} Hari</span>
          </div>

          {/* Speech Voiceover Toggle */}
          <button
            onClick={() => { soundEffects.tap(); onToggleSpeech(); }}
            className={`p-1.5 sm:px-2 sm:py-1 rounded-xl font-bold text-xs flex items-center gap-1 border transition-all ${
              settings.speechAudioEnabled
                ? 'bg-cyan-50 text-cyan-700 border-cyan-300 shadow-xs'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
            title={settings.speechAudioEnabled ? 'Suara Narator Aktif' : 'Suara Narator Nonaktif'}
          >
            <span>{settings.speechAudioEnabled ? '🔊' : '🔇'}</span>
            <span className="hidden lg:inline">{settings.speechAudioEnabled ? 'Suara Aktif' : 'Bisu'}</span>
          </button>

          {/* Wardrobe button */}
          <button
            onClick={() => { soundEffects.tap(); onOpenWardrobe(); }}
            className="bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-300 p-1.5 sm:px-2.5 sm:py-1 rounded-xl font-bold text-xs flex items-center gap-1 transition-all active:scale-95"
            title="Buka Lemari Aksesori Gigi"
          >
            <span>👗</span>
            <span className="hidden md:inline">Kostum</span>
          </button>

          {/* Parent Mode Lock */}
          <button
            onClick={() => { soundEffects.tap(); onOpenParent(); }}
            className="bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            title="Buka Dasbor & Kendali Orang Tua (Perlu PIN)"
          >
            <span>🔒</span>
            <span className="hidden sm:inline">Orang Tua</span>
          </button>
        </div>
      </div>
    </header>
  );
};
