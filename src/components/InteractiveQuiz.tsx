import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../types';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { soundEffects, speakText, stopSpeech } from '../utils/audio';
import { BackButton3D, CheckButton3D, Coin3D, Star3D, Trophy3D } from './GameIcons';

interface QuizProps {
  speechEnabled: boolean;
  onQuizComplete: (results: { correct: number; total: number; scoreEarned: number; coinsEarned: number }) => void;
  onBack: () => void;
}

export const InteractiveQuiz: React.FC<QuizProps> = ({
  speechEnabled,
  onQuizComplete,
  onBack,
}) => {
  const [questionList, setQuestionList] = useState<QuizQuestion[]>(() => {
    return [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const currentQ = questionList[currentIndex];

  const handleReadQuestion = () => {
    if (!currentQ) return;
    const textToRead = `${currentQ.question}. Pilihan jawaban: ` + currentQ.options.map((o, idx) => `${idx + 1}, ${o.text}`).join('. ');
    speakText(textToRead);
  };

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;
    soundEffects.tap();
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const chosenOption = currentQ.options.find(o => o.id === selectedOptionId);
    const isCorrect = chosenOption?.isCorrect ?? false;

    if (isCorrect) {
      soundEffects.correct();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      setCorrectCount(prev => prev + 1);
      setTotalScore(prev => prev + currentQ.points);
      if (speechEnabled) {
        speakText('Hebat sekali! Jawabanmu benar!');
      }
    } else {
      soundEffects.wrong();
      if (speechEnabled) {
        speakText('Kurang tepat! Yuk simak penjelasannya.');
      }
    }
  };

  const handleNextQuestion = () => {
    soundEffects.tap();
    stopSpeech();
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);

    if (currentIndex + 1 < questionList.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finished quiz!
      soundEffects.fanfare();
      setShowSummary(true);
      const earnedCoins = (correctCount + 1) * 30;
      onQuizComplete({
        correct: correctCount,
        total: questionList.length,
        scoreEarned: totalScore,
        coinsEarned: earnedCoins,
      });
    }
  };

  const handleRestart = () => {
    soundEffects.tap();
    const newQuestions = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuestionList(newQuestions);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setCorrectCount(0);
    setTotalScore(0);
    setShowSummary(false);
  };

  if (showSummary) {
    const accuracy = Math.round((correctCount / questionList.length) * 100);
    const earnedCoins = (correctCount + 1) * 30;

    return (
      <div className="max-w-2xl mx-auto bg-[#FAFDF9] rounded-3xl border-2 border-[#C4DCAC] p-7 text-center shadow-xl space-y-6">
        <div className="w-24 h-24 mx-auto flex items-center justify-center animate-bounce-gentle">
          <Trophy3D size={84} />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-[#21736A] bg-[#E2F8F1] px-3.5 py-1 rounded-full border border-[#6ED5B6]/50 inline-block">
            Misi Kuis Selesai!
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#143D37] font-['Fredoka']">
            {accuracy >= 80 ? 'Pakar Gigi Bintang Lima! 🌟' : 'Terus Semangat Belajar! 💪'}
          </h2>
          <p className="text-sm text-[#143D37]/80 font-bold">
            Kamu telah menjawab {correctCount} dari {questionList.length} pertanyaan dengan benar ({accuracy}%).
          </p>
        </div>

        {/* Currency Rewards Received */}
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
          <div className="bg-[#FAF2E8] border border-[#F5B842] p-3.5 rounded-2xl flex flex-col items-center">
            <Coin3D size={28} />
            <div className="text-lg font-black text-[#8F4619] mt-1">+{earnedCoins}</div>
            <div className="text-[11px] font-extrabold text-[#8F4619]/80">Koin Gigi</div>
          </div>

          <div className="bg-[#FFFBE8] border border-[#FACC15] p-3.5 rounded-2xl flex flex-col items-center">
            <Star3D size={28} />
            <div className="text-lg font-black text-[#854D0E] mt-1">+{Math.ceil(correctCount / 2)}</div>
            <div className="text-[11px] font-extrabold text-[#854D0E]/80">Bintang Senyum</div>
          </div>

          <div className="bg-[#E2F8F1] border border-[#6ED5B6] p-3.5 rounded-2xl flex flex-col items-center">
            <span className="text-2xl">🎯</span>
            <div className="text-lg font-black text-[#143D37] mt-1">+{totalScore}</div>
            <div className="text-[11px] font-extrabold text-[#21736A]">Skor Total</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={handleRestart}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-white bg-gradient-to-r from-[#D97724] to-[#BF7E43] hover:opacity-95 shadow-md shadow-[#D97724]/25 transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🔄</span>
            <span>Main Kuis Lagi</span>
          </button>

          <button
            onClick={() => {
              soundEffects.tap();
              onBack();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-[#143D37] bg-[#EFF6E9] hover:bg-[#E2F8F1] border border-[#C4DCAC] transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🏠</span>
            <span>Kembali ke Menu</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Top quiz bar */}
      <div className="flex items-center justify-between gap-3 bg-[#FAFDF9] p-4 rounded-3xl border-2 border-[#C4DCAC] shadow-sm">
        <button
          onClick={() => {
            soundEffects.tap();
            stopSpeech();
            onBack();
          }}
          className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          title="Keluar dari Kuis"
        >
          <BackButton3D size={40} />
        </button>

        {/* Progress indicator (Gambar 4) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#21736A]">Soal</span>
          <span className="text-sm font-black text-[#143D37] bg-[#EFF6E9] border border-[#C4DCAC] px-3.5 py-1 rounded-full">
            {currentIndex + 1} / {questionList.length}
          </span>
        </div>

        {/* Read question button */}
        <button
          onClick={handleReadQuestion}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#E2F8F1] hover:bg-[#CEF2E7] text-[#21736A] border border-[#6ED5B6] font-black text-xs transition-transform active:scale-95 cursor-pointer"
        >
          <span>🔊</span>
          <span>Bacakan</span>
        </button>
      </div>

      {/* Question Card */}
      <div className="bg-[#FAFDF9] rounded-3xl border-2 border-[#C4DCAC] p-6 sm:p-7 shadow-sm space-y-6">
        {/* Category tag */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-[#143D37] bg-[#EFF6E9] border border-[#C4DCAC] px-3 py-1 rounded-full">
            🍃 {currentQ.categoryLabel}
          </span>
          <span className="text-xs font-black text-[#8F4619] bg-[#FAF2E8] border border-[#F5B842] px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Star3D size={16} />
            <span>+{currentQ.points} Poin</span>
          </span>
        </div>

        {/* Question Text */}
        <h3 className="text-lg sm:text-2xl font-black text-[#143D37] font-['Fredoka'] leading-snug">
          {currentQ.question}
        </h3>

        {/* Options List */}
        <div className="grid grid-cols-1 gap-3">
          {currentQ.options.map(opt => {
            const isSelected = selectedOptionId === opt.id;
            let btnStyle = 'border-[#C4DCAC]/80 bg-[#EFF6E9]/60 hover:bg-[#EFF6E9] hover:border-[#21736A] text-[#143D37]';

            if (isAnswerSubmitted) {
              if (opt.isCorrect) {
                btnStyle = 'border-[#21736A] bg-[#E2F8F1] text-[#143D37] font-black ring-2 ring-[#6ED5B6]';
              } else if (isSelected && !opt.isCorrect) {
                btnStyle = 'border-[#D95B43] bg-[#FDF0E9] text-[#B86230] font-bold';
              } else {
                btnStyle = 'border-[#C4DCAC]/40 bg-slate-50 opacity-60 text-slate-400';
              }
            } else if (isSelected) {
              btnStyle = 'border-[#D97724] bg-[#FAF2E8] text-[#143D37] font-black ring-2 ring-[#F5B842]';
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                disabled={isAnswerSubmitted}
                className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-3.5 transition-all active:scale-98 cursor-pointer ${btnStyle}`}
              >
                <span className="text-2xl sm:text-3xl shrink-0 p-2 bg-[#FAFDF9] rounded-xl shadow-2xs border border-black/5">
                  {opt.icon}
                </span>
                <span className="text-sm sm:text-base font-bold flex-1 leading-snug">
                  {opt.text}
                </span>
                {isAnswerSubmitted && opt.isCorrect && (
                  <span className="text-xs sm:text-sm font-black bg-[#22C55E] text-white px-3 py-1 rounded-full shadow-xs">
                    ✓ Benar!
                  </span>
                )}
                {isAnswerSubmitted && isSelected && !opt.isCorrect && (
                  <span className="text-xs sm:text-sm font-black bg-[#EF4444] text-white px-3 py-1 rounded-full shadow-xs">
                    ✗ Kurang Tepat
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Post-submit explanation with Gambar 4 notification style */}
        {isAnswerSubmitted && (
          <div className="p-4 rounded-2xl bg-[#EFF6E9] border-2 border-[#6ED5B6] text-[#143D37] space-y-1">
            <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider text-[#21736A]">
              <span>💡</span>
              <span>Pelajaran Dokter Cilik:</span>
            </div>
            <p className="text-xs sm:text-sm font-bold leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Action Button: Periksa Jawaban or Soal Berikutnya */}
        <div className="pt-2">
          {!isAnswerSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedOptionId}
              className={`w-full py-3.5 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                selectedOptionId
                  ? 'bg-gradient-to-r from-[#D97724] to-[#BF7E43] hover:opacity-95 text-white shadow-[#D97724]/30 active:scale-98'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Periksa Jawaban</span>
              <CheckButton3D size={24} />
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="w-full py-3.5 rounded-2xl font-black text-base bg-gradient-to-r from-[#21736A] via-[#29827D] to-[#143D37] hover:opacity-95 text-white shadow-md shadow-[#143D37]/30 transition-transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentIndex + 1 < questionList.length ? 'Soal Berikutnya' : 'Lihat Hasil Kuis'}</span>
              <span>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
