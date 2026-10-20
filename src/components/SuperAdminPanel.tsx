import React, { useState, useEffect } from 'react';
import {
  AppUserProfile,
  StaffAccount,
  AppCustomizationConfig,
  LayoutCardConfig,
  SequentialLevel,
  RiskWarningData,
} from '../types';
import {
  db,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  SUPER_ADMIN_EMAIL,
} from '../lib/firebase';
import { SEQUENTIAL_LEVELS } from '../data/sequentialLevels';
import { soundEffects } from '../utils/audio';
import { BackButton3D } from './GameIcons';

interface SuperAdminPanelProps {
  currentUser: AppUserProfile;
  appConfig: AppCustomizationConfig;
  onUpdateAppConfig: (newConfig: AppCustomizationConfig) => void;
  onRequestRiskWarning: (warning: RiskWarningData) => void;
  onBack: () => void;
}

export const SuperAdminPanel: React.FC<SuperAdminPanelProps> = ({
  currentUser,
  appConfig,
  onUpdateAppConfig,
  onRequestRiskWarning,
  onBack,
}) => {
  const isSuperAdmin = currentUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() || currentUser.primaryRole === 'super_admin';
  const isDoctor = currentUser.primaryRole === 'dokter_gigi';
  const isTherapist = currentUser.primaryRole === 'terapis_gigi';

  const [activeTab, setActiveTab] = useState<'staff' | 'layout' | 'curriculum'>('staff');

  // Staff Management State
  const [staffList, setStaffList] = useState<StaffAccount[]>([]);
  const [loadingStaff, setLoadingStaff] = useState<boolean>(true);
  const [newStaffEmail, setNewStaffEmail] = useState<string>('');
  const [newStaffName, setNewStaffName] = useState<string>('');
  const [newStaffRole, setNewStaffRole] = useState<'dokter_gigi' | 'terapis_gigi'>('dokter_gigi');
  const [newStaffSpecialty, setNewStaffSpecialty] = useState<string>('Kesehatan Gigi Anak & Mulut');

  // Layout & Color Customization State
  const [tempConfig, setTempConfig] = useState<AppCustomizationConfig>(appConfig);
  const [selectedIconCardId, setSelectedIconCardId] = useState<string>('');
  const [customIconInput, setCustomIconInput] = useState<string>('');

  // Curriculum Management State
  const [levels, setLevels] = useState<SequentialLevel[]>(SEQUENTIAL_LEVELS);
  const [selectedLevelIdx, setSelectedLevelIdx] = useState<number>(0);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editModuleTitle, setEditModuleTitle] = useState<string>('');
  const [editModuleSummary, setEditModuleSummary] = useState<string>('');
  const [editModuleTip, setEditModuleTip] = useState<string>('');

  // Load Staff List from Cloud Firestore
  const fetchStaffList = async () => {
    try {
      setLoadingStaff(true);
      const snap = await getDocs(collection(db, 'staff_roles'));
      const list: StaffAccount[] = [];
      snap.forEach(d => {
        list.push(d.data() as StaffAccount);
      });
      setStaffList(list);
    } catch (err) {
      console.warn('Notice loading staff list:', err);
    } finally {
      setLoadingStaff(false);
    }
  };

  useEffect(() => {
    fetchStaffList();
  }, []);

  // Update tempConfig when parent appConfig changes
  useEffect(() => {
    setTempConfig(appConfig);
  }, [appConfig]);

  // ------------------------------------------------------------------
  // 1. STAFF MANAGEMENT HANDLERS (REQUIREMENT #4 & #5)
  // ------------------------------------------------------------------
  const handleAddStaffAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffEmail.trim() || !newStaffName.trim()) return;

    const emailClean = newStaffEmail.trim().toLowerCase();
    const staffEntry: StaffAccount = {
      email: emailClean,
      name: newStaffName.trim(),
      role: newStaffRole,
      specialty: newStaffSpecialty.trim(),
      addedBy: currentUser.email,
      addedAt: new Date().toISOString(),
      active: true,
    };

    // Trigger Risk Warning Modal
    onRequestRiskWarning({
      title: `Persetujuan Menambahkan Staf: ${newStaffName}`,
      description: `Anda akan memberikan hak akses akun "${emailClean}" sebagai ${
        newStaffRole === 'dokter_gigi' ? 'Dokter Gigi (Membaca, Mengedit & Menambah Data)' : 'Terapis Gigi (Membaca & Menambah Data)'
      }.`,
      riskNotice: 'Akun ini akan memiliki akses resmi ke dashboard analisis kesehatan anak dan diperbolehkan menambahkan catatan serta rekomendasi klinis ke database.',
      severity: 'medium',
      confirmLabel: 'Setuju & Tambahkan Akun',
      action: async () => {
        try {
          await setDoc(doc(db, 'staff_roles', emailClean), staffEntry);
          // Also set user role if user document already exists
          await setDoc(doc(db, 'users', `user-${emailClean.replace(/[^a-zA-Z0-9]/g, '_')}`), {
            email: emailClean,
            displayName: newStaffName,
            primaryRole: newStaffRole,
            activeRole: newStaffRole,
            hasParentRole: true,
            hasChildRole: false,
            createdAt: new Date().toISOString(),
          }, { merge: true });

          soundEffects.fanfare();
          setNewStaffEmail('');
          setNewStaffName('');
          fetchStaffList();
        } catch (err: any) {
          console.error('Error adding staff:', err);
          alert('Gagal menambahkan staf: ' + err.message);
        }
      },
    });
  };

  const handleDeleteStaffAccount = (email: string, name: string) => {
    onRequestRiskWarning({
      title: `Konfirmasi Hapus Akun Staf: ${name}`,
      description: `Apakah Anda yakin ingin mencabut dan menghapus hak akses staf untuk email ${email}?`,
      riskNotice: 'PERINGATAN TINGGI: Staf tidak lagi dapat masuk sebagai dokter atau terapis gigi. Hak akses ke catatan analisis akan langsung dicabut seketika.',
      severity: 'high',
      confirmLabel: 'Setuju & Hapus Permanen',
      action: async () => {
        try {
          await deleteDoc(doc(db, 'staff_roles', email.toLowerCase()));
          soundEffects.correct();
          fetchStaffList();
        } catch (err: any) {
          console.error('Error deleting staff:', err);
        }
      },
    });
  };

  // ------------------------------------------------------------------
  // 2. LAYOUT & VISUAL CUSTOMIZATION HANDLERS (REQUIREMENT #2 & #5)
  // ------------------------------------------------------------------
  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    const cards = [...tempConfig.cards];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= cards.length) return;

    const temp = cards[index];
    cards[index] = cards[targetIndex];
    cards[targetIndex] = temp;

    cards.forEach((c, idx) => {
      c.order = idx + 1;
    });

    setTempConfig({ ...tempConfig, cards });
  };

  const handleToggleCardVisibility = (cardId: string) => {
    const cards = tempConfig.cards.map(c =>
      c.id === cardId ? { ...c, visible: !c.visible } : c
    );
    setTempConfig({ ...tempConfig, cards });
  };

  const handleSetCustomIcon = (cardId: string, iconValue: string) => {
    const cards = tempConfig.cards.map(c =>
      c.id === cardId ? { ...c, icon: iconValue } : c
    );
    setTempConfig({ ...tempConfig, cards });
  };

  const handleSaveLayoutChanges = () => {
    onRequestRiskWarning({
      title: 'Simpan Perubahan Tata Letak & Warna Aplikasi',
      description: 'Anda akan memperbarui susunan kartu menu, warna tema, serta ikon aplikasi ke Cloud Firebase.',
      riskNotice: 'Perubahan ini akan langsung diterapkan ke seluruh pengguna yang mengakses aplikasi Dentika Petualang Gigi.',
      severity: 'medium',
      confirmLabel: 'Terapkan Desain Baru',
      action: async () => {
        try {
          const updated: AppCustomizationConfig = {
            ...tempConfig,
            updatedAt: new Date().toISOString(),
            updatedBy: currentUser.email,
          };
          await setDoc(doc(db, 'app_customization', 'main_layout'), updated, { merge: true });
          onUpdateAppConfig(updated);
          soundEffects.fanfare();
        } catch (err: any) {
          console.error('Failed to save layout:', err);
          alert('Gagal menyimpan layout: ' + err.message);
        }
      },
    });
  };

  // ------------------------------------------------------------------
  // 3. CURRICULUM CRUD HANDLERS (REQUIREMENT #2 & #5)
  // ------------------------------------------------------------------
  const handleSaveModuleEdit = (levelNum: number, modId: string) => {
    onRequestRiskWarning({
      title: `Simpan Pengeditan Materi: ${editModuleTitle}`,
      description: 'Anda akan mengubah isi judul, rangkuman, dan tips materi pembelajaran edukasi.',
      riskNotice: 'Pastikan informasi medis gigi tetap akurat sesuai panduan standar kesehatan anak.',
      severity: 'medium',
      confirmLabel: 'Setuju & Perbarui Materi',
      action: async () => {
        const updatedLevels = levels.map(lvl => {
          if (lvl.levelNumber === levelNum) {
            return {
              ...lvl,
              modules: lvl.modules.map(m =>
                m.id === modId
                  ? {
                      ...m,
                      title: editModuleTitle,
                      summary: editModuleSummary,
                      actionTip: editModuleTip,
                    }
                  : m
              ),
            };
          }
          return lvl;
        });

        setLevels(updatedLevels);
        setEditingModuleId(null);
        soundEffects.correct();

        try {
          await setDoc(doc(db, 'curriculum_levels', `level_${levelNum}`), updatedLevels[levelNum - 1], { merge: true });
        } catch (e) {
          console.warn('Curriculum save notice:', e);
        }
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl border-2 border-purple-400/40 flex flex-col md:flex-row items-center justify-between gap-4">
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
                PANEL KONTROL SUPER ADMIN 👑🛠️
              </span>
              <span className="text-[10px] bg-purple-500 text-white px-2.5 py-0.5 rounded-full font-black uppercase">
                {isSuperAdmin ? 'Akses Penuh (Full Access)' : isDoctor ? 'Akses Dokter Gigi' : 'Akses Terapis Gigi'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-purple-200 font-medium">
              Kelola Staf Dokter & Terapis • Kustomisasi Tata Letak & Ikon • Editor Materi & Kuis
            </p>
          </div>
        </div>

        <div className="text-right text-xs bg-white/10 px-3.5 py-2 rounded-2xl border border-white/20">
          <span className="text-purple-300 block font-bold">Admin:</span>
          <span className="font-extrabold text-white">{currentUser.email}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
        <button
          type="button"
          onClick={() => {
            soundEffects.tap();
            setActiveTab('staff');
          }}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'staff'
              ? 'bg-purple-800 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span>👥</span>
          <span>Kelola Tim Dokter & Terapis</span>
        </button>

        {isSuperAdmin && (
          <button
            type="button"
            onClick={() => {
              soundEffects.tap();
              setActiveTab('layout');
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'layout'
                ? 'bg-purple-800 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>🎨</span>
            <span>Tata Letak, Ikon & Warna</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            soundEffects.tap();
            setActiveTab('curriculum');
          }}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'curriculum'
              ? 'bg-purple-800 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span>📖</span>
          <span>Editor Materi & Kuis</span>
        </button>
      </div>

      {/* ----------------------------------------------------------------
          TAB 1: STAFF MANAGEMENT (REQUIREMENT #4)
          ---------------------------------------------------------------- */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          {/* Add Staff Form (Only Super Admin can add) */}
          {isSuperAdmin ? (
            <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-purple-200 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center text-xl font-black">
                  ➕
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 font-['Fredoka']">
                    Tambah Akun Tim Profesional (Dokter Gigi / Terapis Gigi)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Dokter Gigi memiliki hak membaca, mengedit & menambah data. Terapis Gigi memiliki hak membaca & menambah data.
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddStaffAccount} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Nama Lengkap & Gelar Staf:</label>
                    <input
                      type="text"
                      value={newStaffName}
                      onChange={e => setNewStaffName(e.target.value)}
                      required
                      placeholder="Contoh: drg. Sarah Amanda, Sp.KGA"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Alamat Email Gmail Staf:</label>
                    <input
                      type="email"
                      value={newStaffEmail}
                      onChange={e => setNewStaffEmail(e.target.value)}
                      required
                      placeholder="Contoh: dokter.sarah@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Wewenang / Peran Staf:</label>
                    <select
                      value={newStaffRole}
                      onChange={e => setNewStaffRole(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-bold focus:ring-2 focus:ring-purple-600 focus:outline-none bg-white"
                    >
                      <option value="dokter_gigi">Dokter Gigi 🩺 (Baca, Edit, & Tambah Data)</option>
                      <option value="terapis_gigi">Terapis Gigi 🌿 (Baca & Tambah Data)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Bidang Keahlian / Spesialisasi:</label>
                    <input
                      type="text"
                      value={newStaffSpecialty}
                      onChange={e => setNewStaffSpecialty(e.target.value)}
                      placeholder="Contoh: Terapi Plak Anak & Edukasi Preventif"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-800 to-indigo-900 hover:opacity-95 text-white font-black text-sm shadow-md shadow-purple-950/30 transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <span>✓ Tambahkan Staf Baru</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-900">
              ℹ️ Anda masuk sebagai staf klinis. Penambahan atau penghapusan anggota tim staf hanya dapat dilakukan oleh Super Admin ({SUPER_ADMIN_EMAIL}).
            </div>
          )}

          {/* Staff List Table */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-gray-900 font-['Fredoka']">
                Daftar Staf Terdaftar di Cloud Firebase ({staffList.length})
              </h3>
              <button
                type="button"
                onClick={fetchStaffList}
                className="text-xs text-purple-700 font-bold hover:underline cursor-pointer"
              >
                🔄 Segarkan Data
              </button>
            </div>

            {loadingStaff ? (
              <p className="text-xs text-gray-500 py-4 text-center">Memuat daftar staf dari Cloud Firebase...</p>
            ) : staffList.length === 0 ? (
              <div className="p-6 rounded-2xl bg-gray-50 border border-dashed border-gray-300 text-center text-xs text-gray-500">
                Belum ada akun dokter gigi atau terapis gigi tambahan. Gunakan formulir di atas untuk mendaftarkan staf.
              </div>
            ) : (
              <div className="space-y-3">
                {staffList.map(staf => (
                  <div
                    key={staf.email}
                    className="p-4 rounded-2xl border border-gray-200 bg-gray-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-purple-700 text-white flex items-center justify-center text-lg font-black shadow-sm">
                        {staf.role === 'dokter_gigi' ? '🩺' : '🌿'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-gray-900">{staf.name}</h4>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                            staf.role === 'dokter_gigi'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}>
                            {staf.role === 'dokter_gigi' ? 'Dokter Gigi' : 'Terapis Gigi'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{staf.email}</p>
                        <p className="text-[11px] text-gray-500 font-medium">{staf.specialty || 'Spesialisasi Umum'}</p>
                      </div>
                    </div>

                    {isSuperAdmin && (
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => handleDeleteStaffAccount(staf.email, staf.name)}
                          className="py-2 px-3.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 transition-colors cursor-pointer"
                        >
                          Hapus Akses ✕
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------
          TAB 2: LAYOUT, ICON & COLOR CUSTOMIZATION (REQUIREMENT #2)
          ---------------------------------------------------------------- */}
      {activeTab === 'layout' && isSuperAdmin && (
        <div className="space-y-6">
          {/* Color Palette Editor */}
          <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-purple-200 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              <h3 className="text-base sm:text-lg font-black text-gray-900 font-['Fredoka']">
                Sesuaikan Warna Layout & Tema Aplikasi
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Warna Utama (Primary):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={tempConfig.themePrimaryColor}
                    onChange={e => setTempConfig({ ...tempConfig, themePrimaryColor: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-gray-300 p-0.5"
                  />
                  <input
                    type="text"
                    value={tempConfig.themePrimaryColor}
                    onChange={e => setTempConfig({ ...tempConfig, themePrimaryColor: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-gray-300 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Warna Sekunder (Deep):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={tempConfig.themeSecondaryColor}
                    onChange={e => setTempConfig({ ...tempConfig, themeSecondaryColor: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-gray-300 p-0.5"
                  />
                  <input
                    type="text"
                    value={tempConfig.themeSecondaryColor}
                    onChange={e => setTempConfig({ ...tempConfig, themeSecondaryColor: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-gray-300 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Warna Aksen (Accent):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={tempConfig.themeAccentColor}
                    onChange={e => setTempConfig({ ...tempConfig, themeAccentColor: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-gray-300 p-0.5"
                  />
                  <input
                    type="text"
                    value={tempConfig.themeAccentColor}
                    onChange={e => setTempConfig({ ...tempConfig, themeAccentColor: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-gray-300 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Warna Latar (Background):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={tempConfig.themeBgColor}
                    onChange={e => setTempConfig({ ...tempConfig, themeBgColor: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-gray-300 p-0.5"
                  />
                  <input
                    type="text"
                    value={tempConfig.themeBgColor}
                    onChange={e => setTempConfig({ ...tempConfig, themeBgColor: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-gray-300 text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-gray-700">Tagline Banner Beranda:</label>
              <input
                type="text"
                value={tempConfig.bannerTagline}
                onChange={e => setTempConfig({ ...tempConfig, bannerTagline: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm font-semibold"
              />
            </div>
          </div>

          {/* Reorder Layout Cards & Change Icons */}
          <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-purple-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-black text-gray-900 font-['Fredoka']">
                  Susun Ulang Tata Letak Kartu Menu & Ganti Ikon
                </h3>
                <p className="text-xs text-gray-500">
                  Gunakan tombol panah untuk memindahkan urutan kartu, atau klik ikon untuk mengganti dengan simbol / URL gambar baru.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {tempConfig.cards.map((card, idx) => (
                <div
                  key={card.id}
                  className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                    card.visible ? 'bg-slate-50 border-slate-200' : 'bg-gray-100 border-gray-300 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-gray-400 w-5">#{idx + 1}</span>

                    {/* Icon Preview / Selector */}
                    <div className="relative group">
                      <div className="w-12 h-12 rounded-xl bg-white border border-gray-300 flex items-center justify-center text-2xl shadow-sm">
                        {card.icon.startsWith('http') ? (
                          <img src={card.icon} alt="Icon" className="w-8 h-8 object-contain" />
                        ) : (
                          card.icon
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-gray-900">{card.label}</h4>
                      <p className="text-xs text-gray-500">{card.sublabel}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 justify-end">
                    {/* Quick Icon Input */}
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="Emoji/URL Ikon"
                        defaultValue={card.icon}
                        onBlur={e => handleSetCustomIcon(card.id, e.target.value)}
                        className="w-28 px-2 py-1 rounded-lg border border-gray-300 text-xs font-bold"
                      />
                    </div>

                    {/* Move Up / Down */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveCard(idx, 'up')}
                      className="p-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-black disabled:opacity-30 cursor-pointer"
                      title="Pindahkan ke atas"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={idx === tempConfig.cards.length - 1}
                      onClick={() => handleMoveCard(idx, 'down')}
                      className="p-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-black disabled:opacity-30 cursor-pointer"
                      title="Pindahkan ke bawah"
                    >
                      ▼
                    </button>

                    {/* Visibility Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleCardVisibility(card.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer ${
                        card.visible
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                      }`}
                    >
                      {card.visible ? 'Tampil 👁️' : 'Disembunyikan 🚫'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Save Layout Action */}
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSaveLayoutChanges}
                className="py-3 px-8 rounded-2xl bg-gradient-to-r from-purple-800 to-indigo-900 hover:opacity-95 text-white font-black text-sm shadow-lg shadow-purple-950/30 transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>💾 Simpan Desain Tata Letak ke Cloud Firebase</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------
          TAB 3: CURRICULUM & QUIZ EDITOR (REQUIREMENT #2 & #5)
          ---------------------------------------------------------------- */}
      {activeTab === 'curriculum' && (
        <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-purple-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-black text-gray-900 font-['Fredoka']">
                Editor Materi Edukasi & Kuis Bertahap
              </h3>
              <p className="text-xs text-gray-500">
                Pilih level untuk mengedit materi dan soal kuis yang tersinkronisasi ke seluruh anak.
              </p>
            </div>

            {/* Level Selector */}
            <div className="flex gap-2">
              {levels.map((lvl, idx) => (
                <button
                  key={lvl.levelNumber}
                  type="button"
                  onClick={() => {
                    soundEffects.tap();
                    setSelectedLevelIdx(idx);
                    setEditingModuleId(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    selectedLevelIdx === idx
                      ? 'bg-purple-800 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  L{lvl.levelNumber}
                </button>
              ))}
            </div>
          </div>

          {/* Module Editor List for Selected Level */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-purple-900 tracking-wider">
              Materi pada Level {levels[selectedLevelIdx].levelNumber}: {levels[selectedLevelIdx].title}
            </h4>

            {levels[selectedLevelIdx].modules.map(mod => {
              const isEditing = editingModuleId === mod.id;

              return (
                <div
                  key={mod.id}
                  className="p-4 rounded-2xl border-2 border-gray-200 bg-gray-50/70 space-y-3"
                >
                  {!isEditing ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                            Materi {mod.order}
                          </span>
                          <h5 className="text-sm font-black text-gray-900">{mod.title}</h5>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{mod.summary}</p>
                        <p className="text-[11px] text-teal-800 font-bold mt-1">Aksi: {mod.actionTip}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          soundEffects.tap();
                          setEditingModuleId(mod.id);
                          setEditModuleTitle(mod.title);
                          setEditModuleSummary(mod.summary);
                          setEditModuleTip(mod.actionTip);
                        }}
                        className="py-1.5 px-3.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-extrabold text-xs transition-colors cursor-pointer whitespace-nowrap self-start sm:self-center"
                      >
                        ✏️ Edit Konten
                      </button>
                    </div>
                  ) : (
                    /* Inline Editing Form */
                    <div className="space-y-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Judul Materi:</label>
                        <input
                          type="text"
                          value={editModuleTitle}
                          onChange={e => setEditModuleTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-purple-300 text-xs font-bold focus:ring-2 focus:ring-purple-600 focus:outline-none bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Rangkuman Materi:</label>
                        <textarea
                          rows={2}
                          value={editModuleSummary}
                          onChange={e => setEditModuleSummary(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-purple-300 text-xs font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Tips Aksi Pahlawan Senyum:</label>
                        <input
                          type="text"
                          value={editModuleTip}
                          onChange={e => setEditModuleTip(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-purple-300 text-xs font-bold focus:ring-2 focus:ring-purple-600 focus:outline-none bg-white"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingModuleId(null)}
                          className="py-2 px-4 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveModuleEdit(levels[selectedLevelIdx].levelNumber, mod.id)}
                          className="py-2 px-5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs shadow-sm cursor-pointer"
                        >
                          Simpan Perubahan
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
