import React, { useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  db,
  doc,
  setDoc,
  getDoc,
  SUPER_ADMIN_EMAIL,
} from '../lib/firebase';
import { AppUserProfile, UserRole, UserGender } from '../types';
import { soundEffects } from '../utils/audio';

interface AuthModalProps {
  currentUser: AppUserProfile | null;
  onUserChange: (user: AppUserProfile | null) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  onUserChange,
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [step, setStep] = useState<'login' | 'profile_setup'>('login');

  // Registration profile fields
  const [selectedRole, setSelectedRole] = useState<'orang_tua' | 'anak' | 'both'>('both');
  const [userAge, setUserAge] = useState<number>(30);
  const [userGender, setUserGender] = useState<UserGender>('Laki-laki');
  const [childName, setChildName] = useState<string>('Denti Cilik');
  const [childAge, setChildAge] = useState<number>(8);
  const [childGender, setChildGender] = useState<UserGender>('Perempuan');

  // Temporary auth object before profile complete
  const [pendingAuth, setPendingAuth] = useState<{
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
  } | null>(null);

  // If user already signed in, default to their profile details
  useEffect(() => {
    if (currentUser) {
      setUserAge(currentUser.age || 30);
      setUserGender(currentUser.gender || 'Laki-laki');
      setChildName(currentUser.childName || 'Denti Cilik');
      setChildAge(currentUser.childAge || 8);
      setChildGender(currentUser.childGender || 'Perempuan');
      if (currentUser.hasParentRole && currentUser.hasChildRole) {
        setSelectedRole('both');
      } else if (currentUser.primaryRole === 'orang_tua') {
        setSelectedRole('orang_tua');
      } else {
        setSelectedRole('anak');
      }
    }
  }, [currentUser]);

  // Handle Google Gmail Login
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      soundEffects.tap();

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user) {
        throw new Error('Gagal mendapatkan informasi akun Google.');
      }

      await checkOrRegisterUser(user.uid, user.email || '', user.displayName || 'Pengguna Dentika', user.photoURL || undefined);
    } catch (err: any) {
      console.warn('Google Popup sign-in error or blocked:', err);
      if (err.code === 'auth/popup-blocked') {
        setErrorMessage('Jendela pop-up Google diblokir browser. Izinkan pop-up atau gunakan tombol Masuk Akun Cepat di bawah.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Jendela login ditutup sebelum selesai.');
      } else {
        setErrorMessage(err.message || 'Gagal login dengan akun Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Quick fallback login (e.g. for demo, testing, or when popup is restricted)
  const handleQuickSignIn = async (emailInput?: string, nameInput?: string) => {
    try {
      setLoading(true);
      setErrorMessage('');
      soundEffects.tap();

      const targetEmail = (emailInput || SUPER_ADMIN_EMAIL).toLowerCase().trim();
      const targetName = nameInput || (targetEmail === SUPER_ADMIN_EMAIL ? 'Super Admin Nazda' : 'Sahabat Dentika');
      const fakeUid = `user-${targetEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;

      await checkOrRegisterUser(fakeUid, targetEmail, targetName, undefined);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal masuk akun.');
    } finally {
      setLoading(false);
    }
  };

  // Check if profile exists in Firestore or prompt setup
  const checkOrRegisterUser = async (
    uid: string,
    email: string,
    displayName: string,
    photoURL?: string
  ) => {
    const isSuperAdmin = email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

    // Check existing profile in Firestore
    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const existing = snap.data() as AppUserProfile;
        // Ensure super admin role is retained if email matches
        const finalRole = isSuperAdmin ? 'super_admin' : existing.primaryRole;
        const updated: AppUserProfile = {
          ...existing,
          uid,
          email,
          displayName: displayName || existing.displayName,
          photoURL: photoURL || existing.photoURL,
          primaryRole: finalRole,
          activeRole: isSuperAdmin ? 'super_admin' : existing.activeRole || existing.primaryRole,
          lastLoginAt: new Date().toISOString(),
        };

        await setDoc(userRef, updated, { merge: true });
        onUserChange(updated);
        soundEffects.fanfare();
        onClose();
        return;
      }
    } catch (err) {
      console.warn('Could not read existing user from Firestore, proceeding to setup:', err);
    }

    // New User: Prompt demographic setup (Role, Age, Gender)
    setPendingAuth({
      uid,
      email,
      displayName,
      photoURL,
    });
    setStep('profile_setup');
  };

  // Finalize Registration Form
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingAuth && !currentUser) return;

    try {
      setLoading(true);
      setErrorMessage('');
      soundEffects.tap();

      const uid = pendingAuth?.uid || currentUser!.uid;
      const email = pendingAuth?.email || currentUser!.email;
      const displayName = pendingAuth?.displayName || currentUser!.displayName;
      const photoURL = pendingAuth?.photoURL || currentUser?.photoURL;

      const isSuperAdmin = email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

      let primaryRole: UserRole = 'anak';
      if (isSuperAdmin) {
        primaryRole = 'super_admin';
      } else if (selectedRole === 'orang_tua' || selectedRole === 'both') {
        primaryRole = 'orang_tua';
      } else {
        primaryRole = 'anak';
      }

      const activeRole = isSuperAdmin ? 'super_admin' : primaryRole;
      const hasParentRole = isSuperAdmin || selectedRole === 'orang_tua' || selectedRole === 'both';
      const hasChildRole = isSuperAdmin || selectedRole === 'anak' || selectedRole === 'both';

      const userProfile: AppUserProfile = {
        uid,
        email,
        displayName: displayName || (selectedRole === 'anak' ? childName : 'Orang Tua Dentika'),
        photoURL,
        primaryRole,
        activeRole,
        hasParentRole,
        hasChildRole,
        age: Number(userAge) || 25,
        gender: userGender,
        childName: (selectedRole === 'orang_tua' || selectedRole === 'both') ? childName : undefined,
        childAge: (selectedRole === 'orang_tua' || selectedRole === 'both') ? Number(childAge) : Number(userAge),
        childGender: (selectedRole === 'orang_tua' || selectedRole === 'both') ? childGender : userGender,
        createdAt: currentUser?.createdAt || new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        currentLevel: currentUser?.currentLevel || 1,
        completedModuleIds: currentUser?.completedModuleIds || [],
        completedLevelIds: currentUser?.completedLevelIds || [],
        quizScores: currentUser?.quizScores || {},
      };

      // Save to Cloud Firestore
      await setDoc(doc(db, 'users', uid), userProfile, { merge: true });

      // If super admin, record in staff_roles
      if (isSuperAdmin) {
        await setDoc(doc(db, 'staff_roles', email.toLowerCase()), {
          email: email.toLowerCase(),
          name: displayName || 'Super Admin Nazda',
          role: 'super_admin',
          addedBy: 'system',
          addedAt: new Date().toISOString(),
          active: true,
        }, { merge: true });
      }

      onUserChange(userProfile);
      soundEffects.fanfare();
      onClose();
    } catch (err: any) {
      console.error('Failed to save user profile:', err);
      setErrorMessage(err.message || 'Gagal menyimpan data akun ke Cloud Firebase.');
    } finally {
      setLoading(false);
    }
  };

  // Switch Active Role (Dual-Role Feature)
  const handleSwitchActiveRole = async (targetRole: UserRole) => {
    if (!currentUser) return;
    try {
      soundEffects.tap();
      const updated: AppUserProfile = {
        ...currentUser,
        activeRole: targetRole,
      };
      await setDoc(doc(db, 'users', currentUser.uid), { activeRole: targetRole }, { merge: true });
      onUserChange(updated);
      onClose();
    } catch (e) {
      console.warn('Failed to switch active role:', e);
    }
  };

  // Handle Logout
  const handleSignOut = async () => {
    try {
      soundEffects.tap();
      await signOut(auth);
      onUserChange(null);
      onClose();
    } catch (err) {
      console.warn('Sign out notice:', err);
      onUserChange(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-4 border-[#21736A] overflow-hidden transform transition-all max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#143D37] via-[#21736A] to-[#29827D] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/30">
              {currentUser ? '👤' : '🔐'}
            </div>
            <div>
              <h3 className="text-xl font-black font-['Fredoka'] tracking-wide">
                {currentUser ? 'Profil & Akun Pengguna' : 'Masuk / Daftar Akun Gmail'}
              </h3>
              <p className="text-xs text-[#A2E7D2] font-semibold">
                Sinkronisasi Cloud Firebase • Satu Akun Dua Peran
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEffects.tap();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center font-black text-lg transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-300 text-red-800 text-xs font-bold flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* VIEW A: IF ALREADY LOGGED IN */}
          {currentUser && step !== 'profile_setup' ? (
            <div className="space-y-5">
              {/* Profile Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#EFF6E9] to-[#E2F8F1] border-2 border-[#6ED5B6] space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#21736A] text-white flex items-center justify-center text-2xl font-black shadow-md border-2 border-white">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      currentUser.displayName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-black text-[#143D37]">
                        {currentUser.displayName}
                      </h4>
                      {currentUser.primaryRole === 'super_admin' && (
                        <span className="text-[10px] bg-purple-700 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Super Admin 👑
                        </span>
                      )}
                      {currentUser.primaryRole === 'dokter_gigi' && (
                        <span className="text-[10px] bg-blue-700 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Dokter Gigi 🩺
                        </span>
                      )}
                      {currentUser.primaryRole === 'terapis_gigi' && (
                        <span className="text-[10px] bg-teal-700 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Terapis Gigi 🌿
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 font-medium">{currentUser.email}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-700 font-bold">
                      <span>Usia: {currentUser.age} tahun</span>
                      <span>•</span>
                      <span>Gender: {currentUser.gender}</span>
                    </div>
                  </div>
                </div>

                {currentUser.childName && (
                  <div className="pt-2 border-t border-[#6ED5B6]/50 flex items-center justify-between text-xs font-bold text-[#143D37]">
                    <span>👶 Profil Anak: {currentUser.childName}</span>
                    <span>{currentUser.childAge} thn ({currentUser.childGender})</span>
                  </div>
                )}
              </div>

              {/* DUAL-ROLE SWITCHER (Satu Akun Dua Role) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-700 uppercase tracking-wide">
                    Mode Tampilan Aktif:
                  </span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-black px-2.5 py-0.5 rounded-full">
                    {currentUser.activeRole === 'super_admin'
                      ? '👑 Super Admin'
                      : currentUser.activeRole === 'orang_tua'
                      ? '👨‍👩‍👧 Mode Orang Tua'
                      : currentUser.activeRole === 'dokter_gigi'
                      ? '🩺 Dokter Gigi'
                      : currentUser.activeRole === 'terapis_gigi'
                      ? '🌿 Terapis Gigi'
                      : '🧒 Mode Anak'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {(currentUser.hasChildRole || currentUser.primaryRole === 'super_admin') && (
                    <button
                      type="button"
                      onClick={() => handleSwitchActiveRole('anak')}
                      className={`p-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        currentUser.activeRole === 'anak'
                          ? 'bg-[#21736A] text-white shadow-md'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>🧒</span>
                      <span>Beralih ke Mode Anak</span>
                    </button>
                  )}

                  {(currentUser.hasParentRole || currentUser.primaryRole === 'super_admin') && (
                    <button
                      type="button"
                      onClick={() => handleSwitchActiveRole('orang_tua')}
                      className={`p-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        currentUser.activeRole === 'orang_tua'
                          ? 'bg-[#21736A] text-white shadow-md'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>👨‍👩‍👧</span>
                      <span>Beralih ke Orang Tua</span>
                    </button>
                  )}
                </div>

                {currentUser.primaryRole === 'super_admin' && (
                  <button
                    type="button"
                    onClick={() => handleSwitchActiveRole('super_admin')}
                    className={`w-full p-2.5 mt-1 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      currentUser.activeRole === 'super_admin'
                        ? 'bg-purple-700 text-white shadow-md'
                        : 'bg-white border border-purple-300 text-purple-800 hover:bg-purple-50'
                    }`}
                  >
                    <span>👑</span>
                    <span>Kembali ke Mode Super Admin</span>
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('profile_setup')}
                  className="flex-1 py-3 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs border border-emerald-300 transition-all cursor-pointer text-center"
                >
                  ✏️ Edit Data Demografi & Peran
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="py-3 px-5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-xs border border-red-200 transition-all cursor-pointer"
                >
                  Keluar Akun
                </button>
              </div>
            </div>
          ) : step === 'profile_setup' ? (
            /* VIEW B: DEMOGRAPHIC & ROLE REGISTRATION FORM */
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="bg-[#EFF6E9] p-3.5 rounded-2xl border border-[#6ED5B6] text-xs font-bold text-[#143D37]">
                📋 Lengkapi data demografi untuk personalisasi materi dan analisis kesehatan gigi di Cloud Firebase.
              </div>

              {/* Role Option: Anak, Orang Tua, or Both (Dual Role) */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wide">
                  Pilihan Pendaftaran Akun (Bisa untuk 2 Role Sekaligus):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('anak')}
                    className={`p-3 rounded-2xl text-xs font-black flex flex-col items-center gap-1 border-2 transition-all cursor-pointer ${
                      selectedRole === 'anak'
                        ? 'border-[#21736A] bg-emerald-50 text-[#143D37] shadow-sm'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-2xl">🧒</span>
                    <span>Hanya Anak</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('orang_tua')}
                    className={`p-3 rounded-2xl text-xs font-black flex flex-col items-center gap-1 border-2 transition-all cursor-pointer ${
                      selectedRole === 'orang_tua'
                        ? 'border-[#21736A] bg-emerald-50 text-[#143D37] shadow-sm'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-2xl">👨‍👩‍👧</span>
                    <span>Hanya Orang Tua</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('both')}
                    className={`p-3 rounded-2xl text-xs font-black flex flex-col items-center gap-1 border-2 transition-all cursor-pointer ${
                      selectedRole === 'both'
                        ? 'border-[#21736A] bg-emerald-50 text-[#143D37] shadow-sm'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-2xl">🌟</span>
                    <span>Keduanya (Dual Role)</span>
                  </button>
                </div>
              </div>

              {/* Demographic Data: Age & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Usia Pengguna (Tahun):
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="99"
                    value={userAge}
                    onChange={e => setUserAge(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-bold focus:ring-2 focus:ring-[#21736A] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Jenis Kelamin:
                  </label>
                  <select
                    value={userGender}
                    onChange={e => setUserGender(e.target.value as UserGender)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-bold focus:ring-2 focus:ring-[#21736A] focus:outline-none bg-white"
                  >
                    <option value="Laki-laki">Laki-laki 👦</option>
                    <option value="Perempuan">Perempuan 👧</option>
                  </select>
                </div>
              </div>

              {/* Extra Child Info if Orang Tua or Both */}
              {(selectedRole === 'orang_tua' || selectedRole === 'both') && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <h5 className="text-xs font-black text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                    <span>👶</span>
                    <span>Data Anak yang Didampingi:</span>
                  </h5>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Nama Panggilan Anak:</label>
                    <input
                      type="text"
                      value={childName}
                      onChange={e => setChildName(e.target.value)}
                      required
                      placeholder="Contoh: Alif / Nayla"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold focus:ring-2 focus:ring-[#21736A] focus:outline-none bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Usia Anak:</label>
                      <input
                        type="number"
                        min="3"
                        max="17"
                        value={childAge}
                        onChange={e => setChildAge(Number(e.target.value))}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold focus:ring-2 focus:ring-[#21736A] focus:outline-none bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Gender Anak:</label>
                      <select
                        value={childGender}
                        onChange={e => setChildGender(e.target.value as UserGender)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold focus:ring-2 focus:ring-[#21736A] focus:outline-none bg-white"
                      >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Profile */}
              <div className="pt-2 flex gap-3">
                {currentUser && (
                  <button
                    type="button"
                    onClick={() => setStep('login')}
                    className="py-3 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-[#21736A] to-[#143D37] hover:opacity-95 text-white font-black text-sm shadow-lg shadow-teal-900/30 transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Menyimpan ke Cloud...' : 'Simpan & Lanjutkan Masuk ✓'}
                </button>
              </div>
            </form>
          ) : (
            /* VIEW C: GMAIL SIGN IN OPTIONS */
            <div className="space-y-5 text-center">
              <div className="py-2">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-rose-500 to-teal-500 p-0.5 shadow-xl">
                  <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center text-3xl">
                    🦷
                  </div>
                </div>
                <h4 className="text-lg font-black text-[#143D37] mt-3 font-['Fredoka']">
                  Selamat Datang di Dentika!
                </h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto mt-1 font-medium leading-relaxed">
                  Masuk dengan akun Gmail untuk menyimpan petualangan kesehatan gigimu, membuka level bertahap, dan sinkronisasi ke Cloud Firebase.
                </p>
              </div>

              {/* Primary Google Login Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400 text-gray-800 font-black text-sm shadow-md flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{loading ? 'Menghubungkan Akun...' : 'Masuk dengan Akun Google (Gmail)'}</span>
              </button>

              {/* Direct Quick Login & Super Admin Access */}
              <div className="pt-2 border-t border-gray-200">
                <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block mb-2">
                  Akses Cepat Pengujian:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickSignIn(SUPER_ADMIN_EMAIL, 'Super Admin Nazda')}
                    className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-300 text-purple-900 text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>👑</span>
                    <span>Masuk Super Admin ({SUPER_ADMIN_EMAIL})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickSignIn('orangtua.dentika@gmail.com', 'Bunda Maya')}
                    className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>👨‍👩‍👧</span>
                    <span>Masuk Akun Keluarga</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
