import React, { useState } from 'react';
import { MouthToothMascot } from './MouthToothMascot';
import { soundEffects } from '../utils/audio';

interface ScreenTimeProps {
  onParentUnlock: (enteredPin: string) => boolean;
  onExtend: () => void;
}

export const ScreenTimeAlertModal: React.FC<ScreenTimeProps> = ({
  onParentUnlock,
  onExtend,
}) => {
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onParentUnlock(pin)) {
      soundEffects.correct();
      onExtend();
    } else {
      soundEffects.wrong();
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border-2 border-emerald-200 p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
        <div className="flex justify-center">
          <MouthToothMascot
            expression="thinking"
            size="lg"
            hat="hat_doctor"
          />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            Waktunya Istirahat! 🛌
          </span>
          <h2 className="text-2xl font-black text-slate-800 font-['Fredoka']">
            Gigimu Butuh Tidur Nyenyak
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Hebat sekali! Kamu sudah belajar kesehatan gigi hari ini hingga batas waktu yang diatur orang tuamu. Yuk istirahat sejenak, regangkan tubuh, dan minum air putih segar!
          </p>
        </div>

        {!showPinInput ? (
          <div className="space-y-2 pt-2">
            <button
              onClick={() => setShowPinInput(true)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 underline block mx-auto"
            >
              Orang Tua: Masukkan PIN untuk Menambah Waktu
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            <input
              type="password"
              inputMode="numeric"
              placeholder="PIN Orang Tua (1234)"
              value={pin}
              onChange={e => setPin(e.target.value)}
              className="w-full text-center py-2.5 px-4 rounded-xl border border-slate-300 font-bold text-base"
              autoFocus
            />
            {error && <p className="text-xs text-rose-600 font-bold">PIN salah.</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowPinInput(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold"
              >
                Buka Kunci
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
