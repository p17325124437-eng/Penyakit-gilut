import React, { useState } from 'react';
import { ChildProfile, ParentSettings, DailyPlayTracker } from '../types';
import {
  syncUploadToCloud,
  syncDownloadFromCloud,
  sendWeeklyReportEmail,
  getStoredSyncCode,
  saveProfileToStorage,
  saveParentSettings,
} from '../utils/syncManager';
import { soundEffects } from '../utils/audio';

interface ParentDashboardProps {
  profile: ChildProfile;
  settings: ParentSettings;
  dailyTracker: DailyPlayTracker;
  isOnline: boolean;
  onUpdateProfile: (profile: ChildProfile) => void;
  onUpdateSettings: (settings: ParentSettings) => void;
  onClose: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  profile,
  settings,
  dailyTracker,
  isOnline,
  onUpdateProfile,
  onUpdateSettings,
  onClose,
}) => {
  // Security gate PIN / Math check
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<'progress' | 'screen_time' | 'reminders' | 'email_report' | 'sync'>('progress');

  // Sync state
  const syncCode = getStoredSyncCode();
  const [inputSyncCode, setInputSyncCode] = useState('');
  const [syncStatusMsg, setSyncStatusMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Email report state
  const [parentEmail, setParentEmail] = useState(settings.parentEmail || 'nazda107@gmail.com');
  const [emailStatusMsg, setEmailStatusMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Edit child nickname
  const [editingName, setEditingName] = useState(profile.name);

  // Math challenge for quick entry: e.g. 8 + 7 = 15
  const mathQuestion = { q: '8 + 7', a: 15 };

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === settings.pin || pinInput.trim() === String(mathQuestion.a)) {
      soundEffects.correct();
      setIsUnlocked(true);
      setPinError(false);
    } else {
      soundEffects.wrong();
      setPinError(true);
    }
  };

  const handleTimeLimitChange = (minutes: number) => {
    soundEffects.tap();
    const updated = { ...settings, dailyTimeLimitMinutes: minutes };
    onUpdateSettings(updated);
    saveParentSettings(updated);
  };

  const handleToggleReminder = () => {
    soundEffects.tap();
    const updated = { ...settings, remindersActive: !settings.remindersActive };
    onUpdateSettings(updated);
    saveParentSettings(updated);
  };

  const handleReminderTimeChange = (type: 'morning' | 'night', time: string) => {
    const updated = {
      ...settings,
      morningReminderTime: type === 'morning' ? time : settings.morningReminderTime,
      nightReminderTime: type === 'night' ? time : settings.nightReminderTime,
    };
    onUpdateSettings(updated);
    saveParentSettings(updated);
  };

  const handleSaveChildName = () => {
    if (!editingName.trim()) return;
    soundEffects.tap();
    const updated = { ...profile, name: editingName.trim() };
    onUpdateProfile(updated);
    saveProfileToStorage(updated);
  };

  // Cloud Sync Handler (Upload)
  const handleUploadSync = async () => {
    setIsSyncing(true);
    setSyncStatusMsg(null);
    const res = await syncUploadToCloud(syncCode, profile, settings);
    setIsSyncing(false);
    if (res.success) {
      soundEffects.fanfare();
      setSyncStatusMsg({ text: res.message });
    } else {
      soundEffects.wrong();
      setSyncStatusMsg({ text: res.message, isError: true });
    }
  };

  // Cloud Sync Handler (Download from code)
  const handleDownloadSync = async () => {
    if (!inputSyncCode.trim()) return;
    setIsSyncing(true);
    setSyncStatusMsg(null);
    const res = await syncDownloadFromCloud(inputSyncCode.trim());
    setIsSyncing(false);
    if (res.success && res.profile && res.settings) {
      soundEffects.fanfare();
      onUpdateProfile(res.profile);
      onUpdateSettings(res.settings);
      saveProfileToStorage(res.profile);
      saveParentSettings(res.settings);
      setSyncStatusMsg({ text: res.message });
    } else {
      soundEffects.wrong();
      setSyncStatusMsg({ text: res.message, isError: true });
    }
  };

  // Send Weekly Report to Parent Email
  const handleSendEmailReport = async () => {
    if (!parentEmail.trim()) return;
    setIsSendingEmail(true);
    setEmailStatusMsg(null);

    const reportSummary = {
      date: new Date().toLocaleDateString('id-ID'),
      childName: profile.name,
      totalQuizzes: profile.completedQuizzes,
      accuracyRate: profile.totalQuestionsAnswered > 0
        ? Math.round((profile.correctAnswers / profile.totalQuestionsAnswered) * 100)
        : 100,
      brushingSessions: profile.brushingSessionsCompleted,
      exploredDiseasesCount: profile.exploredDiseases.length,
      currentCoins: profile.coins,
      currentStars: profile.stars,
      streakDays: profile.streakDays,
    };

    const res = await sendWeeklyReportEmail(parentEmail.trim(), profile.name, reportSummary);
    setIsSendingEmail(false);
    if (res.success) {
      soundEffects.fanfare();
      setEmailStatusMsg({ text: res.message });
      // Update saved email
      const updated = { ...settings, parentEmail: parentEmail.trim() };
      onUpdateSettings(updated);
      saveParentSettings(updated);
    } else {
      soundEffects.wrong();
      setEmailStatusMsg({ text: res.message, isError: true });
    }
  };

  // Test Notification Trigger
  const handleTestNotification = async () => {
    soundEffects.tap();
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        new Notification('Dentika: Waktunya Sikat Gigi! 🪥✨', {
          body: `Halo Ayah/Bunda! Saatnya mengingatkan ${profile.name} menyikat gigi selama 2 menit.`,
          icon: '/favicon.ico',
        });
      } else {
        alert('Izin notifikasi belum diaktifkan di browser Anda.');
      }
    }
  };

  // PIN Lock Screen
  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 bg-[#143D37]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#FAFDF9] rounded-3xl border-2 border-[#C4DCAC] p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-[#143D37] to-[#21736A] text-white rounded-2xl flex items-center justify-center text-3xl shadow-md shadow-[#143D37]/30">
            🔒
          </div>

          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-[#143D37] font-['Fredoka']">
              Pojok Orang Tua
            </h3>
            <p className="text-xs sm:text-sm text-[#143D37]/75 font-medium">
              Area khusus orang tua untuk memantau kemajuan anak, mengatur batas waktu, dan sinkronisasi.
            </p>
          </div>

          <div className="p-3 bg-[#EFF6E9] border border-[#C4DCAC] rounded-2xl text-xs text-[#143D37] font-semibold">
            Masukkan PIN default <span className="font-bold text-[#143D37]">1234</span> atau jawab teka-teki: <span className="font-bold text-[#21736A]">{mathQuestion.q} = ?</span>
          </div>

          <form onSubmit={handleUnlockPin} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              placeholder="Masukkan PIN (1234) atau 15"
              value={pinInput}
              onChange={e => setPinInput(e.target.value)}
              className="w-full text-center text-xl tracking-widest py-3 px-4 rounded-2xl border-2 border-[#C4DCAC] focus:border-[#21736A] focus:outline-hidden font-bold bg-white text-[#143D37]"
              autoFocus
            />

            {pinError && (
              <p className="text-xs font-bold text-[#D95B43]">
                PIN salah. Silakan coba lagi (Default: 1234).
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl font-extrabold text-sm text-[#143D37] bg-[#EFF6E9] hover:bg-[#E2F8F1] border border-[#C4DCAC] transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-[#21736A] to-[#143D37] hover:opacity-95 transition-opacity shadow-md shadow-[#143D37]/25 cursor-pointer"
              >
                Buka Dasbor
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Calculate stats
  const accuracyPercent = profile.totalQuestionsAnswered > 0
    ? Math.round((profile.correctAnswers / profile.totalQuestionsAnswered) * 100)
    : 100;
  const minutesPlayedToday = Math.floor(dailyTracker.secondsPlayedToday / 60);

  return (
    <div className="fixed inset-0 bg-[#143D37]/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#FAFDF9] rounded-3xl border-2 border-[#C4DCAC] max-w-4xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#143D37] via-[#21736A] to-[#175851] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-xl">
              🛡️
            </div>
            <div>
              <h2 className="font-extrabold text-lg sm:text-xl font-['Fredoka']">
                Dasbor & Kendali Orang Tua
              </h2>
              <div className="text-xs text-[#E2F8F1]/80">
                Memantau perkembangan belajar {profile.name} secara berkala
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundEffects.tap();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-lg font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#C4DCAC] bg-[#EFF6E9] px-4 gap-1 overflow-x-auto">
          {[
            { id: 'progress', label: 'Kemajuan Belajar', icon: '📊' },
            { id: 'screen_time', label: 'Batas Durasi', icon: '⏱️' },
            { id: 'reminders', label: 'Pengingat Sikat', icon: '⏰' },
            { id: 'email_report', label: 'Laporan Email', icon: '📧' },
            { id: 'sync', label: 'Sinkronisasi Cloud', icon: '☁️' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                soundEffects.tap();
                setActiveTab(tab.id as any);
              }}
              className={`px-3.5 py-3 font-extrabold text-xs sm:text-sm whitespace-nowrap flex items-center gap-1.5 transition-colors border-b-2 -mb-px cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#21736A] text-[#143D37] bg-[#FAFDF9]'
                  : 'border-transparent text-[#143D37]/70 hover:text-[#143D37]'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: KEMAJUAN BELAJAR */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              {/* Profile Card & Edit Name */}
              <div className="bg-[#EFF6E9] p-4 rounded-2xl border border-[#C4DCAC] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#C4DCAC] flex items-center justify-center text-3xl shadow-xs">
                    🦷
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#21736A]">Nama Panggilan Anak:</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <input
                        type="text"
                        value={editingName}
                        onChange={e => setEditingName(e.target.value)}
                        className="font-black text-base text-[#143D37] px-2.5 py-1 rounded-lg border border-[#C4DCAC] focus:border-[#21736A] focus:outline-hidden bg-white"
                      />
                      <button
                        onClick={handleSaveChildName}
                        className="px-3 py-1 bg-[#21736A] hover:bg-[#143D37] text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Simpan
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold text-[#143D37]">
                  <div>
                    <span className="text-[#143D37]/60 block">Koin Diperoleh</span>
                    <span className="text-[#8F4619] font-black text-sm">{profile.coins} 🪙</span>
                  </div>
                  <div>
                    <span className="text-[#143D37]/60 block">Bintang Senyum</span>
                    <span className="text-[#D97724] font-black text-sm">{profile.stars} ⭐</span>
                  </div>
                  <div>
                    <span className="text-[#143D37]/60 block">Streak Belajar</span>
                    <span className="text-[#D95B43] font-black text-sm">{profile.streakDays} Hari 🔥</span>
                  </div>
                </div>
              </div>

              {/* Real-time Visual Progress Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-[#E2F8F1] border border-[#6ED5B6] p-4 rounded-2xl space-y-1">
                  <div className="text-2xl">📚</div>
                  <div className="text-2xl font-black text-[#143D37]">
                    {profile.exploredDiseases.length} / 7
                  </div>
                  <div className="text-xs font-bold text-[#175851]">
                    Penyakit Dipelajari
                  </div>
                  <div className="w-full bg-[#A2E7D2] h-2 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-[#21736A] h-full rounded-full"
                      style={{ width: `${(profile.exploredDiseases.length / 7) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-[#FAF2E8] border border-[#F5B842] p-4 rounded-2xl space-y-1">
                  <div className="text-2xl">🎯</div>
                  <div className="text-2xl font-black text-[#8F4619]">
                    {accuracyPercent}%
                  </div>
                  <div className="text-xs font-bold text-[#8F4619]">
                    Akurasi Jawaban Kuis
                  </div>
                  <div className="text-[11px] text-[#BF7E43] font-semibold">
                    {profile.correctAnswers} benar dari {profile.totalQuestionsAnswered} soal
                  </div>
                </div>

                <div className="bg-[#EFF6E9] border border-[#AEC892] p-4 rounded-2xl space-y-1">
                  <div className="text-2xl">🪥</div>
                  <div className="text-2xl font-black text-[#143D37]">
                    {profile.brushingSessionsCompleted}x
                  </div>
                  <div className="text-xs font-bold text-[#175851]">
                    Sikat Gigi 2 Menit Selesai
                  </div>
                  <div className="text-[11px] text-[#21736A] font-semibold">
                    Rutin pagi & malam hari
                  </div>
                </div>

                <div className="bg-[#FDF0E9] border border-[#D97724] p-4 rounded-2xl space-y-1">
                  <div className="text-2xl">⏱️</div>
                  <div className="text-2xl font-black text-[#8F4619]">
                    {minutesPlayedToday} Menit
                  </div>
                  <div className="text-xs font-bold text-[#8F4619]">
                    Durasi Layar Hari Ini
                  </div>
                  <div className="text-[11px] text-[#B86230] font-semibold">
                    Batas: {settings.dailyTimeLimitMinutes > 0 ? `${settings.dailyTimeLimitMinutes}m` : 'Bebas'}
                  </div>
                </div>
              </div>

              {/* Mastered topics list */}
              <div className="bg-white border border-[#C4DCAC] p-4 rounded-2xl space-y-3">
                <h4 className="font-extrabold text-sm text-[#143D37]">
                  Status Penguasaan Materi Penyakit Gigi:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'karies', name: 'Gigi Berlubang (Karies Gigi)' },
                    { id: 'karang_gigi', name: 'Karang Gigi & Plak (Kalkulus)' },
                    { id: 'gingivitis', name: 'Radang Gusi (Gingivitis)' },
                    { id: 'sariawan', name: 'Sariawan (Stomatitis)' },
                    { id: 'bau_mulut', name: 'Bau Mulut (Halitosis)' },
                    { id: 'gigi_sensitif', name: 'Gigi Sensitif & Ngilu' },
                    { id: 'erosi_asam', name: 'Erosi Gigi & Asam' },
                  ].map(topic => {
                    const isDone = profile.exploredDiseases.includes(topic.id);
                    return (
                      <div
                        key={topic.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between ${
                          isDone
                            ? 'bg-[#E2F8F1] border-[#6ED5B6] text-[#143D37] font-bold'
                            : 'bg-[#EFF6E9]/60 border-[#C4DCAC]/60 text-[#143D37]/50'
                        }`}
                      >
                        <span>{topic.name}</span>
                        <span>{isDone ? '✅ Dikuasai' : '⏳ Belum'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KENDALI DURASI LAYAR */}
          {activeTab === 'screen_time' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-black text-lg text-[#143D37] font-['Fredoka']">
                  Batas Durasi Penggunaan Aplikasi Harian
                </h3>
                <p className="text-xs sm:text-sm text-[#143D37]/75 font-medium">
                  Lindungi kesehatan mata dan atur waktu layar (screen time) anak. Saat batas waktu tercapai, aplikasi akan menampilkan layar istirahat.
                </p>
              </div>

              {/* Screen time choices */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { mins: 15, label: '15 Menit', tag: 'Sesi Singkat' },
                  { mins: 30, label: '30 Menit', tag: 'Dianjurkan (Ideal)' },
                  { mins: 45, label: '45 Menit', tag: 'Sesi Sedang' },
                  { mins: 60, label: '60 Menit', tag: '1 Jam Penuh' },
                  { mins: 0, label: 'Tanpa Batas', tag: 'Bebas Akses' },
                ].map(opt => (
                  <button
                    key={opt.mins}
                    onClick={() => handleTimeLimitChange(opt.mins)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      settings.dailyTimeLimitMinutes === opt.mins
                        ? 'border-[#21736A] bg-[#21736A] text-white shadow-md'
                        : 'border-[#C4DCAC] bg-white hover:border-[#6ED5B6] text-[#143D37]'
                    }`}
                  >
                    <div className="font-black text-lg font-['Fredoka']">
                      {opt.label}
                    </div>
                    <div className={`text-xs mt-1 ${settings.dailyTimeLimitMinutes === opt.mins ? 'text-[#E2F8F1]' : 'text-[#143D37]/60'}`}>
                      {opt.tag}
                    </div>
                  </button>
                ))}
              </div>

              {/* Audio Controls */}
              <div className="bg-[#EFF6E9] p-4 rounded-2xl border border-[#C4DCAC] space-y-3">
                <h4 className="font-bold text-sm text-[#143D37]">Pengaturan Suara</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-[#143D37]">
                      Narasi Suara Otomatis (Text-to-Speech)
                    </div>
                    <div className="text-xs text-[#143D37]/70">
                      Membacakan pertanyaan kuis dan materi untuk anak usia dini
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.speechAudioEnabled}
                    onChange={e => {
                      const updated = { ...settings, speechAudioEnabled: e.target.checked };
                      onUpdateSettings(updated);
                      saveParentSettings(updated);
                    }}
                    className="w-5 h-5 accent-[#21736A] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PENGINGAT SIKAT GIGI */}
          {activeTab === 'reminders' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-black text-lg text-[#143D37] font-['Fredoka']">
                  Notifikasi Pengingat Harian Otomatis
                </h3>
                <p className="text-xs sm:text-sm text-[#143D37]/75 font-medium">
                  Atur jadwal pengingat sikat gigi pagi setelah sarapan dan malam sebelum tidur.
                </p>
              </div>

              <div className="bg-white border border-[#C4DCAC] p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#EFF6E9] pb-3">
                  <div>
                    <div className="font-black text-sm text-[#143D37]">
                      Status Notifikasi Pengingat
                    </div>
                    <div className="text-xs text-[#143D37]/70">
                      Kirim pemberitahuan ke perangkat saat jam sikat gigi tiba
                    </div>
                  </div>
                  <button
                    onClick={handleToggleReminder}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                      settings.remindersActive
                        ? 'bg-[#21736A] text-white'
                        : 'bg-[#EFF6E9] text-[#143D37] border border-[#C4DCAC]'
                    }`}
                  >
                    {settings.remindersActive ? 'Aktif ✓' : 'Nonaktif ✖'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-[#EFF6E9] border border-[#C4DCAC] space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs text-[#143D37]">
                      <span>🌅</span>
                      <span>Sikat Gigi Pagi (Setelah Sarapan)</span>
                    </div>
                    <input
                      type="time"
                      value={settings.morningReminderTime}
                      onChange={e => handleReminderTimeChange('morning', e.target.value)}
                      className="w-full p-2 rounded-lg border border-[#C4DCAC] font-black text-[#143D37] text-base bg-white"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#EFF6E9] border border-[#C4DCAC] space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs text-[#143D37]">
                      <span>🌙</span>
                      <span>Sikat Gigi Malam (Sebelum Tidur)</span>
                    </div>
                    <input
                      type="time"
                      value={settings.nightReminderTime}
                      onChange={e => handleReminderTimeChange('night', e.target.value)}
                      className="w-full p-2 rounded-lg border border-[#C4DCAC] font-black text-[#143D37] text-base bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleTestNotification}
                    className="px-4 py-2.5 bg-[#EFF6E9] hover:bg-[#E2F8F1] text-[#143D37] font-bold text-xs rounded-xl flex items-center gap-2 border border-[#C4DCAC] cursor-pointer"
                  >
                    <span>🔔</span>
                    <span>Uji Coba Kirim Notifikasi Pengingat</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LAPORAN PRESTASI MINGGUAN KE EMAIL */}
          {activeTab === 'email_report' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-black text-lg text-[#143D37] font-['Fredoka']">
                  Sistem Laporan Prestasi Mingguan ke Email
                </h3>
                <p className="text-xs sm:text-sm text-[#143D37]/75 font-medium">
                  Dapatkan rangkuman pencapaian anak, akurasi kuis, kebiasaan sikat gigi, dan rekomendasi langsung ke email Anda.
                </p>
              </div>

              {/* Email Form */}
              <div className="bg-[#EFF6E9] p-5 rounded-2xl border border-[#C4DCAC] space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#143D37] block">
                    Alamat Email Orang Tua:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="contoh: ayah.bunda@gmail.com"
                      value={parentEmail}
                      onChange={e => setParentEmail(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#C4DCAC] font-bold text-[#143D37] text-sm focus:border-[#21736A] focus:outline-hidden bg-white"
                    />
                    <button
                      onClick={handleSendEmailReport}
                      disabled={isSendingEmail}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#21736A] to-[#29827D] hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-md transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {isSendingEmail ? 'Mengirim...' : 'Kirim Sekarang 📨'}
                    </button>
                  </div>
                </div>

                {emailStatusMsg && (
                  <div
                    className={`p-3 rounded-xl text-xs font-bold border ${
                      emailStatusMsg.isError
                        ? 'bg-[#FDF0E9] border-[#D97724] text-[#8F4619]'
                        : 'bg-[#E2F8F1] border-[#6ED5B6] text-[#143D37]'
                    }`}
                  >
                    {emailStatusMsg.text}
                  </div>
                )}
              </div>

              {/* Report Preview */}
              <div className="border border-[#C4DCAC] rounded-2xl p-5 bg-white space-y-4">
                <div className="flex items-center justify-between border-b border-[#EFF6E9] pb-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#21736A]">
                      Pratinjau Email Laporan
                    </span>
                    <h4 className="font-black text-base text-[#143D37]">
                      Laporan Prestasi Gigi: {profile.name}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-[#143D37] bg-[#EFF6E9] border border-[#C4DCAC] px-2.5 py-1 rounded-full">
                    {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}
                  </span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-[#143D37]">
                  <p>
                    Halo Ayah/Bunda! Berikut adalah rekapitulasi pembelajaran kesehatan gigi dan mulut untuk <strong>{profile.name}</strong> minggu ini:
                  </p>

                  <div className="bg-[#FAFDF9] p-3.5 rounded-xl space-y-1.5 border border-[#C4DCAC] text-xs font-medium">
                    <div>✨ <strong>Total Koin Terkumpul:</strong> {profile.coins} Koin Gigi</div>
                    <div>⭐ <strong>Bintang Senyum:</strong> {profile.stars} Bintang</div>
                    <div>🎯 <strong>Akurasi Kuis Kesehatan Gigi:</strong> {accuracyPercent}% ({profile.correctAnswers} / {profile.totalQuestionsAnswered} benar)</div>
                    <div>🪥 <strong>Sesi Sikat Gigi 2 Menit:</strong> {profile.brushingSessionsCompleted} kali</div>
                    <div>📚 <strong>Penyakit Gigi yang Dikuasai:</strong> {profile.exploredDiseases.length} dari 7 materi</div>
                    <div>🔥 <strong>Disiplin Harian:</strong> {profile.streakDays} hari berturut-turut</div>
                  </div>

                  <p className="text-[#21736A] font-bold">
                    💡 Rekomendasi Dokter Gigi: Tetap pertahankan sikat gigi 2 menit sebelum tidur malam dan dampingi saat sikat gigi agar teknik memutarnya semakin sempurna!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SINKRONISASI CLOUD & MODE LURING */}
          {activeTab === 'sync' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-black text-lg text-[#143D37] font-['Fredoka']">
                  Sinkronisasi Antar Perangkat & Dukungan Offline
                </h3>
                <p className="text-xs sm:text-sm text-[#143D37]/75 font-medium">
                  Akses kemajuan belajar anak di ponsel, tablet, atau laptop dengan kode sinkronisasi unik.
                </p>
              </div>

              {/* Online/Offline status card */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  isOnline
                    ? 'bg-[#E2F8F1] border-[#6ED5B6] text-[#143D37]'
                    : 'bg-[#FAF2E8] border-[#F5B842] text-[#8F4619]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-3.5 h-3.5 rounded-full ${isOnline ? 'bg-[#21736A] animate-pulse' : 'bg-[#D97724]'}`} />
                  <div>
                    <div className="font-extrabold text-sm">
                      {isOnline ? 'Perangkat Terhubung ke Server (Online)' : 'Mode Luring Aktif (Offline)'}
                    </div>
                    <div className="text-xs opacity-80">
                      {isOnline
                        ? 'Data otomatis disiapkan untuk sinkronisasi cloud.'
                        : 'Aplikasi berjalan lancar tanpa koneksi internet. Data tersimpan di penyimpanan lokal.'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sync Code Box */}
              <div className="bg-[#EFF6E9] border border-[#C4DCAC] p-5 rounded-2xl space-y-4">
                <div>
                  <div className="text-xs font-bold text-[#21736A] uppercase tracking-wider">
                    Kode Sinkronisasi Perangkat Ini:
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="bg-white border-2 border-[#C4DCAC] px-4 py-2 rounded-xl font-mono text-xl font-black text-[#143D37] tracking-wider">
                      {syncCode}
                    </div>
                    <button
                      onClick={() => {
                        soundEffects.tap();
                        navigator.clipboard.writeText(syncCode);
                        alert('Kode sinkronisasi berhasil disalin!');
                      }}
                      className="px-3 py-2 bg-white hover:bg-[#E2F8F1] text-[#143D37] border border-[#C4DCAC] rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Salin Kode 📋
                    </button>
                    <button
                      onClick={handleUploadSync}
                      disabled={isSyncing || !isOnline}
                      className="px-4 py-2 bg-[#21736A] hover:bg-[#143D37] text-white rounded-xl text-xs font-bold disabled:opacity-50 cursor-pointer"
                    >
                      {isSyncing ? 'Menyimpan...' : 'Unggah ke Cloud ☁️'}
                    </button>
                  </div>
                </div>

                <div className="border-t border-[#C4DCAC] pt-4 space-y-2">
                  <div className="text-xs font-bold text-[#143D37]">
                    Pulihkan / Muat Data dari Perangkat Lain:
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Masukkan kode sinkronisasi (contoh: GIGI-1234)"
                      value={inputSyncCode}
                      onChange={e => setInputSyncCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-[#C4DCAC] font-mono font-bold text-[#143D37] text-sm bg-white"
                    />
                    <button
                      onClick={handleDownloadSync}
                      disabled={isSyncing || !isOnline}
                      className="px-4 py-2 bg-[#143D37] hover:bg-[#21736A] text-white rounded-xl text-xs font-bold disabled:opacity-50 cursor-pointer"
                    >
                      {isSyncing ? 'Memuat...' : 'Tarik Data 📥'}
                    </button>
                  </div>
                </div>

                {syncStatusMsg && (
                  <div
                    className={`p-3 rounded-xl text-xs font-bold border ${
                      syncStatusMsg.isError
                        ? 'bg-[#FDF0E9] border-[#D97724] text-[#8F4619]'
                        : 'bg-[#E2F8F1] border-[#6ED5B6] text-[#143D37]'
                    }`}
                  >
                    {syncStatusMsg.text}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
