import React from 'react';
import { RiskWarningData } from '../types';
import { soundEffects } from '../utils/audio';

interface RiskWarningModalProps {
  data: RiskWarningData | null;
  onClose: () => void;
}

export const RiskWarningModal: React.FC<RiskWarningModalProps> = ({ data, onClose }) => {
  if (!data) return null;

  const isHighSeverity = data.severity === 'high';

  const handleConfirm = async () => {
    soundEffects.tap();
    await data.action();
    onClose();
  };

  const handleCancel = () => {
    soundEffects.tap();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-4 border-amber-400 overflow-hidden transform transition-all scale-100 animate-scale-up">
        {/* Header Alert */}
        <div className={`p-5 text-white flex items-center gap-3 ${
          isHighSeverity ? 'bg-gradient-to-r from-red-600 to-rose-700' : 'bg-gradient-to-r from-amber-500 to-orange-600'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-inner border border-white/30">
            {isHighSeverity ? '🚨' : '⚠️'}
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-extrabold bg-black/20 px-2.5 py-0.5 rounded-full">
              Peringatan Risiko Pengeditan
            </span>
            <h3 className="text-lg font-black font-['Fredoka'] leading-tight mt-0.5">
              {data.title}
            </h3>
          </div>
        </div>

        {/* Content & Risk Breakdown */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed font-medium">
            {data.description}
          </p>

          <div className={`p-4 rounded-2xl border-2 ${
            isHighSeverity 
              ? 'bg-red-50 border-red-300 text-red-900' 
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}>
            <div className="flex items-start gap-2.5">
              <span className="text-xl">⚠️</span>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wide">
                  Keterangan Risiko Tindakan:
                </h4>
                <p className="text-xs font-semibold mt-1 leading-normal">
                  {data.riskNotice}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 italic text-center">
            Apakah Anda yakin ingin menyetujui dan melanjutkan proses ini?
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="py-3 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-sm transition-all border border-gray-300 active:scale-95 cursor-pointer"
            >
              {data.cancelLabel || 'Batalkan (Tidak)'}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`py-3 px-4 rounded-2xl text-white font-extrabold text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
                isHighSeverity
                  ? 'bg-gradient-to-r from-red-600 to-rose-700 hover:opacity-95 shadow-red-900/30'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:opacity-95 shadow-emerald-900/30'
              }`}
            >
              <span>✓</span>
              <span>{data.confirmLabel || 'Setuju & Lanjutkan'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
