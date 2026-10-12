import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { DentalDisease, DentalDiseaseId } from '../types';
import { DENTAL_DISEASES } from '../data/diseases';
import { soundEffects, speakText, stopSpeech } from '../utils/audio';
import {
  BackButton3D,
  ToothHealthy3D,
  ToothCavity3D,
  ToothSensitive3D,
  Plaque3D,
  Bacteria3D,
  Toothbrush3D,
  Shield3D,
  Coin3D,
  Star3D,
  Gingivitis3D,
  Sariawan3D,
  Halitosis3D,
  AcidErosion3D,
} from './GameIcons';

interface ExplorerProps {
  exploredIds: string[];
  speechEnabled: boolean;
  onMarkExplored: (diseaseId: DentalDiseaseId) => void;
  onBack: () => void;
}

export const DiseaseExplorer: React.FC<ExplorerProps> = ({
  exploredIds,
  speechEnabled,
  onMarkExplored,
  onBack,
}) => {
  const [selectedDisease, setSelectedDisease] = useState<DentalDisease>(DENTAL_DISEASES[0]);
  const [activeTab, setActiveTab] = useState<'penyebab' | 'gejala' | 'pencegahan' | 'kisah'>('penyebab');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const isExplored = exploredIds.includes(selectedDisease.id);

  const handleSelect = (disease: DentalDisease) => {
    soundEffects.tap();
    stopSpeech();
    setIsSpeaking(false);
    setSelectedDisease(disease);
    setActiveTab('penyebab');
  };

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    soundEffects.tap();
    setIsSpeaking(true);

    let textToRead = `${selectedDisease.name}. ${selectedDisease.childTitle}. ${selectedDisease.description} `;
    if (activeTab === 'penyebab') {
      textToRead += `Penyebabnya adalah: ` + selectedDisease.causes.map(c => c.text).join('. ');
    } else if (activeTab === 'gejala') {
      textToRead += `Gejalanya adalah: ` + selectedDisease.symptoms.map(s => s.text).join('. ');
    } else if (activeTab === 'pencegahan') {
      textToRead += `Cara mencegahnya adalah: ` + selectedDisease.prevention.map(p => p.text).join('. ');
    } else {
      textToRead += selectedDisease.story + '. ' + selectedDisease.funFact;
    }

    speakText(textToRead, () => {
      setIsSpeaking(false);
    });
  };

  const handleCompleteStudy = () => {
    if (!isExplored) {
      soundEffects.fanfare();
      soundEffects.coin();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });
      onMarkExplored(selectedDisease.id);
    }
  };

  // Helper to render 3D icons from Gambar 2
  const renderDiseaseIcon = (id: DentalDiseaseId) => {
    switch (id) {
      case 'karies':
        return <ToothCavity3D size={40} />;
      case 'karang_gigi':
        return <Plaque3D size={40} />;
      case 'gigi_sensitif':
        return <ToothSensitive3D size={40} />;
      case 'gingivitis':
        return <Gingivitis3D size={40} />;
      case 'sariawan':
        return <Sariawan3D size={40} />;
      case 'bau_mulut':
        return <Halitosis3D size={40} />;
      case 'erosi_asam':
        return <AcidErosion3D size={40} />;
      default:
        return <ToothHealthy3D size={40} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header bar with Gambar 4 3D button */}
      <div className="flex items-center justify-between gap-3 bg-[#FAFDF9] p-4 rounded-3xl border-2 border-[#C4DCAC] shadow-sm">
        <button
          onClick={() => {
            soundEffects.tap();
            stopSpeech();
            onBack();
          }}
          className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          title="Kembali ke Menu Utama"
        >
          <BackButton3D size={42} />
        </button>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-[#143D37] font-['Fredoka']">
            Klinik Gigi & Ensiklopedia 🩺
          </h2>
          <p className="text-xs text-[#21736A] font-bold">
            Kenali penyakit gigi, kalahkan kuman, dan rawat senyum berkilau!
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#E2F8F1] text-[#143D37] font-black text-xs px-3.5 py-1.5 rounded-2xl border border-[#6ED5B6]">
          <Star3D size={18} />
          <span>{exploredIds.length} / 7 Dipelajari</span>
        </div>
      </div>

      {/* Disease Selection Carousel / Grid (Gambar 2 - 3D Icon Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {DENTAL_DISEASES.map(d => {
          const isSelected = d.id === selectedDisease.id;
          const isDone = exploredIds.includes(d.id);
          return (
            <button
              key={d.id}
              onClick={() => handleSelect(d)}
              className={`p-3 rounded-2xl border-2 text-left flex flex-col items-center justify-center gap-1.5 transition-all relative cursor-pointer ${
                isSelected
                  ? 'border-[#21736A] bg-[#E2F8F1] shadow-md scale-102 ring-2 ring-[#6ED5B6]'
                  : 'border-[#C4DCAC]/60 bg-[#FAFDF9] hover:border-[#6ED5B6] hover:bg-[#EFF6E9]'
              }`}
            >
              {isDone && (
                <span className="absolute top-1.5 right-1.5 text-xs bg-[#21736A] text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  ✓
                </span>
              )}
              <div className="h-10 flex items-center justify-center">
                {renderDiseaseIcon(d.id)}
              </div>
              <span className="text-xs font-black text-center line-clamp-1 text-[#143D37]">
                {d.name.split(' (')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detailed Card for Selected Disease */}
      <div className="bg-[#FAFDF9] rounded-3xl border-2 border-[#C4DCAC] p-5 md:p-7 shadow-sm space-y-6">
        {/* Banner with Villain & Title */}
        <div className="rounded-3xl p-5 md:p-6 bg-gradient-to-r from-[#143D37] via-[#21736A] to-[#29827D] text-white relative overflow-hidden shadow-md border-2 border-[#6ED5B6]/40">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="inline-block bg-[#0E2C27]/70 backdrop-blur-xs px-3.5 py-0.5 rounded-full text-xs font-black text-[#6ED5B6] uppercase tracking-wider border border-[#6ED5B6]/40">
                {selectedDisease.childTitle}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-['Fredoka'] text-[#EFF6E9]">
                {selectedDisease.name}
              </h3>
              <p className="text-[#A2E7D2] text-sm font-semibold max-w-xl">
                {selectedDisease.tagline}
              </p>
            </div>

            {/* Villain monster card (Gambar 2 Bakteri) */}
            <div className="bg-[#0E2C27]/60 backdrop-blur-md border border-[#6ED5B6]/40 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <Bacteria3D size={44} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-[#A2E7D2]">
                  Monster Kuman
                </div>
                <div className="text-sm font-black text-[#EFF6E9]">
                  {selectedDisease.villainName}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audio Narration Button & Explanation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#EFF6E9] p-4 rounded-2xl border border-[#C4DCAC]">
          <p className="text-sm text-[#143D37] leading-relaxed font-bold">
            {selectedDisease.description}
          </p>
          <button
            onClick={handleReadAloud}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all shadow-xs active:scale-95 cursor-pointer ${
              isSpeaking
                ? 'bg-[#D97724] text-white animate-pulse'
                : 'bg-[#21736A] hover:bg-[#143D37] text-white'
            }`}
          >
            <span>{isSpeaking ? '⏹️' : '🔊'}</span>
            <span>{isSpeaking ? 'Hentikan Suara' : 'Bacakan Suara'}</span>
          </button>
        </div>

        {/* Navigation Tabs (Penyebab, Gejala, Pencegahan, Kisah) */}
        <div>
          <div className="flex border-b border-[#C4DCAC] gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => {
                soundEffects.tap();
                setActiveTab('penyebab');
              }}
              className={`px-4 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'penyebab'
                  ? 'bg-[#FAF2E8] text-[#8F4619] border-b-3 border-[#D97724]'
                  : 'text-[#143D37]/70 hover:bg-[#EFF6E9]'
              }`}
            >
              <span>🔍</span>
              <span>Penyebab (Faktor Risiko)</span>
            </button>

            <button
              onClick={() => {
                soundEffects.tap();
                setActiveTab('gejala');
              }}
              className={`px-4 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'gejala'
                  ? 'bg-[#FDF0E9] text-[#B86230] border-b-3 border-[#D95B43]'
                  : 'text-[#143D37]/70 hover:bg-[#EFF6E9]'
              }`}
            >
              <span>🤕</span>
              <span>Tanda & Gejalanya</span>
            </button>

            <button
              onClick={() => {
                soundEffects.tap();
                setActiveTab('pencegahan');
              }}
              className={`px-4 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'pencegahan'
                  ? 'bg-[#E2F8F1] text-[#143D37] border-b-3 border-[#21736A]'
                  : 'text-[#143D37]/70 hover:bg-[#EFF6E9]'
              }`}
            >
              <span>🛡️</span>
              <span>Cara Pencegahan</span>
            </button>

            <button
              onClick={() => {
                soundEffects.tap();
                setActiveTab('kisah');
              }}
              className={`px-4 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'kisah'
                  ? 'bg-[#E2F8F1] text-[#21736A] border-b-3 border-[#6ED5B6]'
                  : 'text-[#143D37]/70 hover:bg-[#EFF6E9]'
              }`}
            >
              <span>📖</span>
              <span>Kisah & Fakta Ajaib</span>
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="pt-4">
            {activeTab === 'penyebab' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedDisease.causes.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#FAF2E8] border border-[#FEE8A2] flex items-start gap-3"
                  >
                    <span className="text-2xl p-2 bg-[#FAFDF9] rounded-xl shadow-2xs border border-[#F5B842]/30">
                      {item.icon}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-[#143D37] leading-relaxed pt-1">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'gejala' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedDisease.symptoms.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#FDF0E9] border border-[#D97724]/40 flex items-start gap-3"
                  >
                    <span className="text-2xl p-2 bg-[#FAFDF9] rounded-xl shadow-2xs border border-[#D97724]/30">
                      {item.icon}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-[#143D37] leading-relaxed pt-1">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'pencegahan' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedDisease.prevention.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#EFF6E9] border border-[#C4DCAC] flex items-start gap-3"
                  >
                    <span className="text-2xl p-2 bg-[#FAFDF9] rounded-xl shadow-2xs border border-[#AEC892]">
                      {item.icon}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-[#143D37] leading-relaxed pt-1">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'kisah' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FAF2E8] border border-[#FEE8A2] text-[#143D37]">
                  <div className="flex items-center gap-2 mb-2 text-[#8F4619] font-black text-sm">
                    <span>🍁</span>
                    <span>Kisah Si Pahlawan Gigi</span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed font-semibold">
                    {selectedDisease.story}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#E2F8F1] border border-[#6ED5B6] text-[#143D37]">
                  <div className="flex items-center gap-2 mb-2 text-[#21736A] font-black text-sm">
                    <span>💡</span>
                    <span>Tahukah Kamu? (Fakta Ajaib)</span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed font-semibold">
                    {selectedDisease.funFact}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Button: Mark as studied and earn coins */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#C4DCAC]/50">
          <div className="text-xs font-black text-[#143D37]/80">
            {isExplored ? (
              <span className="text-[#21736A] flex items-center gap-1">
                ✅ Kamu sudah menguasai materi penyakit ini!
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Coin3D size={18} />
                <span>Pelajari materi ini untuk mendapatkan 50 Koin Gigi & 1 Bintang!</span>
              </span>
            )}
          </div>

          <button
            onClick={handleCompleteStudy}
            disabled={isExplored}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer ${
              isExplored
                ? 'bg-[#EFF6E9] text-[#143D37]/50 border border-[#C4DCAC] cursor-default'
                : 'bg-gradient-to-r from-[#21736A] via-[#29827D] to-[#143D37] text-white shadow-[#143D37]/25'
            }`}
          >
            <span>{isExplored ? 'Sudah Dipelajari ⭐' : 'Tandai Sudah Paham (+50 🪙)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
