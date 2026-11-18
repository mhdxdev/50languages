'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  RotateCw,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  VolumeX,
  Turtle,
} from 'lucide-react';
import { Phrase, Language } from '@/types';
import { useLanguageLearning } from '@/context/LanguageLearningContext';

interface FlashcardDeckProps {
  phrases: Phrase[];
  nativeLang: Language;
  targetLang: Language;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  phrases,
  nativeLang,
  targetLang,
}) => {
  const { playAudio } = useLanguageLearning();
  const [deck, setDeck] = useState<Phrase[]>(phrases);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setDeck(phrases);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredCount(0);
    setIsCompleted(false);
  }, [phrases]);

  const currentCard = deck[currentIndex];

  const getNativeText = (phrase: Phrase) => {
    if (nativeLang.code === 'uz') return phrase.uz;
    if (nativeLang.code === 'ru') return phrase.ru;
    return phrase.en;
  };

  const getTargetText = (phrase: Phrase) => {
    if (targetLang.code === 'uz') return phrase.uz;
    if (targetLang.code === 'ru') return phrase.ru;
    if (targetLang.code === 'en') return phrase.en;
    return phrase.translations?.[targetLang.code] || phrase.en;
  };

  const getPhonetic = (phrase: Phrase) => {
    return phrase.transliterations?.[targetLang.code] || '';
  };

  const handleFlip = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    if (nextFlipped && currentCard) {
      playAudio(getTargetText(currentCard), targetLang.code, 1.0);
    }
  };

  const handleMastered = () => {
    const newMastered = masteredCount + 1;
    setMasteredCount(newMastered);

    if (currentIndex + 1 >= deck.length) {
      setIsCompleted(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePracticeAgain = () => {
    if (!currentCard) return;
    // Push current card to end of deck
    setDeck((prev) => [...prev, currentCard]);
    setCurrentIndex((prev) => prev + 1);
    setIsFlipped(false);
  };

  const handleRestart = () => {
    setDeck(phrases);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredCount(0);
    setIsCompleted(false);
  };

  if (isCompleted || !currentCard) {
    return (
      <div className="p-8 sm:p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl max-w-xl mx-auto space-y-5">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
          Outstanding! All Cards Mastered!
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          You reviewed all {phrases.length} phrases in this lesson with active recall and authentic audio pronunciation.
        </p>
        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Practice Deck Again</span>
        </button>
      </div>
    );
  }

  const nativeText = getNativeText(currentCard);
  const targetText = getTargetText(currentCard);
  const phonetic = getPhonetic(currentCard);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress & Deck Status Bar */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>
            Card {currentIndex + 1} of {deck.length}
          </span>
        </div>
        <div>Mastered: {masteredCount} / {phrases.length}</div>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          style={{ width: `${Math.round(((currentIndex + 1) / deck.length) * 100)}%` }}
          className="h-full bg-brand-600 rounded-full transition-all duration-300"
        />
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={handleFlip}
        className="w-full min-h-[300px] sm:min-h-[360px] p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl cursor-pointer select-none transition-all duration-300 hover:shadow-2xl flex flex-col justify-between text-center relative group"
      >
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
          {isFlipped ? `${targetLang.nativeName} (${targetLang.flag})` : `${nativeLang.nativeName} (${nativeLang.flag})`}
        </span>

        {/* Center Content */}
        <div className="my-auto py-6">
          {!isFlipped ? (
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                {nativeText}
              </p>
              <span className="inline-block mt-4 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-3 py-1 rounded-full">
                Click or tap card to flip
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              <p
                dir={targetLang.dir}
                className="text-2xl sm:text-3xl font-black text-brand-600 dark:text-brand-400 tracking-tight leading-snug"
              >
                {targetText}
              </p>
              {phonetic && (
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 italic">
                  [{phonetic}]
                </p>
              )}
            </div>
          )}
        </div>

        {/* Card Footer Tools */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Click to flip</span>
          </span>

          {isFlipped && (
            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => playAudio(targetText, targetLang.code, 1.0)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold transition-colors"
                title="Play Audio Normal Speed"
              >
                <Volume2 className="w-4 h-4" />
                <span>1.0x</span>
              </button>
              <button
                type="button"
                onClick={() => playAudio(targetText, targetLang.code, 0.7)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold transition-colors"
                title="Play Audio Slow"
              >
                <Turtle className="w-4 h-4 text-emerald-500" />
                <span>0.7x</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review Actions: Practice Again vs Mastered */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={handlePracticeAgain}
          className="py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all"
        >
          Practice Again (Re-queue)
        </button>
        <button
          type="button"
          onClick={handleMastered}
          className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all"
        >
          Mastered ✓
        </button>
      </div>
    </div>
  );
};
