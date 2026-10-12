import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ChildProfile,
  RewardItem,
  ToothExpression,
  BackgroundScene,
  ToothSkinMaterial,
  AvatarBaseCharacter,
} from '../types';
import { REWARD_ITEMS } from '../data/rewardsData';
import { MouthToothMascot } from './MouthToothMascot';
import { soundEffects } from '../utils/audio';
import { Coin3D, Gem3D, Star3D, CheckButton3D, BackButton3D } from './GameIcons';

interface WardrobeProps {
  profile: ChildProfile;
  onUpdateEquipped: (updatedProfile: Partial<ChildProfile>) => void;
  onBack: () => void;
}

export const RewardWardrobe: React.FC<WardrobeProps> = ({
  profile,
  onUpdateEquipped,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<
    'skin' | 'outfit' | 'hand' | 'hat' | 'accessory' | 'profession' | 'extra'
  >('skin');

  // Local staging state so kids can experiment and preview live
  const [currentBaseCharacter, setCurrentBaseCharacter] = useState<AvatarBaseCharacter>(
    profile.baseCharacter || 'chibi'
  );
  const [currentSkin, setCurrentSkin] = useState<ToothSkinMaterial>(profile.skinMaterial || 'white');
  const [currentExpression, setCurrentExpression] = useState<ToothExpression>(profile.expression || 'senyum');
  const [currentOutfit, setCurrentOutfit] = useState<string | undefined>(profile.selectedOutfit);
  const [currentHand, setCurrentHand] = useState<string | undefined>(profile.selectedHand);
  const [currentHat, setCurrentHat] = useState<string | undefined>(profile.selectedHat);
  const [currentAccessory, setCurrentAccessory] = useState<string | undefined>(profile.selectedAccessory);
  const [currentProfession, setCurrentProfession] = useState<string | undefined>(profile.selectedProfession);
  const [currentBackground, setCurrentBackground] = useState<BackgroundScene>(profile.selectedBackground || 'kamar');
  const [currentExtra, setCurrentExtra] = useState<string | undefined>(profile.selectedExtra);

  const filteredItems = REWARD_ITEMS.filter(item => item.type === activeTab);

  // Expressions array matching Gambar 3
  const expressionsList: { id: ToothExpression; label: string; icon: string }[] = [
    { id: 'senyum', label: 'Senyum', icon: '😁' },
    { id: 'tertawa', label: 'Tertawa', icon: '😄' },
    { id: 'wink', label: 'Wink', icon: '😉' },
    { id: 'bahagia', label: 'Bahagia', icon: '🥰' },
    { id: 'semangat', label: 'Semangat', icon: '🤩' },
    { id: 'kaget', label: 'Kaget', icon: '😮' },
    { id: 'sedih', label: 'Sedih', icon: '🥺' },
    { id: 'marah', label: 'Marah', icon: '😤' },
    { id: 'malu', label: 'Malu', icon: '😳' },
    { id: 'ngantuk', label: 'Ngantuk', icon: '😴' },
    { id: 'sayang', label: 'Sayang', icon: '😍' },
    { id: 'keren', label: 'Keren', icon: '😎' },
  ];

  // Backgrounds array matching Gambar 3
  const backgroundsList: { id: BackgroundScene; label: string; icon: string }[] = [
    { id: 'kamar', label: 'Kamar', icon: '🛏️' },
    { id: 'klinik', label: 'Klinik Gigi', icon: '🏥' },
    { id: 'lab', label: 'Laboratorium', icon: '🧪' },
    { id: 'angkasa', label: 'Luar Angkasa', icon: '🌌' },
    { id: 'pantai', label: 'Pantai', icon: '🏖️' },
    { id: 'kastil', label: 'Kastil Emas', icon: '🏰' },
  ];

  // Calculate Tier matching Gambar 3 (Tingkatan Gaya 1-5 Bintang)
  const calculateTier = (): { tier: number; name: string; stars: string } => {
    if (currentSkin === 'diamond' || currentHat === 'hat_crown') {
      return { tier: 5, name: 'Mewah', stars: '⭐⭐⭐⭐⭐' };
    }
    if (currentSkin === 'gold' || currentSkin === 'black' || currentOutfit === 'outfit_tuxedo') {
      return { tier: 4, name: 'Kaya', stars: '⭐⭐⭐⭐' };
    }
    if (currentProfession || currentHat === 'hat_doctor' || currentHat === 'hat_grad') {
      return { tier: 3, name: 'Berkelas', stars: '⭐⭐⭐' };
    }
    if (currentOutfit || currentHat) {
      return { tier: 2, name: 'Keren', stars: '⭐⭐' };
    }
    return { tier: 1, name: 'Biasa', stars: '⭐' };
  };

  const currentTierInfo = calculateTier();

  const handleBuyItem = (item: RewardItem) => {
    if (profile.coins < item.cost) {
      soundEffects.wrong();
      return;
    }

    soundEffects.coin();
    soundEffects.fanfare();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    const newUnlocked = [...profile.unlockedRewards, item.id];
    const newCoins = profile.coins - item.cost;

    applyEquip(item);

    onUpdateEquipped({
      coins: newCoins,
      unlockedRewards: newUnlocked,
    });
  };

  const applyEquip = (item: RewardItem) => {
    soundEffects.tap();

    if (item.type === 'skin') {
      setCurrentSkin(item.id.replace('skin_', '') as ToothSkinMaterial);
    } else if (item.type === 'outfit') {
      setCurrentOutfit(prev => (prev === item.id ? undefined : item.id));
    } else if (item.type === 'hand') {
      setCurrentHand(prev => (prev === item.id ? undefined : item.id));
    } else if (item.type === 'hat') {
      setCurrentHat(prev => (prev === item.id ? undefined : item.id));
    } else if (item.type === 'accessory') {
      setCurrentAccessory(prev => (prev === item.id ? undefined : item.id));
    } else if (item.type === 'profession') {
      setCurrentProfession(prev => (prev === item.id ? undefined : item.id));
    } else if (item.type === 'extra') {
      setCurrentExtra(prev => (prev === item.id ? undefined : item.id));
    } else if (item.type === 'background') {
      setCurrentBackground(item.id.replace('bg_', '') as BackgroundScene);
    }
  };

  const handleSaveAndEquipAll = () => {
    soundEffects.fanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
    });

    onUpdateEquipped({
      baseCharacter: currentBaseCharacter,
      skinMaterial: currentSkin,
      expression: currentExpression,
      tier: currentTierInfo.tier as any,
      selectedOutfit: currentOutfit,
      selectedHand: currentHand,
      selectedHat: currentHat,
      selectedAccessory: currentAccessory,
      selectedProfession: currentProfession,
      selectedBackground: currentBackground,
      selectedExtra: currentExtra,
    });

    onBack();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
      {/* Gambar 3 Header Banner */}
      <div className="bg-gradient-to-r from-[#143D37] via-[#21736A] to-[#29827D] rounded-3xl p-4 sm:p-6 text-white shadow-xl border-2 border-[#6ED5B6]/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEffects.tap();
              onBack();
            }}
            className="p-1 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title="Kembali"
          >
            <BackButton3D size={42} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black font-['Fredoka'] tracking-wide">
                AVATAR GIGI KARAKTER ✨
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A2E7D2] font-extrabold">
              Lucu • Sehat • Berani • Bersinar!
            </p>
          </div>
        </div>

        {/* Top Action & Currency Status Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 bg-[#0E2C27]/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#6ED5B6]/40 shadow-inner">
            <div className="flex items-center gap-1.5">
              <Coin3D size={22} />
              <span className="font-black text-amber-300 text-xs sm:text-sm">{profile.coins}</span>
            </div>
            <span className="text-white/30">•</span>
            <div className="flex items-center gap-1.5">
              <Gem3D size={22} />
              <span className="font-black text-sky-300 text-xs sm:text-sm">{profile.gems || 10}</span>
            </div>
            <span className="text-white/30">•</span>
            <div className="flex items-center gap-1.5">
              <Star3D size={22} />
              <span className="font-black text-yellow-300 text-xs sm:text-sm">{profile.stars}</span>
            </div>
          </div>

          <button
            onClick={handleSaveAndEquipAll}
            className="bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:opacity-95 text-white px-4 py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-green-900/40 transition-transform active:scale-95 cursor-pointer border border-green-300/40 whitespace-nowrap"
          >
            <CheckButton3D size={20} />
            <span>Terapkan Avatar ✓</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ========================================================
            LEFT PANEL: LIVE STAGE & EXPRESSIONS (GAMBAR 3)
            ======================================================== */}
        <div className="lg:col-span-5 bg-[#FAFDF9] rounded-3xl border-2 border-[#C4DCAC] p-5 shadow-lg space-y-4 text-center">
          {/* Tingkatan Gaya Badge */}
          <div className="flex items-center justify-between bg-[#EFF6E9] p-2.5 rounded-2xl border border-[#C4DCAC]">
            <div className="text-left">
              <span className="text-[10px] font-black uppercase text-[#21736A] tracking-wider block">
                Tingkatan Gaya
              </span>
              <span className="text-xs font-black text-[#143D37] font-['Fredoka']">
                {currentTierInfo.tier}. {currentTierInfo.name}
              </span>
            </div>
            <span className="text-sm tracking-widest">{currentTierInfo.stars}</span>
          </div>

          {/* Interactive Mascot Stage */}
          <div className="py-4 flex justify-center items-center relative">
            <MouthToothMascot
              baseCharacter={currentBaseCharacter}
              skinMaterial={currentSkin}
              expression={currentExpression}
              outfit={currentOutfit}
              heldItem={currentHand}
              hat={currentHat}
              accessory={currentAccessory}
              profession={currentProfession}
              extra={currentExtra}
              backgroundScene={currentBackground}
              size="xl"
            />
          </div>

          <div className="space-y-1">
            <h3 className="font-black text-lg text-[#143D37] font-['Fredoka']">
              {profile.name}
            </h3>
            <span className="text-xs font-bold text-[#21736A] bg-[#E2F8F1] px-3 py-1 rounded-full border border-[#6ED5B6]/50 inline-block">
              Pahlawan Senyum Sehat 🛡️
            </span>
          </div>

          {/* Model Bentuk Karakter Gigi (Pilihan Tipe Tubuh Imut) */}
          <div className="pt-2 text-left space-y-1.5 border-t border-[#EFF6E9]">
            <span className="text-[11px] font-extrabold text-[#143D37] uppercase tracking-wider block">
              Pilih Bentuk Karakter Gigi:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'chibi' as const, label: 'Denti Imut', desc: 'Baby Chibi' },
                { id: 'molar' as const, label: 'Kiko Molar', desc: 'Geraham Gemoy' },
                { id: 'hero' as const, label: 'Sparky Hero', desc: 'Pahlawan' },
                { id: 'boba' as const, label: 'Bobi Boba', desc: 'Bouncy Bulat' },
              ].map(char => (
                <button
                  key={char.id}
                  onClick={() => {
                    soundEffects.tap();
                    setCurrentBaseCharacter(char.id);
                  }}
                  className={`p-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center ${
                    currentBaseCharacter === char.id
                      ? 'bg-[#E2F8F1] border-[#21736A] ring-2 ring-[#6ED5B6] shadow-xs'
                      : 'bg-white border-[#C4DCAC]/60 hover:bg-[#EFF6E9]'
                  }`}
                >
                  <span className="text-xs font-black text-[#143D37] font-['Fredoka']">
                    {char.label}
                  </span>
                  <span className="text-[9px] font-bold text-[#21736A]">
                    {char.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Background Scene Selector (Gambar 3) */}
          <div className="pt-2 text-left space-y-1.5 border-t border-[#EFF6E9]">
            <span className="text-[11px] font-extrabold text-[#143D37] uppercase tracking-wider block">
              Pilih Lokasi Panggung (Background):
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {backgroundsList.map(bg => (
                <button
                  key={bg.id}
                  onClick={() => {
                    soundEffects.tap();
                    setCurrentBackground(bg.id);
                  }}
                  className={`p-1.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                    currentBackground === bg.id
                      ? 'bg-[#21736A] text-white border-[#21736A] shadow-xs'
                      : 'bg-[#EFF6E9] text-[#143D37] border-[#C4DCAC] hover:bg-[#E2F8F1]'
                  }`}
                >
                  <span>{bg.icon}</span>
                  <span className="truncate">{bg.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Facial Expression Selector (Gambar 3) */}
          <div className="pt-2 text-left space-y-1.5 border-t border-[#EFF6E9]">
            <span className="text-[11px] font-extrabold text-[#143D37] uppercase tracking-wider block">
              Pilih Ekspresi Wajah Gigi:
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
              {expressionsList.map(exp => (
                <button
                  key={exp.id}
                  onClick={() => {
                    soundEffects.tap();
                    setCurrentExpression(exp.id);
                  }}
                  className={`p-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center ${
                    currentExpression === exp.id
                      ? 'bg-[#E2F8F1] border-[#21736A] ring-2 ring-[#6ED5B6]'
                      : 'bg-white border-[#C4DCAC]/60 hover:bg-[#EFF6E9]'
                  }`}
                  title={exp.label}
                >
                  <span className="text-xl">{exp.icon}</span>
                  <span className="text-[9px] font-bold text-[#143D37] mt-0.5 truncate w-full">
                    {exp.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Confirm & Save Button */}
          <div className="pt-2">
            <button
              onClick={handleSaveAndEquipAll}
              className="w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base text-white bg-gradient-to-r from-[#22C55E] via-[#16A34A] to-[#15803D] hover:opacity-95 shadow-lg shadow-green-900/30 transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer border-2 border-green-300/40"
            >
              <CheckButton3D size={26} />
              <span>Terapkan Avatar ke Menu Utama!</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            RIGHT PANEL: CUSTOMIZATION STUDIO CATALOG (GAMBAR 3)
            ======================================================== */}
        <div className="lg:col-span-7 bg-[#FAFDF9] rounded-3xl border-2 border-[#C4DCAC] p-5 sm:p-6 shadow-lg space-y-5">
          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 border-b border-[#EFF6E9]">
            {[
              { id: 'skin', label: 'Warna & Kulit', icon: '🎨' },
              { id: 'outfit', label: 'Pakaian', icon: '👕' },
              { id: 'hand', label: 'Tangan', icon: '🪥' },
              { id: 'hat', label: 'Kepala', icon: '👑' },
              { id: 'accessory', label: 'Aksesoris', icon: '👓' },
              { id: 'profession', label: 'Profesi', icon: '🩺' },
              { id: 'extra', label: 'Efek Kilau', icon: '✨' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  soundEffects.tap();
                  setActiveTab(tab.id as any);
                }}
                className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#21736A] via-[#29827D] to-[#143D37] text-white shadow-md shadow-[#143D37]/25'
                    : 'bg-[#EFF6E9] text-[#143D37] hover:bg-[#E2F8F1] border border-[#C4DCAC]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredItems.map(item => {
              const isUnlocked = profile.unlockedRewards.includes(item.id) || item.cost === 0;

              const isEquipped =
                (item.type === 'skin' && currentSkin === item.id.replace('skin_', '')) ||
                (item.type === 'outfit' && currentOutfit === item.id) ||
                (item.type === 'hand' && currentHand === item.id) ||
                (item.type === 'hat' && currentHat === item.id) ||
                (item.type === 'accessory' && currentAccessory === item.id) ||
                (item.type === 'profession' && currentProfession === item.id) ||
                (item.type === 'extra' && currentExtra === item.id) ||
                (item.type === 'background' && currentBackground === item.id.replace('bg_', ''));

              const canAfford = profile.coins >= item.cost;

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 ${
                    isEquipped
                      ? 'border-[#21736A] bg-[#E2F8F1] ring-2 ring-[#6ED5B6] shadow-sm'
                      : isUnlocked
                      ? 'border-[#AEC892] bg-[#EFF6E9]/60'
                      : 'border-[#C4DCAC]/60 bg-white hover:border-[#6ED5B6]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl p-2 bg-[#FAFDF9] rounded-2xl shadow-2xs border border-[#C4DCAC]/40 flex items-center justify-center">
                      {item.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-sm text-[#143D37] font-['Fredoka'] truncate">
                          {item.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#143D37]/75 font-semibold line-clamp-2 mt-0.5 leading-snug">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#EFF6E9]">
                    <div className="flex items-center gap-1 font-black text-xs text-[#8F4619]">
                      <Coin3D size={18} />
                      <span>{item.cost === 0 ? 'Gratis' : `${item.cost} Koin`}</span>
                    </div>

                    {isUnlocked ? (
                      <button
                        onClick={() => applyEquip(item)}
                        className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all active:scale-95 cursor-pointer ${
                          isEquipped
                            ? 'bg-[#FDF0E9] text-[#B86230] border border-[#D97724]/40 hover:bg-[#FBE4D6]'
                            : 'bg-gradient-to-r from-[#21736A] to-[#29827D] hover:opacity-95 text-white shadow-xs'
                        }`}
                      >
                        {isEquipped ? 'Lepas ✖' : 'Pasang ✓'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuyItem(item)}
                        disabled={!canAfford}
                        className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all active:scale-95 cursor-pointer ${
                          canAfford
                            ? 'bg-gradient-to-r from-[#D97724] to-[#BF7E43] hover:opacity-95 text-white shadow-xs'
                            : 'bg-[#EFF6E9] text-[#143D37]/40 border border-[#C4DCAC]/40 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'Beli Sekarang 🪙' : 'Koin Kurang 🔒'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
