import React, { useState } from 'react';
import { ChildProfile } from '../types';
import { MouthToothMascot } from './MouthToothMascot';
import { soundEffects, speakText } from '../utils/audio';
import {
  PlayButton3D,
  BookButton3D,
  ToothHealthy3D,
  ToothCavity3D,
  Bacteria3D,
  Toothbrush3D,
  Shield3D,
  Coin3D,
  Star3D,
  Trophy3D,
  Apple3D,
} from './GameIcons';

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
  // Helper to determine profession / role title matching Gambar 3
  const getCustomTitle = () => {
    if (profile.selectedProfession) {
      const titles: Record<string, string> = {
        prof_dokter: 'Dokter Gigi Cilik',
        prof_perawat: 'Perawat Gigi Ceria',
        prof_ilmuwan: 'Ilmuwan Peneliti Plak',
        prof_guru: 'Guru Kesehatan Mulut',
        prof_polisi: 'Polisi Patroli Gigi',
        prof_pemadam: 'Pemadam Kuman Asam',
        prof_pilot: 'Pilot Kapten Langit',
        prof_koki: 'Koki Master Nutrisi',
        prof_atlet: 'Atlet Basket Tangguh',
        prof_musisi: 'Musisi Bintang Rock',
      };
      return titles[profile.selectedProfession] || 'Dokter Cilik';
    }
    if (profile.selectedOutfit === 'outfit_superhero') return 'Pahlawan Pembasmi Kuman';
    if (profile.selectedOutfit === 'outfit_tuxedo') return 'Pangeran Senyum Berkelas';
    if (profile.skinMaterial === 'diamond') return 'Gigi Berlian Juara';
    if (profile.skinMaterial === 'gold') return 'Gigi Emas Kemilau';
    if (profile.skinMaterial === 'black') return 'Gigi Obsidian Tangguh';
    return 'Penjaga Enamel Nusantara';
  };

  // Helper for Tier Name matching Gambar 3 (Tingkatan Gaya)
  const getTierInfo = () => {
    const tier = profile.tier || 1;
    const names = ['', 'Biasa', 'Keren', 'Berkelas', 'Kaya', 'Mewah'];
    const stars = ['', '⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'];
    return {
      tier,
      name: names[tier] || 'Biasa',
      stars: stars[tier] || '⭐',
    };
  };

  const tierInfo = getTierInfo();

  // Carousel slides for the hero banner
  const [slideIndex, setSlideIndex] = useState(0);

  const heroSlides = [
    {
      id: 'custom_avatar',
      badge: `Tingkat ${tierInfo.tier}: ${tierInfo.name} ${tierInfo.stars}`,
      title: `${profile.name}`,
      subtitle: `${getCustomTitle()} • Panggung ${
        profile.selectedBackground ? profile.selectedBackground.toUpperCase() : 'KAMAR'
      }`,
      desc: 'Avatar kustomisasi siap beraksi! Rajin menyikat gigi 2 menit dan selesaikan kuis untuk membuka perlengkapan baru!',
      actionLabel: 'Mulai Petualangan',
      modeTarget: 'clinic',
      isCustom: true,
    },
    {
      id: 'slide_kuis',
      badge: 'Pakar Kuis Bintang',
      title: 'Teka-Teki Dokter Cilik',
      subtitle: 'Penakluk Teka-Teki & Rahasia Nutrisi Gigi Kuat',
      desc: 'Jawab pertanyaan seru seputar gigi berlubang, karang gigi, dan raih ratusan koin untuk belanjakan avatar!',
      actionLabel: 'Ikuti Kuis Cepat',
      modeTarget: 'quiz',
      isCustom: false,
    },
    {
      id: 'slide_kuman',
      badge: 'Refleks Kilat Pemburu Kuman',
      title: 'Ksatria Pembasmi Plak',
      subtitle: 'Ketuk dan Basmi Bakteri Streptococcus Mutans!',
      desc: 'Bakteri jahat berkeliaran merusak enamel! Ayo ambil sikat gigimu dan bersihkan kuman secepat kilat!',
      actionLabel: 'Lawan Kuman Sekarang',
      modeTarget: 'germ_game',
      isCustom: false,
    },
    {
      id: 'slide_forum',
      badge: 'Diskusi Komunitas & AI Pintar 🤖',
      title: 'Kolom Komentar & Tanya AI',
      subtitle: 'Ruang Terbuka Untuk Semua Orang dengan Dokter Denti AI',
      desc: 'Ada pertanyaan seputar gigi ngilu, sariawan, atau makanan sehat? Tanyakan di kolom komentar dan dapatkan jawaban akurat dari AI Dokter Gigi!',
      actionLabel: 'Buka Kolom Komentar',
      modeTarget: 'forum',
      isCustom: false,
    },
  ];

  const currentSlide = heroSlides[slideIndex];

  const handleNextSlide = () => {
    soundEffects.tap();
    setSlideIndex((slideIndex + 1) % heroSlides.length);
  };

  const handlePrevSlide = () => {
    soundEffects.tap();
    setSlideIndex((slideIndex - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleChibiVoice = (quote: string) => {
    soundEffects.tap();
    if (speechEnabled) {
      speakText(quote);
    }
  };

  // Background styling matching Gambar 3
  const getBannerBackgroundClass = () => {
    switch (profile.selectedBackground) {
      case 'angkasa':
        return 'from-[#0B0F19] via-[#1E1B4B] to-[#2E1065] border-indigo-400/50';
      case 'pantai':
        return 'from-[#0284C7] via-[#0EA5E9] to-[#0D9488] border-amber-300/50';
      case 'kastil':
        return 'from-[#4C1D95] via-[#6D28D9] to-[#B45309] border-amber-400/50';
      case 'lab':
        return 'from-[#3B0764] via-[#581C87] to-[#1E1B4B] border-purple-400/50';
      case 'klinik':
        return 'from-[#0F766E] via-[#0D9488] to-[#115E59] border-teal-300/50';
      case 'kamar':
      default:
        return 'from-[#143D37] via-[#21736A] to-[#175851] border-[#6ED5B6]/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* ========================================================
          1. HERO CHARACTER SHOWCASE BANNER (GAMBAR 1 - GENSHIN LAYOUT)
          ======================================================== */}
      <div className={`relative rounded-3xl overflow-hidden shadow-2xl border-2 text-white p-6 sm:p-8 bg-gradient-to-r ${getBannerBackgroundClass()}`}>
        {/* Starry anime dust & sparkle background */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10%" cy="20%" r="2" fill="#FFFFFF" />
            <circle cx="25%" cy="65%" r="3" fill="#6ED5B6" />
            <circle cx="45%" cy="15%" r="2" fill="#FEF08A" />
            <circle cx="70%" cy="80%" r="2.5" fill="#FFFFFF" />
            <circle cx="85%" cy="30%" r="3.5" fill="#6ED5B6" />
            <path d="M 0 100 Q 200 40 400 120 T 800 60" stroke="#6ED5B6" strokeWidth="2" fill="none" opacity="0.3" />
          </svg>
        </div>

        {/* Carousel Navigation Arrows (< and >) */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 flex items-center justify-center text-white text-xl z-20 backdrop-blur-xs transition-transform active:scale-90 cursor-pointer"
          title="Slide Sebelumnya"
        >
          ‹
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 flex items-center justify-center text-white text-xl z-20 backdrop-blur-xs transition-transform active:scale-90 cursor-pointer"
          title="Slide Berikutnya"
        >
          ›
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10 px-4 sm:px-6">
          {/* Left Text Column */}
          <div className="md:col-span-8 space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-[#0E2C27]/60 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black text-[#6ED5B6] border border-[#6ED5B6]/40 shadow-xs">
              <span>✦</span>
              <span>{currentSlide.badge}</span>
              <span className="text-[#FACC15]">★</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-['Fredoka'] tracking-tight text-[#EFF6E9] drop-shadow-md">
              {currentSlide.title}
            </h1>

            <p className="text-sm sm:text-base font-extrabold text-[#A2E7D2] leading-snug">
              {currentSlide.subtitle}
            </p>

            <p className="text-xs sm:text-sm text-white/80 font-medium max-w-lg leading-relaxed">
              {currentSlide.desc}
            </p>

            {/* Action Buttons with Gambar 4 3D icons */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => {
                  soundEffects.tap();
                  onSelectMode(currentSlide.modeTarget);
                }}
                className="bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:opacity-95 text-white px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-green-900/40 transition-transform active:scale-95 cursor-pointer border border-green-300/40"
              >
                <PlayButton3D size={24} />
                <span>{currentSlide.actionLabel}</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.tap();
                  onOpenWardrobe();
                }}
                className="bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:opacity-95 text-white px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-md shadow-orange-900/40 border border-amber-300/40"
              >
                <span>👗 Kustomisasi Avatar</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.tap();
                  onSelectMode('clinic');
                }}
                className="bg-white/15 hover:bg-white/25 text-white border border-white/30 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-transform active:scale-95 cursor-pointer backdrop-blur-xs"
              >
                <BookButton3D size={24} />
                <span>Baca Kisah Gigi</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.tap();
                  onSelectMode('forum');
                }}
                className="bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:opacity-95 text-white px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-md shadow-sky-900/40 border border-sky-300/40"
              >
                <span>💬 Kolom Komentar & Tanya AI</span>
              </button>
            </div>
          </div>

          {/* Right Mascot Artwork Column */}
          <div className="md:col-span-4 flex flex-col items-center justify-center relative">
            <div
              onClick={() => {
                soundEffects.coin();
                onOpenWardrobe();
              }}
              className="cursor-pointer group relative transition-transform hover:scale-105"
              title="Klik untuk membuka Studio Kustomisasi Avatar!"
            >
              <div className="absolute inset-0 bg-[#6ED5B6]/30 rounded-full blur-2xl group-hover:bg-[#6ED5B6]/50 transition-all" />
              <MouthToothMascot
                baseCharacter={profile.baseCharacter || 'chibi'}
                skinMaterial={profile.skinMaterial || 'white'}
                expression={profile.expression || 'senyum'}
                outfit={profile.selectedOutfit}
                heldItem={profile.selectedHand}
                hat={profile.selectedHat}
                accessory={profile.selectedAccessory}
                profession={profile.selectedProfession}
                extra={profile.selectedExtra}
                backgroundScene={profile.selectedBackground || 'kamar'}
                size="xl"
              />
            </div>
            <div className="mt-2.5 flex flex-col items-center gap-1">
              <span className="text-xs font-black bg-[#0E2C27]/85 text-[#6ED5B6] px-4 py-1.5 rounded-full border border-[#6ED5B6]/40 backdrop-blur-md shadow-sm">
                {profile.name} • {tierInfo.tier}. {tierInfo.name} {tierInfo.stars}
              </span>
              <span className="text-[10px] font-bold text-white/90 bg-black/40 px-3 py-0.5 rounded-full backdrop-blur-xs">
                {getCustomTitle()}
              </span>
            </div>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="flex items-center justify-center gap-2 pt-4 relative z-10">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSlideIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                slideIndex === idx ? 'w-8 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ========================================================
          2. DASHBOARD BODY (GAMBAR 1 - ARTWORK, RECENT SEARCH, CHIBI & LORE)
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (Artwork Gallery Cards) */}
        <div className="lg:col-span-4 bg-[#FAFDF9] rounded-3xl border-2 border-[#C4DCAC] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-[#143D37] font-['Fredoka'] flex items-center gap-1.5">
              <span>Kartu Koleksi Gigi</span>
              <span>›</span>
            </h3>
            <button
              onClick={onOpenWardrobe}
              className="text-xs font-bold text-[#21736A] hover:underline cursor-pointer"
            >
              Lihat Semua
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div
              onClick={onOpenWardrobe}
              className="bg-gradient-to-b from-[#E2F8F1] to-[#EFF6E9] p-3 rounded-2xl border-2 border-[#6ED5B6] text-center space-y-1.5 cursor-pointer hover:scale-102 transition-transform shadow-xs"
            >
              <div className="w-16 h-16 mx-auto flex items-center justify-center">
                <MouthToothMascot
                  skinMaterial={profile.skinMaterial}
                  expression={profile.expression}
                  outfit={profile.selectedOutfit}
                  heldItem={profile.selectedHand}
                  hat={profile.selectedHat}
                  accessory={profile.selectedAccessory}
                  profession={profile.selectedProfession}
                  extra={profile.selectedExtra}
                  size="sm"
                />
              </div>
              <div className="font-black text-xs text-[#143D37] font-['Fredoka'] truncate">
                {profile.name}
              </div>
              <span className="text-[10px] font-bold text-[#21736A] bg-white px-2 py-0.5 rounded-full border border-[#6ED5B6]/40 inline-block truncate w-full">
                {tierInfo.name} {tierInfo.stars}
              </span>
            </div>

            <div
              onClick={onOpenWardrobe}
              className="bg-gradient-to-b from-[#FDF0E9] to-[#EFF6E9] p-3 rounded-2xl border-2 border-[#F5B842] text-center space-y-1.5 cursor-pointer hover:scale-102 transition-transform shadow-xs"
            >
              <div className="w-16 h-16 mx-auto flex items-center justify-center text-3xl">
                🦸‍♂️👑🎀
              </div>
              <div className="font-black text-xs text-[#143D37] font-['Fredoka']">
                Trio Gigi Ceria
              </div>
              <span className="text-[10px] font-bold text-[#D97724] bg-white px-2 py-0.5 rounded-full border border-[#F5B842]/40 inline-block">
                Studio Kostum 👗
              </span>
            </div>
          </div>

          <button
            onClick={onOpenWardrobe}
            className="w-full py-2.5 bg-[#EFF6E9] hover:bg-[#E2F8F1] text-[#143D37] border border-[#C4DCAC] font-black text-xs rounded-2xl transition-colors cursor-pointer"
          >
            Buka Studio Avatar Lengkap 👗
          </button>
        </div>

        {/* Center Column (Recent Search / Misi Cepat & Chibi Emotes from Gambar 1) */}
        <div className="lg:col-span-4 bg-[#FAFDF9] rounded-3xl border-2 border-[#C4DCAC] p-5 shadow-sm space-y-4">
          <div>
            <h3 className="font-black text-base text-[#143D37] font-['Fredoka'] mb-1">
              Misi & Pencarian Cepat 🔍
            </h3>
            <p className="text-xs text-[#21736A] font-semibold">
              Mulai latihan kesehatan gigi dengan sekali ketuk
            </p>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Basmi Kuman Refleks', mode: 'germ_game', icon: '👾' },
              { label: 'Kuis Bintang 5 Soal', mode: 'quiz', icon: '❓' },
              { label: 'Piring Nutrisi Sehat', mode: 'food_game', icon: '🍎' },
              { label: 'Simulator Sikat 2 Menit', mode: 'brushing', icon: '🪥' },
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundEffects.tap();
                  onSelectMode(q.mode);
                }}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#EFF6E9] hover:bg-[#E2F8F1] border border-[#C4DCAC] hover:border-[#21736A] text-[#143D37] font-black text-xs flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🔍</span>
                  <span>{q.label}</span>
                </div>
                <span className="group-hover:translate-x-1 transition-transform">{q.icon}</span>
              </button>
            ))}
          </div>

          {/* Chibi Mascot Stickers (Gambar 1) */}
          <div className="pt-2 border-t border-[#EFF6E9]">
            <span className="text-[11px] font-black uppercase text-[#143D37] tracking-wider block mb-2">
              Stiker Ceria Gigi (Ketuk untuk Suara!):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={() => handleChibiVoice('Halo teman! Jangan lupa sikat gigi sebelum tidur malam ya!')}
                className="p-2.5 rounded-2xl bg-[#E2F8F1] border border-[#6ED5B6] flex items-center gap-2 cursor-pointer hover:scale-102 transition-transform"
              >
                <span className="text-2xl animate-bounce-gentle">😁</span>
                <div className="text-[10px] font-bold text-[#143D37] leading-tight">
                  "Semangat Sikat Gigi!"
                </div>
              </div>

              <div
                onClick={() => handleChibiVoice('Zzz... Bersihkan kuman dulu sebelum tidur nyenyak!')}
                className="p-2.5 rounded-2xl bg-[#FAF2E8] border border-[#F5B842] flex items-center gap-2 cursor-pointer hover:scale-102 transition-transform"
              >
                <span className="text-2xl">😴</span>
                <div className="text-[10px] font-bold text-[#8F4619] leading-tight">
                  "Tidur Nyenyak Bebas Kuman"
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Lore / Elemen Pengetahuan Gigi (Gambar 1 style: Cryo / Sumeru / Akademiya) */}
        <div className="lg:col-span-4 bg-[#FAFDF9] rounded-3xl border-2 border-[#C4DCAC] p-5 shadow-sm space-y-3">
          <h3 className="font-black text-base text-[#143D37] font-['Fredoka']">
            Ensiklopedia Elemen Gigi 🌟
          </h3>

          <div className="space-y-2.5">
            <div
              onClick={() => onSelectMode('clinic')}
              className="p-3 rounded-2xl bg-[#E2F8F1] border border-[#6ED5B6] flex items-center gap-3 cursor-pointer hover:bg-[#CEF2E7] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs">
                <Shield3D size={28} />
              </div>
              <div className="flex-1">
                <div className="font-black text-xs text-[#143D37]">Perisai Enamel Gigi</div>
                <div className="text-[11px] text-[#21736A] font-semibold leading-tight">
                  Lapisan terkeras di tubuh pelindung kuman
                </div>
              </div>
            </div>

            <div
              onClick={() => onSelectMode('brushing')}
              className="p-3 rounded-2xl bg-[#EFF6E9] border border-[#AEC892] flex items-center gap-3 cursor-pointer hover:bg-[#E2F8F1] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs">
                <Toothbrush3D size={28} />
              </div>
              <div className="flex-1">
                <div className="font-black text-xs text-[#143D37]">Aturan 2 Menit Donat</div>
                <div className="text-[11px] text-[#21736A] font-semibold leading-tight">
                  Gerakan memutar bulat-bulat sampai berbusa
                </div>
              </div>
            </div>

            <div
              onClick={() => onSelectMode('food_game')}
              className="p-3 rounded-2xl bg-[#FAF2E8] border border-[#F5B842] flex items-center gap-3 cursor-pointer hover:bg-[#FBE4D6] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs">
                <Apple3D size={28} />
              </div>
              <div className="flex-1">
                <div className="font-black text-xs text-[#143D37]">Nutrisi Kalsium Super</div>
                <div className="text-[11px] text-[#8F4619] font-semibold leading-tight">
                  Susu, keju & buah renyah pembersih alami
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. MAIN GAME MODES GRID (GAMBAR 4 - 3D GAME ICONS)
          ======================================================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <h2 className="text-xl sm:text-2xl font-black text-[#143D37] font-['Fredoka']">
              Zona Permainan & Belajar
            </h2>
          </div>
          <span className="text-xs font-black text-[#21736A] bg-[#E2F8F1] px-3.5 py-1.5 rounded-full border border-[#6ED5B6]">
            Pilih Misimu Hari Ini! ⭐
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              id: 'clinic',
              title: 'Klinik Gigi & Ensiklopedia',
              desc: 'Pelajari 7+ penyakit gigi & mulut, penyebab kuman, serta pencegahannya.',
              icon: <ToothHealthy3D size={44} />,
              tag: 'Edukasi Lengkap',
              badge: `${profile.exploredDiseases.length}/7 Materi`,
              bg: 'bg-[#EFF6E9] border-[#AEC892]',
            },
            {
              id: 'quiz',
              title: 'Kuis Bintang Dokter Cilik',
              desc: 'Jawab kuis interaktif, raih koin emas dan bintang senyum berlimpah!',
              icon: <Star3D size={44} />,
              tag: 'Banjir Koin 🪙',
              badge: `${profile.completedQuizzes} Kuis Selesai`,
              bg: 'bg-[#FAF2E8] border-[#F5B842]',
            },
            {
              id: 'germ_game',
              title: 'Basmi Kuman Gigi!',
              desc: 'Ketuk kuman karies dan plak sebelum merusak enamel gigimu!',
              icon: <Bacteria3D size={44} />,
              tag: 'Laga Refleks ⚡',
              badge: `Rekor: ${profile.germBusterHighScore} Poin`,
              bg: 'bg-[#FDF0E9] border-[#D97724]',
            },
            {
              id: 'food_game',
              title: 'Piring Sahabat Gigi',
              desc: 'Pilah makanan sehat penguat gigi vs makanan manis perusak gigi!',
              icon: <Apple3D size={44} />,
              tag: 'Tantangan Nutrisi',
              badge: 'Keluarga Makanan',
              bg: 'bg-[#E2F8F1] border-[#6ED5B6]',
            },
            {
              id: 'brushing',
              title: 'Simulator Sikat Gigi 2 Menit',
              desc: 'Panduan sikat gigi 4 kuadran dengan timer ceria dan suara ritmis.',
              icon: <Toothbrush3D size={44} />,
              tag: 'Kebiasaan Baik',
              badge: `${profile.brushingSessionsCompleted}x Bersih`,
              bg: 'bg-[#EFF6E9] border-[#6ED5B6]',
            },
            {
              id: 'leaderboard',
              title: 'Papan Peringkat Juara',
              desc: 'Kompetisi sehat para pahlawan senyum cilik se-Nusantara!',
              icon: <Trophy3D size={44} />,
              tag: 'Peringkat Bintang',
              badge: `${profile.score} Poin`,
              bg: 'bg-[#FFFBE8] border-[#FACC15]',
            },
            {
              id: 'forum',
              title: 'Kolom Komentar & Tanya AI',
              desc: 'Tanya jawab terbuka untuk semua orang, berdiskusi & dijawab langsung oleh Dokter Denti AI!',
              icon: <span className="text-4xl">💬</span>,
              tag: 'Akses Semua Orang 🌐',
              badge: 'Gemini AI 🤖',
              bg: 'bg-[#E0F2FE] border-[#38BDF8]',
            },
          ].map(game => (
            <div
              key={game.id}
              onClick={() => {
                soundEffects.tap();
                if (game.id === 'leaderboard') {
                  onOpenLeaderboard();
                } else {
                  onSelectMode(game.id);
                }
              }}
              className={`p-5 rounded-3xl border-2 transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer ${game.bg} flex flex-col justify-between gap-3`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-white rounded-2xl shadow-xs border border-black/5">
                    {game.icon}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase bg-white px-2.5 py-0.5 rounded-full border border-black/10 text-[#143D37] block">
                      {game.tag}
                    </span>
                    <span className="text-xs font-black text-[#21736A] mt-1 block">
                      {game.badge}
                    </span>
                  </div>
                </div>

                <h3 className="font-black text-lg text-[#143D37] font-['Fredoka']">
                  {game.title}
                </h3>
                <p className="text-xs text-[#143D37]/75 font-semibold mt-1 leading-snug">
                  {game.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-black/5">
                <span className="text-xs font-black text-[#21736A] flex items-center gap-1">
                  Mainkan Sekarang →
                </span>
                <span className="text-base">✨</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
