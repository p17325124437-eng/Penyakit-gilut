import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ChildProfile, RewardItem } from '../types';
import { REWARD_ITEMS } from '../data/rewardsData';
import { MouthToothMascot } from './MouthToothMascot';
import { soundEffects } from '../utils/audio';

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
  const [activeTab, setActiveTab] = useState<'hat' | 'glasses' | 'cape' | 'glow' | 'tool'>('hat');

  const filteredItems = REWARD_ITEMS.filter(item => item.type === activeTab);

  const handleBuy = (item: RewardItem) => {
    if (profile.coins < item.cost) {
      soundEffects.wrong();
      return;
    }

    soundEffects.coin();
    soundEffects.fanfare();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });

    const newUnlocked = [...profile.unlockedRewards, item.id];
    const newCoins = profile.coins - item.cost;

    let equippedUpdate: Partial<ChildProfile> = {
      coins: newCoins,
      unlockedRewards: newUnlocked,
    };

    if (item.type === 'hat') equippedUpdate.selectedHat = item.id;
    if (item.type === 'glasses') equippedUpdate.selectedGlasses = item.id;
    if (item.type === 'cape') equippedUpdate.selectedCape = item.id;
    if (item.type === 'glow') equippedUpdate.selectedGlow = item.id;

    onUpdateEquipped(equippedUpdate);
  };

  const handleEquip = (item: RewardItem) => {
    soundEffects.tap();
    let equippedUpdate: Partial<ChildProfile> = {};

    if (item.type === 'hat') {
      equippedUpdate.selectedHat = profile.selectedHat === item.id ? undefined : item.id;
    } else if (item.type === 'glasses') {
      equippedUpdate.selectedGlasses = profile.selectedGlasses === item.id ? undefined : item.id;
    } else if (item.type === 'cape') {
      equippedUpdate.selectedCape = profile.selectedCape === item.id ? undefined : item.id;
    } else if (item.type === 'glow') {
      equippedUpdate.selectedGlow = profile.selectedGlow === item.id ? undefined : item.id;
    }

    onUpdateEquipped(equippedUpdate);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-3xl border-2 border-purple-100 shadow-sm">
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
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 font-['Fredoka']">
            Lemari Kostum & Reward 👗
          </h2>
          <div className="text-xs text-slate-500 font-medium">
            Gunakan koin gigi untuk mendandani gigimu!
          </div>
        </div>

        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-2xl shadow-xs">
          <span className="text-lg">🪙</span>
          <span className="font-black text-amber-700 text-sm">{profile.coins} Koin</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Live Mascot Preview */}
        <div className="lg:col-span-4 bg-white rounded-3xl border-2 border-purple-100 p-6 text-center shadow-sm space-y-4">
          <span className="text-xs font-black uppercase text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Penampilan Gigimu Sekarang
          </span>

          <div className="py-6 flex justify-center">
            <MouthToothMascot
              hat={profile.selectedHat}
              glasses={profile.selectedGlasses}
              cape={profile.selectedCape}
              glow={profile.selectedGlow}
              expression="sparkle"
              size="lg"
            />
          </div>

          <div className="border-t border-slate-100 pt-3">
            <div className="font-black text-lg text-slate-800 font-['Fredoka']">
              {profile.name}
            </div>
            <div className="text-xs font-bold text-emerald-600">
              Pahlawan Senyum Berkilau ✨
            </div>
          </div>
        </div>

        {/* Right Side: Items Catalog */}
        <div className="lg:col-span-8 bg-white rounded-3xl border-2 border-purple-100 p-5 sm:p-6 shadow-sm space-y-5">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { id: 'hat', label: 'Topi Lucu', icon: '🎩' },
              { id: 'glasses', label: 'Kacamata', icon: '🕶️' },
              { id: 'cape', label: 'Jubah & Sayap', icon: '🦸' },
              { id: 'glow', label: 'Aura Kilau', icon: '✨' },
              { id: 'tool', label: 'Alat Sakti', icon: '🛡️' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  soundEffects.tap();
                  setActiveTab(tab.id as any);
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredItems.map(item => {
              const isUnlocked = profile.unlockedRewards.includes(item.id);
              const isEquipped =
                profile.selectedHat === item.id ||
                profile.selectedGlasses === item.id ||
                profile.selectedCape === item.id ||
                profile.selectedGlow === item.id;
              const canAfford = profile.coins >= item.cost;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 ${
                    isEquipped
                      ? 'border-purple-500 bg-purple-50/80 ring-2 ring-purple-300'
                      : isUnlocked
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : 'border-slate-200 bg-white hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-4xl p-2 bg-white rounded-xl shadow-2xs border border-slate-100">
                      {item.icon}
                    </span>
                    <div className="flex-1">
                      <div className="font-black text-sm text-slate-800 font-['Fredoka']">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1 font-black text-xs text-amber-700">
                      <span>🪙</span>
                      <span>{item.cost} Koin</span>
                    </div>

                    {isUnlocked ? (
                      <button
                        onClick={() => handleEquip(item)}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all active:scale-95 ${
                          isEquipped
                            ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        {isEquipped ? 'Lepas ✖' : 'Pasang ✓'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={!canAfford}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all active:scale-95 ${
                          canAfford
                            ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs shadow-amber-500/20'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
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
