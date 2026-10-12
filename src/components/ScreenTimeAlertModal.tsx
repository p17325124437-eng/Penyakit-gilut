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
    <div className="fixed inset-0 bg-[#143D37]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#FAFDF9] rounded-3xl border-2 border-[#C4DCAC] p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
        <div className="flex justify-center">
          <MouthToothMascot
            expression="thinking"
            size="lg"
            hat="hat_doctor"
          />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase text-[#8F4619] bg-[#FAF2E8] border border-[#FEE8A2] px-3.5 py-1 rounded-full">
            Waktunya Istirahat! 🛌
          </span>
          <h2 className="text-2xl font-black text-[#143D37] font-['Fredoka']">
            Gigimu Butuh Tidur Nyenyak
          </h2>
          <p className="text-xs sm:text-sm text-[#143D37]/75 font-medium">
            Hebat sekali! Kamu sudah belajar kesehatan gigi hari ini hingga batas waktu yang diatur orang tuamu. Yuk istirahat sejenak, regangkan tubuh, dan minum air putih segar!
          </p>
        </div>

        {!showPinInput ? (
          <div className="space-y-2 pt-2">
            <button
              onClick={() => setShowPinInput(true)}
              className="text-xs font-bold text-[#21736A] hover:text-[#143D37] underline block mx-auto cursor-pointer"
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
              className="w-full text-center py-2.5 px-4 rounded-xl border-2 border-[#C4DCAC] focus:border-[#21736A] focus:outline-hidden font-bold text-base bg-white text-[#143D37]"
              autoFocus
            />
            {error && <p className="text-xs text-[#D95B43] font-bold">PIN salah.</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowPinInput(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#EFF6E9] hover:bg-[#E2F8F1] text-[#143D37] border border-[#C4DCAC] text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#21736A] to-[#143D37] text-white text-xs font-bold shadow-md shadow-[#143D37]/25 cursor-pointer"
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
