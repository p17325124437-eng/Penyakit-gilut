import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { DentalDisease, DentalDiseaseId } from '../types';
import { DENTAL_DISEASES } from '../data/diseases';
import { soundEffects, speakText, stopSpeech } from '../utils/audio';

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

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-3xl border-2 border-emerald-100 shadow-sm">
        <button
          onClick={() => {
            soundEffects.tap();
            stopSpeech();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm transition-transform active:scale-95"
        >
          <span>←</span>
          <span>Kembali</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 font-['Fredoka']">
            Klinik Gigi Petualang 🩺
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Kenali penyakit gigi, kalahkan kuman, dan jaga senyummu!
          </p>
        </div>

        <div className="bg-emerald-50 text-emerald-800 font-extrabold text-xs px-3 py-1.5 rounded-2xl border border-emerald-200">
          {exploredIds.length} / 7 Dipelajari
        </div>
      </div>

      {/* Disease Selection Carousel / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {DENTAL_DISEASES.map(d => {
          const isSelected = d.id === selectedDisease.id;
          const isDone = exploredIds.includes(d.id);
          return (
            <button
              key={d.id}
              onClick={() => handleSelect(d)}
              className={`p-3 rounded-2xl border-2 text-left flex flex-col items-center justify-center gap-1.5 transition-all relative ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50 shadow-md scale-102 ring-2 ring-emerald-300'
                  : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50'
              }`}
            >
              {isDone && (
                <span className="absolute top-1.5 right-1.5 text-xs bg-emerald-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  ✓
                </span>
              )}
              <span className="text-3xl">{d.icon}</span>
              <span className="text-xs font-extrabold text-center line-clamp-1 text-slate-800">
                {d.name.split(' (')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detailed Card for Selected Disease */}
      <div className="bg-white rounded-3xl border-2 border-emerald-100 p-5 md:p-7 shadow-sm space-y-6">
        {/* Banner with Villain & Title */}
        <div
          className={`rounded-2xl p-5 bg-gradient-to-r ${selectedDisease.color} text-white relative overflow-hidden shadow-md`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="inline-block bg-white/20 backdrop-blur-xs px-3 py-0.5 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                {selectedDisease.childTitle}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-['Fredoka']">
                {selectedDisease.name}
              </h3>
              <p className="text-white/90 text-sm font-medium max-w-xl">
                {selectedDisease.tagline}
              </p>
            </div>

            {/* Villain monster card */}
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-3 flex items-center gap-3">
              <span className="text-4xl animate-bounce-gentle">{selectedDisease.villainAvatar}</span>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                  Monster Musuh
                </div>
                <div className="text-sm font-extrabold text-white">
                  {selectedDisease.villainName}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audio Narration Button & Explanation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {selectedDisease.description}
          </p>
          <button
            onClick={handleReadAloud}
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition-all shadow-xs active:scale-95 ${
              isSpeaking
                ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <span>{isSpeaking ? '⏹️' : '🔊'}</span>
            <span>{isSpeaking ? 'Hentikan Suara' : 'Bacakan Untukku'}</span>
          </button>
        </div>

        {/* Navigation Tabs (Penyebab, Gejala, Pencegahan, Cerita) */}
        <div>
          <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => {
                soundEffects.tap();
                setActiveTab('penyebab');
              }}
              className={`px-4 py-2.5 rounded-t-2xl font-extrabold text-xs sm:text-sm transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'penyebab'
                  ? 'bg-amber-100 text-amber-900 border-b-3 border-amber-500'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>🔍</span>
              <span>Kenapa Bisa Terjadi? (Penyebab)</span>
            </button>

            <button
              onClick={() => {
                soundEffects.tap();
                setActiveTab('gejala');
              }}
              className={`px-4 py-2.5 rounded-t-2xl font-extrabold text-xs sm:text-sm transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'gejala'
                  ? 'bg-rose-100 text-rose-900 border-b-3 border-rose-500'
                  : 'text-slate-600 hover:bg-slate-100'
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
              className={`px-4 py-2.5 rounded-t-2xl font-extrabold text-xs sm:text-sm transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'pencegahan'
                  ? 'bg-emerald-100 text-emerald-900 border-b-3 border-emerald-500'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>🛡️</span>
              <span>Cara Mengusir & Mencegah</span>
            </button>

            <button
              onClick={() => {
                soundEffects.tap();
                setActiveTab('kisah');
              }}
              className={`px-4 py-2.5 rounded-t-2xl font-extrabold text-xs sm:text-sm transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'kisah'
                  ? 'bg-purple-100 text-purple-900 border-b-3 border-purple-500'
                  : 'text-slate-600 hover:bg-slate-100'
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
                    className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3"
                  >
                    <span className="text-2xl p-2 bg-white rounded-xl shadow-2xs border border-amber-100">
                      {item.icon}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-amber-950 leading-relaxed pt-1">
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
                    className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 flex items-start gap-3"
                  >
                    <span className="text-2xl p-2 bg-white rounded-xl shadow-2xs border border-rose-100">
                      {item.icon}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-rose-950 leading-relaxed pt-1">
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
                    className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3"
                  >
                    <span className="text-2xl p-2 bg-white rounded-xl shadow-2xs border border-emerald-100">
                      {item.icon}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-emerald-950 leading-relaxed pt-1">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'kisah' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950">
                  <div className="flex items-center gap-2 mb-2 text-purple-800 font-extrabold text-sm">
                    <span>🌟</span>
                    <span>Kisah Si Pahlawan Gigi</span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed font-medium">
                    {selectedDisease.story}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-950">
                  <div className="flex items-center gap-2 mb-2 text-cyan-800 font-extrabold text-sm">
                    <span>💡</span>
                    <span>Tahukah Kamu? (Fakta Ajaib)</span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed font-medium">
                    {selectedDisease.funFact}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Button: Mark as studied and earn coins */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-500">
            {isExplored ? (
              <span className="text-emerald-600 flex items-center gap-1">
                ✅ Kamu sudah menguasai materi penyakit ini!
              </span>
            ) : (
              <span>Pelajari materi ini untuk mendapatkan 50 Koin Gigi & 1 Bintang!</span>
            )}
          </div>

          <button
            onClick={handleCompleteStudy}
            disabled={isExplored}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 ${
              isExplored
                ? 'bg-slate-100 text-slate-400 cursor-default'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/25'
            }`}
          >
            <span>{isExplored ? 'Sudah Dipelajari ⭐' : 'Tandai Sudah Paham (+50 🪙)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
