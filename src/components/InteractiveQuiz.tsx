import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../types';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { soundEffects, speakText, stopSpeech } from '../utils/audio';

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
    // Shuffle questions
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
        speakText('Hampir benar! Dengarkan penjelasannya ya.');
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
    const earnedCoins = (correctCount) * 30 + 50;

    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border-2 border-amber-200 p-6 sm:p-8 text-center shadow-lg space-y-6">
        <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-3xl flex items-center justify-center text-5xl shadow-lg shadow-amber-300/50 animate-bounce-gentle">
          🏆
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
            Kuis Selesai!
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 font-['Fredoka']">
            {accuracy >= 80 ? 'Luar Biasa, Dokter Gigi Juara! 🌟' : 'Kerja Bagus, Terus Berlatih! 💪'}
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Kamu telah menjawab {correctCount} dari {questionList.length} pertanyaan dengan benar ({accuracy}%).
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl">
            <span className="text-2xl">🪙</span>
            <div className="text-lg font-black text-amber-700">+{earnedCoins}</div>
            <div className="text-[11px] font-bold text-amber-600">Koin Gigi</div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-2xl">
            <span className="text-2xl">⭐</span>
            <div className="text-lg font-black text-yellow-700">+{Math.ceil(correctCount / 2)}</div>
            <div className="text-[11px] font-bold text-yellow-600">Bintang Senyum</div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
            <span className="text-2xl">🎯</span>
            <div className="text-lg font-black text-emerald-700">+{totalScore}</div>
            <div className="text-[11px] font-bold text-emerald-600">Skor Total</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={handleRestart}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/25 transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span>🔄</span>
            <span>Main Kuis Lagi</span>
          </button>

          <button
            onClick={() => {
              soundEffects.tap();
              onBack();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-slate-700 bg-slate-100 hover:bg-slate-200 transition-transform active:scale-95 flex items-center justify-center gap-2"
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
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-3xl border-2 border-amber-100 shadow-sm">
        <button
          onClick={() => {
            soundEffects.tap();
            stopSpeech();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-transform active:scale-95"
        >
          <span>←</span>
          <span>Keluar</span>
        </button>

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Soal</span>
          <span className="text-sm font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            {currentIndex + 1} / {questionList.length}
          </span>
        </div>

        {/* Read question button */}
        <button
          onClick={handleReadQuestion}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-cyan-100 hover:bg-cyan-200 text-cyan-800 font-extrabold text-xs transition-transform active:scale-95"
        >
          <span>🔊</span>
          <span>Bacakan</span>
        </button>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl border-2 border-amber-100 p-6 sm:p-7 shadow-sm space-y-6">
        {/* Category tag */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            {currentQ.categoryLabel}
          </span>
          <span className="text-xs font-bold text-slate-500">
            +{currentQ.points} Poin
          </span>
        </div>

        {/* Question Text */}
        <h3 className="text-lg sm:text-2xl font-black text-slate-800 font-['Fredoka'] leading-snug">
          {currentQ.question}
        </h3>

        {/* Options List */}
        <div className="grid grid-cols-1 gap-3">
          {currentQ.options.map(opt => {
            const isSelected = selectedOptionId === opt.id;
            let btnStyle = 'border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-slate-800';

            if (isAnswerSubmitted) {
              if (opt.isCorrect) {
                btnStyle = 'border-emerald-500 bg-emerald-100 text-emerald-950 font-black ring-2 ring-emerald-400';
              } else if (isSelected && !opt.isCorrect) {
                btnStyle = 'border-rose-400 bg-rose-100 text-rose-950 font-bold';
              } else {
                btnStyle = 'border-slate-200 bg-slate-50 opacity-60 text-slate-500';
              }
            } else if (isSelected) {
              btnStyle = 'border-amber-500 bg-amber-100 text-amber-950 font-black ring-2 ring-amber-300';
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                disabled={isAnswerSubmitted}
                className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-3.5 transition-all active:scale-98 ${btnStyle}`}
              >
                <span className="text-2xl sm:text-3xl shrink-0 p-2 bg-white rounded-xl shadow-2xs">
                  {opt.icon}
                </span>
                <span className="text-sm sm:text-base font-bold flex-1 leading-snug">
                  {opt.text}
                </span>
                {isAnswerSubmitted && opt.isCorrect && (
                  <span className="text-xl text-emerald-600 font-black">✓ Benar!</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Post-submit explanation */}
        {isAnswerSubmitted && (
          <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-950 space-y-1">
            <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider text-cyan-800">
              <span>💡</span>
              <span>Tahukah Kamu?</span>
            </div>
            <p className="text-xs sm:text-sm font-medium leading-relaxed">
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
              className={`w-full py-3.5 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2 shadow-md ${
                selectedOptionId
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/30 active:scale-98'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Periksa Jawaban</span>
              <span>✨</span>
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="w-full py-3.5 rounded-2xl font-black text-base bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/30 transition-transform active:scale-98 flex items-center justify-center gap-2"
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
