import React from 'react';
import { ChildProfile } from '../types';
import { MouthToothMascot } from './MouthToothMascot';
import { soundEffects, speakText } from '../utils/audio';

interface ModeSelectorProps {
  profile: ChildProfile;
  speechEnabled: boolean;
  onSelectMode: (mode: string) => void;
  onOpenWardrobe: () => void;
  onOpenLeaderboard: () => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  profile,
  speechEnabled,
  onSelectMode,
  onOpenWardrobe,
  onOpenLeaderboard,
}) => {
  const handleVoiceWelcome = () => {
    if (speechEnabled) {
      speakText(
        `Halo ${profile.name}! Selamat datang di Dentika Petualangan Gigi Sehat. Ayo pilih permainan seru dan jaga gigimu tetap berkilau!`
      );
    }
  };

  const menuItems = [
    {
      id: 'clinic',
      title: 'Klinik Gigi Petualang',
      subtitle: 'Kenali 7 penyakit gigi, kuman jahat & pencegahannya!',
      icon: '🦷',
      badge: `${profile.exploredDiseases.length}/7 Penyakit`,
      color: 'from-emerald-500 to-teal-600',
      lightBg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
      btnText: 'Mulai Menjelajah',
      tag: 'Edukasi Lengkap',
    },
    {
      id: 'quiz',
      title: 'Kuis Bintang Dokter Cilik',
      subtitle: 'Jawab kuis interaktif, raih koin emas dan bintang senyum!',
      icon: '❓',
      badge: `${profile.completedQuizzes} Kuis Selesai`,
      color: 'from-amber-500 to-orange-600',
      lightBg: 'bg-amber-50 border-amber-300 text-amber-950',
      btnText: 'Mulai Kuis',
      tag: 'Banjir Koin 🪙',
    },
    {
      id: 'germ_game',
      title: 'Basmi Kuman Gigi!',
      subtitle: 'Ketuk kuman karies dan karang gigi sebelum merusak gigi!',
      icon: '👾',
      badge: `Rekor: ${profile.germBusterHighScore} Poin`,
      color: 'from-rose-500 to-red-600',
      lightBg: 'bg-rose-50 border-rose-300 text-rose-950',
      btnText: 'Main Game',
      tag: 'Aksi Cepat ⚡',
    },
    {
      id: 'food_game',
      title: 'Piring Sahabat Gigi',
      subtitle: 'Pilah makanan yang menguatkan gigi vs yang membuat berlubang!',
      icon: '🍎',
      badge: `Tantangan Nutrisi`,
      color: 'from-sky-500 to-blue-600',
      lightBg: 'bg-sky-50 border-sky-300 text-sky-950',
      btnText: 'Pilah Makanan',
      tag: 'Teka-Teki Seru',
    },
    {
      id: 'brushing',
      title: 'Simulator Sikat Gigi 2 Menit',
      subtitle: 'Sikat gigi bersama panduan visual ceria dan musik penyemangat!',
      icon: '🪥',
      badge: `${profile.brushingSessionsCompleted}x Bersih`,
      color: 'from-cyan-500 to-teal-500',
      lightBg: 'bg-cyan-50 border-cyan-300 text-cyan-950',
      btnText: 'Mulai Sikat Gigi',
      tag: 'Kebiasaan Baik ⭐',
    },
    {
      id: 'leaderboard',
      title: 'Papan Peringkat Juara',
      subtitle: 'Lihat posisi skormu dan bersaing sehat dengan teman lainnya!',
      icon: '🏆',
      badge: `${profile.score} Poin`,
      color: 'from-purple-500 to-indigo-600',
      lightBg: 'bg-purple-50 border-purple-300 text-purple-950',
      btnText: 'Lihat Peringkat',
      tag: 'Kompetisi Sehat',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Mascot Banner */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl p-5 md:p-7 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden">
        {/* Background bubbles */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-center sm:text-left space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-50 border border-white/25">
              <span>🌟</span>
              <span>Dokter Gigi Cilik Nomor Satu</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-['Fredoka']">
              Halo, {profile.name}! 👋
            </h1>
            <p className="text-emerald-50 text-sm sm:text-base leading-relaxed font-medium">
              Siap menjelajah dunia gigi hari ini? Pelajari penyakit gigi, kumpulkan koin, dan lindungi senyum indahmu!
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <button
                onClick={() => {
                  soundEffects.tap();
                  handleVoiceWelcome();
                }}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <span>🔊</span>
                <span>Dengarkan Suara</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.tap();
                  onOpenWardrobe();
                }}
                className="bg-amber-400 hover:bg-amber-300 text-slate-900 px-4 py-1.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shadow-md shadow-amber-500/30 transition-transform active:scale-95"
              >
                <span>👗</span>
                <span>Dandani Gigimu</span>
              </button>
            </div>
          </div>

          {/* Interactive Mascot avatar */}
          <div
            className="cursor-pointer group flex flex-col items-center"
            onClick={() => {
              soundEffects.coin();
              onOpenWardrobe();
            }}
            title="Klik gigimu untuk berdandan!"
          >
            <MouthToothMascot
              hat={profile.selectedHat}
              glasses={profile.selectedGlasses}
              cape={profile.selectedCape}
              glow={profile.selectedGlow}
              expression="excited"
              size="lg"
            />
            <span className="mt-2 text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full text-white backdrop-blur-sm group-hover:bg-white/30">
              Ketuk untuk Ganti Kostum 👕
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Activities */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 font-['Fredoka']">
              Pilih Petualanganmu
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
            Bebas Pilih Mana Saja!
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map(item => (
            <div
              key={item.id}
              onClick={() => {
                soundEffects.tap();
                if (item.id === 'leaderboard') {
                  onOpenLeaderboard();
                } else {
                  onSelectMode(item.id);
                }
              }}
              className={`group relative overflow-hidden rounded-3xl border-2 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer ${item.lightBg} shadow-sm`}
            >
              {/* Tag in corner */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-3xl sm:text-4xl p-2.5 bg-white rounded-2xl shadow-xs border border-slate-100 group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/80 border border-slate-200/80 shadow-2xs">
                    {item.tag}
                  </span>
                  <span className="text-xs font-bold text-slate-600">{item.badge}</span>
                </div>
              </div>

              <h3 className="font-extrabold text-lg sm:text-xl mb-1.5 font-['Fredoka'] tracking-tight">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mb-4 line-clamp-2">
                {item.subtitle}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                <span className="text-xs font-extrabold text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {item.btnText} →
                </span>
                <span className="text-sm">✨</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Health Habits Mini Checklist */}
      <div className="bg-white rounded-3xl border-2 border-emerald-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-800 font-['Fredoka']">
              Misi Harian Senyum Sehat
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Dapatkan Koin Tambahan!
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div
            onClick={() => onSelectMode('brushing')}
            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center text-xl font-bold">
              🪥
            </div>
            <div className="flex-1">
              <div className="font-bold text-xs sm:text-sm text-slate-800">Sikat Gigi 2 Menit</div>
              <div className="text-[11px] text-slate-500">Pagi & malam sebelum tidur</div>
            </div>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">+100 🪙</span>
          </div>

          <div
            onClick={() => onSelectMode('quiz')}
            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-amber-50 hover:border-amber-300 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl font-bold">
              ❓
            </div>
            <div className="flex-1">
              <div className="font-bold text-xs sm:text-sm text-slate-800">Ikuti 1 Sesi Kuis</div>
              <div className="text-[11px] text-slate-500">Uji pengetahuan gigimu</div>
            </div>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">+100 🪙</span>
          </div>

          <div
            onClick={() => onSelectMode('clinic')}
            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-teal-50 hover:border-teal-300 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center text-xl font-bold">
              🔍
            </div>
            <div className="flex-1">
              <div className="font-bold text-xs sm:text-sm text-slate-800">Pelajari 1 Penyakit Gigi</div>
              <div className="text-[11px] text-slate-500">Kenali kuman & cara usirnya</div>
            </div>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">+50 🪙</span>
          </div>
        </div>
      </div>
    </div>
  );
};
