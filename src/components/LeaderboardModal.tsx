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
            Papan Peringkat Bintang 🏆
          </h2>
          <div className="text-xs text-slate-500 font-medium">
            Kompetisi sehat para pahlawan gigi se-Nusantara!
          </div>
        </div>

        <div className="bg-purple-50 text-purple-700 font-black text-xs px-3 py-1.5 rounded-2xl border border-purple-200">
          Skormu: {profile.score}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 items-end pt-4 pb-2">
        {/* 2nd place */}
        {entries[1] && (
          <div className="bg-white rounded-3xl border-2 border-slate-300 p-3 sm:p-4 text-center shadow-sm relative pt-6">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">🥈</span>
            <div className="text-2xl sm:text-3xl mb-1">🦷</div>
            <div className="font-extrabold text-xs sm:text-sm text-slate-800 line-clamp-1">
              {entries[1].name}
            </div>
            <div className="text-xs font-black text-amber-600 mt-1">
              {entries[1].score} Poin
            </div>
            <span className="text-[10px] text-slate-500 font-bold block mt-0.5">Juara 2</span>
          </div>
        )}

        {/* 1st place */}
        {entries[0] && (
          <div className="bg-gradient-to-b from-amber-50 to-yellow-100 rounded-3xl border-3 border-amber-300 p-4 sm:p-5 text-center shadow-md relative pt-8 -translate-y-2">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl">👑</span>
            <div className="text-3xl sm:text-4xl mb-1">🦷✨</div>
            <div className="font-black text-sm sm:text-base text-amber-950 line-clamp-1 font-['Fredoka']">
              {entries[0].name}
            </div>
            <div className="text-sm font-black text-amber-700 mt-1">
              {entries[0].score} Poin
            </div>
            <span className="text-[11px] font-black text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full inline-block mt-1">
              Juara Utama 🥇
            </span>
          </div>
        )}

        {/* 3rd place */}
        {entries[2] && (
          <div className="bg-white rounded-3xl border-2 border-amber-600/40 p-3 sm:p-4 text-center shadow-sm relative pt-6">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">🥉</span>
            <div className="text-2xl sm:text-3xl mb-1">🦷</div>
            <div className="font-extrabold text-xs sm:text-sm text-slate-800 line-clamp-1">
              {entries[2].name}
            </div>
            <div className="text-xs font-black text-amber-600 mt-1">
              {entries[2].score} Poin
            </div>
            <span className="text-[10px] text-slate-500 font-bold block mt-0.5">Juara 3</span>
          </div>
        )}
      </div>

      {/* Full Leaderboard List */}
      <div className="bg-white rounded-3xl border-2 border-slate-100 p-4 shadow-sm space-y-2">
        {entries.map((entry, idx) => {
          const isCurrentUser = entry.name === profile.name;
          return (
            <div
              key={entry.id || idx}
              className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 border transition-all ${
                isCurrentUser
                  ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                    idx === 0
                      ? 'bg-amber-400 text-slate-900'
                      : idx === 1
                      ? 'bg-slate-300 text-slate-800'
                      : idx === 2
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {idx + 1}
                </span>

                <div className="text-2xl">🦷</div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm text-slate-800">
                      {entry.name}
                    </span>
                    {isCurrentUser && (
                      <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.2 rounded-full">
                        Kamu
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {entry.level}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-black text-sm text-amber-700">
                    {entry.score} Poin
                  </div>
                  <div className="text-[11px] font-bold text-yellow-600 flex items-center justify-end gap-1">
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
