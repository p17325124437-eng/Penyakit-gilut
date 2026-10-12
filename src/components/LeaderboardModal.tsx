import React, { useState, useEffect } from 'react';
import { ChildProfile } from '../types';
import { soundEffects } from '../utils/audio';

interface LeaderboardProps {
  profile: ChildProfile;
  onBack: () => void;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  stars: number;
  avatar: string;
  level: string;
}

export const LeaderboardModal: React.FC<LeaderboardProps> = ({ profile, onBack }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([
    { id: '1', name: 'Alif Dokter Gigi Cilik', score: 3450, stars: 48, avatar: 'hero', level: 'Juara Senyum 🏆' },
    { id: '2', name: 'Nayla Gigi Berlian', score: 2980, stars: 42, avatar: 'fairy', level: 'Pakar Gigi ⭐' },
    { id: '3', name: 'Kenza Pahlawan Senyum', score: 2600, stars: 39, avatar: 'detective', level: 'Pembasmi Kuman 🛡️' },
    { id: '4', name: 'Rafa Sikat Kilat', score: 2250, stars: 35, avatar: 'space', level: 'Pemberantas Plak 🚀' },
    { id: '5', name: 'Zahra Putri Bersih', score: 1890, stars: 29, avatar: 'queen', level: 'Sahabat Dokter 👑' },
  ]);

  useEffect(() => {
    // Fetch from server if online
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (data.leaderboard && Array.isArray(data.leaderboard)) {
          // Merge current user into list
          const list = [...data.leaderboard];
          const hasUser = list.some(item => item.name === profile.name);
          if (!hasUser) {
            list.push({
              id: 'current_user',
              name: profile.name,
              score: profile.score,
              stars: profile.stars,
              avatar: 'tooth',
              level: 'Dokter Cilik Hebat ✨',
            });
          }
          list.sort((a, b) => b.score - a.score);
          setEntries(list);
        }
      })
      .catch(() => {
        // Offline fallback - add user to offline list
        setEntries(prev => {
          const list = [...prev];
          const hasUser = list.some(item => item.name === profile.name);
          if (!hasUser) {
            list.push({
              id: 'current_user',
              name: profile.name,
              score: profile.score,
              stars: profile.stars,
              avatar: 'tooth',
              level: 'Dokter Cilik Hebat ✨',
            });
          }
          list.sort((a, b) => b.score - a.score);
          return list;
        });
      });
  }, [profile.name, profile.score, profile.stars]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 bg-[#FAFDF9] p-4 rounded-3xl border-2 border-[#C4DCAC] shadow-sm">
        <button
          onClick={() => {
            soundEffects.tap();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#EFF6E9] hover:bg-[#E2F8F1] text-[#143D37] font-extrabold text-xs border border-[#C4DCAC] transition-transform active:scale-95 cursor-pointer"
        >
          <span>←</span>
          <span>Kembali</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-[#143D37] font-['Fredoka']">
            Papan Peringkat Bintang 🏆
          </h2>
          <div className="text-xs text-[#21736A] font-medium">
            Kompetisi sehat para pahlawan gigi se-Nusantara!
          </div>
        </div>

        <div className="bg-[#E2F8F1] text-[#143D37] font-black text-xs px-3.5 py-1.5 rounded-2xl border border-[#6ED5B6]">
          Skormu: {profile.score}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 items-end pt-4 pb-2">
        {/* 2nd place */}
        {entries[1] && (
          <div className="bg-[#FAFDF9] rounded-3xl border-2 border-[#AEC892] p-3 sm:p-4 text-center shadow-sm relative pt-6">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">🥈</span>
            <div className="text-2xl sm:text-3xl mb-1">🦷</div>
            <div className="font-extrabold text-xs sm:text-sm text-[#143D37] line-clamp-1">
              {entries[1].name}
            </div>
            <div className="text-xs font-black text-[#D97724] mt-1">
              {entries[1].score} Poin
            </div>
            <span className="text-[10px] text-[#21736A] font-bold block mt-0.5">Juara 2</span>
          </div>
        )}

        {/* 1st place */}
        {entries[0] && (
          <div className="bg-gradient-to-b from-[#FAF2E8] to-[#FEE8A2]/50 rounded-3xl border-3 border-[#F5B842] p-4 sm:p-5 text-center shadow-md relative pt-8 -translate-y-2">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl">👑</span>
            <div className="text-3xl sm:text-4xl mb-1">🦷✨</div>
            <div className="font-black text-sm sm:text-base text-[#8F4619] line-clamp-1 font-['Fredoka']">
              {entries[0].name}
            </div>
            <div className="text-sm font-black text-[#8F4619] mt-1">
              {entries[0].score} Poin
            </div>
            <span className="text-[11px] font-black text-[#8F4619] bg-[#FAF2E8] border border-[#F5B842]/60 px-2.5 py-0.5 rounded-full inline-block mt-1">
              Juara Utama 🥇
            </span>
          </div>
        )}

        {/* 3rd place */}
        {entries[2] && (
          <div className="bg-[#FAFDF9] rounded-3xl border-2 border-[#D97724]/50 p-3 sm:p-4 text-center shadow-sm relative pt-6">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">🥉</span>
            <div className="text-2xl sm:text-3xl mb-1">🦷</div>
            <div className="font-extrabold text-xs sm:text-sm text-[#143D37] line-clamp-1">
              {entries[2].name}
            </div>
            <div className="text-xs font-black text-[#D97724] mt-1">
              {entries[2].score} Poin
            </div>
            <span className="text-[10px] text-[#B86230] font-bold block mt-0.5">Juara 3</span>
          </div>
        )}
      </div>

      {/* Full Leaderboard List */}
      <div className="bg-[#FAFDF9] rounded-3xl border-2 border-[#C4DCAC] p-4 shadow-sm space-y-2">
        {entries.map((entry, idx) => {
          const isCurrentUser = entry.name === profile.name;
          return (
            <div
              key={entry.id || idx}
              className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 border transition-all ${
                isCurrentUser
                  ? 'bg-[#E2F8F1] border-[#21736A] ring-2 ring-[#6ED5B6] shadow-xs'
                  : 'bg-white/80 border-[#C4DCAC]/60 hover:bg-[#EFF6E9]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                    idx === 0
                      ? 'bg-[#F5B842] text-[#8F4619]'
                      : idx === 1
                      ? 'bg-[#C4DCAC] text-[#143D37]'
                      : idx === 2
                      ? 'bg-[#D97724] text-white'
                      : 'bg-[#EFF6E9] text-[#143D37]'
                  }`}
                >
                  {idx + 1}
                </span>

                <div className="text-2xl">🦷</div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm text-[#143D37]">
                      {entry.name}
                    </span>
                    {isCurrentUser && (
                      <span className="text-[10px] font-black bg-[#21736A] text-white px-2 py-0.5 rounded-full">
                        Kamu
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#21736A] font-medium">
                    {entry.level}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-black text-sm text-[#8F4619]">
                    {entry.score} Poin
                  </div>
                  <div className="text-[11px] font-bold text-[#D97724] flex items-center justify-end gap-1">
                    <span>⭐</span>
                    <span>{entry.stars}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
