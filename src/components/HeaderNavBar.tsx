import React from 'react';
import { ChildProfile, ParentSettings } from '../types';
import { soundEffects } from '../utils/audio';
import { MouthToothMascot } from './MouthToothMascot';
import { Heart3D, Coin3D, Gem3D, Star3D, SettingsButton3D } from './GameIcons';

interface HeaderProps {
  profile: ChildProfile;
  settings: ParentSettings;
  isOnline: boolean;
  onOpenParent: () => void;
  onOpenWardrobe: () => void;
  onOpenLeaderboard: () => void;
  onToggleSpeech: () => void;
  onNavigateHome: () => void;
  onSelectMode: (mode: string) => void;
  currentMode: string;
}

export const HeaderNavBar: React.FC<HeaderProps> = ({
  profile,
  settings,
  isOnline,
  onOpenParent,
  onOpenWardrobe,
  onOpenLeaderboard,
  onToggleSpeech,
  onNavigateHome,
  onSelectMode,
  currentMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAFDF9]/95 backdrop-blur-md border-b-2 border-[#C4DCAC] px-3 py-2 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Avatar & Game Brand */}
        <div className="flex items-center gap-2.5">
          <div
            onClick={() => {
              soundEffects.tap();
              onOpenWardrobe();
            }}
            className="relative cursor-pointer group flex items-center justify-center"
            title="Klik untuk buka Lemari Kostum Avatar!"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#21736A] via-[#29827D] to-[#6ED5B6] p-0.5 shadow-md shadow-[#21736A]/20 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
              <MouthToothMascot
                baseCharacter={profile.baseCharacter || 'chibi'}
                skinMaterial={profile.skinMaterial}
                expression={profile.expression}
                outfit={profile.selectedOutfit}
                heldItem={profile.selectedHand}
                hat={profile.selectedHat}
                accessory={profile.selectedAccessory}
                profession={profile.selectedProfession}
                extra={profile.selectedExtra}
                size="xs"
              />
            </div>
            {/* Level / Plus Badge */}
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#D97724] border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white font-black shadow-xs">
              +
            </span>
          </div>

          <div
            className="cursor-pointer select-none"
            onClick={() => {
              soundEffects.tap();
              onNavigateHome();
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg sm:text-xl tracking-tight bg-gradient-to-r from-[#143D37] via-[#21736A] to-[#29827D] bg-clip-text text-transparent font-['Fredoka']">
                Dentika
              </span>
              <span className="hidden md:inline-block text-[10px] bg-[#E2F8F1] text-[#143D37] font-black px-2 py-0.5 rounded-full border border-[#6ED5B6]">
                RPG Gigi Sehat
              </span>
            </div>
            <div className="text-[10px] font-bold text-[#21736A] hidden sm:block">
              Petualangan Pahlawan Senyum
            </div>
          </div>
        </div>

        {/* Center: Game Navigation Quick Tabs (Gambar 1 style) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#EFF6E9] p-1 rounded-2xl border border-[#C4DCAC]">
          {[
            { id: 'home', label: 'Beranda', icon: '🏠' },
            { id: 'clinic', label: 'Klinik Gigi', icon: '🦷' },
            { id: 'quiz', label: 'Kuis Bintang', icon: '❓' },
            { id: 'germ_game', label: 'Basmi Kuman', icon: '👾' },
            { id: 'brushing', label: 'Sikat Gigi', icon: '🪥' },
            { id: 'forum', label: 'Tanya AI & Komentar', icon: '💬' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                soundEffects.tap();
                onSelectMode(tab.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                currentMode === tab.id
                  ? 'bg-gradient-to-r from-[#21736A] to-[#29827D] text-white shadow-xs'
                  : 'text-[#143D37] hover:bg-[#FAFDF9]'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Right: Live Game Status HUD & Settings (Gambar 4 - D) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Hearts / Lives */}
          <div
            className="flex items-center gap-1 bg-white/90 border border-[#F43F5E]/30 px-2 py-1 rounded-2xl shadow-xs"
            title="Nyawa Semangat"
          >
            <Heart3D size={20} />
            <span className="font-black text-[#E11D48] text-xs">
              {profile.lives || 5}
            </span>
          </div>

          {/* Tooth Coins */}
          <div
            onClick={() => {
              soundEffects.coin();
              onOpenWardrobe();
            }}
            className="flex items-center gap-1 bg-[#FAF2E8] hover:bg-[#FBE4D6] border border-[#F5B842] px-2 sm:px-2.5 py-1 rounded-2xl cursor-pointer shadow-xs transition-transform active:scale-95"
            title="Koin Gigi - Klik untuk belanja avatar!"
          >
            <Coin3D size={20} />
            <span className="font-black text-[#8F4619] text-xs sm:text-sm">
              {profile.coins}
            </span>
          </div>

          {/* Diamonds Gems */}
          <div
            className="hidden sm:flex items-center gap-1 bg-[#E0F2FE] border border-[#38BDF8] px-2 py-1 rounded-2xl shadow-xs"
            title="Permata Kristal"
          >
            <Gem3D size={20} />
            <span className="font-black text-[#0369A1] text-xs">
              {profile.gems || 10}
            </span>
          </div>

          {/* Stars */}
          <div
            className="flex items-center gap-1 bg-[#FFFBE8] border border-[#FACC15] px-2 py-1 rounded-2xl shadow-xs"
            title="Bintang Senyum"
          >
            <Star3D size={20} />
            <span className="font-black text-[#854D0E] text-xs">
              {profile.stars}
            </span>
          </div>

          {/* Speech Audio Toggle */}
          <button
            onClick={() => {
              soundEffects.tap();
              onToggleSpeech();
            }}
            className={`p-1.5 rounded-2xl font-bold text-xs flex items-center justify-center border transition-all cursor-pointer ${
              settings.speechAudioEnabled
                ? 'bg-[#E2F8F1] text-[#143D37] border-[#6ED5B6] shadow-xs'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
            title={settings.speechAudioEnabled ? 'Suara Narasi Aktif' : 'Suara Narasi Bisu'}
          >
            <span className="text-sm">{settings.speechAudioEnabled ? '🔊' : '🔇'}</span>
          </button>

          {/* Forum Komentar Button */}
          <button
            onClick={() => {
              soundEffects.tap();
              onSelectMode('forum');
            }}
            className={`p-1.5 rounded-2xl border text-sm cursor-pointer transition-transform active:scale-95 ${
              currentMode === 'forum'
                ? 'bg-[#21736A] text-white border-[#21736A] shadow-xs'
                : 'bg-[#EFF6E9] hover:bg-[#E2F8F1] border-[#C4DCAC] text-[#143D37]'
            }`}
            title="Kolom Komentar & Tanya AI"
          >
            💬
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={() => {
              soundEffects.tap();
              onOpenLeaderboard();
            }}
            className="p-1.5 rounded-2xl bg-[#EFF6E9] hover:bg-[#E2F8F1] border border-[#C4DCAC] text-sm cursor-pointer"
            title="Papan Peringkat Bintang"
          >
            🏆
          </button>

          {/* Parent Mode Lock */}
          <button
            onClick={() => {
              soundEffects.tap();
              onOpenParent();
            }}
            className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title="Pojok & Kendali Orang Tua (Perlu PIN)"
          >
            <SettingsButton3D size={36} />
          </button>
        </div>
      </div>
    </header>
  );
};
