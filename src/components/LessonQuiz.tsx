'use client';

import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Award,
  ArrowRight,
  Headphones,
} from 'lucide-react';
import { Phrase, Language, QuizQuestion } from '@/types';
import { useLanguageLearning } from '@/context/LanguageLearningContext';

interface LessonQuizProps {
  lessonId: number;
  phrases: Phrase[];
  nativeLang: Language;
  targetLang: Language;
}

export const LessonQuiz: React.FC<LessonQuizProps> = ({
  lessonId,
  phrases,
  nativeLang,
  targetLang,
}) => {
  const { playAudio, saveQuizScore, toggleLessonCompleted, isLessonCompleted } =
    useLanguageLearning();

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

  // Generate 10 randomized interactive questions
  const questions: QuizQuestion[] = useMemo(() => {
    if (!phrases || phrases.length === 0) return [];

    const pool = [...phrases];
    const generated: QuizQuestion[] = [];
    const count = Math.min(10, pool.length);

    for (let i = 0; i < count; i++) {
      const phrase = pool[i];
      const nativeText = getNativeText(phrase);
      const targetText = getTargetText(phrase);
      const phonetic = phrase.transliterations?.[targetLang.code];

      // Rotate between question types
      const types: QuizQuestion['type'][] = [
        'native-to-target',
        'target-to-native',
        'listening',
      ];
      const qType = types[i % 3];

      // Pick 3 distractors
      const otherPhrases = pool.filter((p) => p.id !== phrase.id);
      const shuffledOthers = [...otherPhrases].sort(() => Math.random() - 0.5);

      if (qType === 'native-to-target') {
        const distractors = shuffledOthers.slice(0, 3).map((p) => getTargetText(p));
        const options = [...distractors, targetText].sort(() => Math.random() - 0.5);

        generated.push({
          id: i + 1,
          type: 'native-to-target',
          prompt: `Select the correct translation in ${targetLang.nativeName}:`,
          audioText: targetText,
          audioLang: targetLang.code,
          options,
          correctAnswer: targetText,
          phraseId: phrase.id,
          phonetic,
        });
      } else if (qType === 'target-to-native') {
        const distractors = shuffledOthers.slice(0, 3).map((p) => getNativeText(p));
        const options = [...distractors, nativeText].sort(() => Math.random() - 0.5);

        generated.push({
          id: i + 1,
          type: 'target-to-native',
          prompt: `What does "${targetText}" mean in ${nativeLang.nativeName}?`,
          audioText: targetText,
          audioLang: targetLang.code,
          options,
          correctAnswer: nativeText,
          phraseId: phrase.id,
          phonetic,
        });
      } else {
        // Listening Challenge
        const distractors = shuffledOthers.slice(0, 3).map((p) => getNativeText(p));
        const options = [...distractors, nativeText].sort(() => Math.random() - 0.5);

        generated.push({
          id: i + 1,
          type: 'listening',
          prompt: `Listening Challenge: Listen to the audio and select what you hear in ${nativeLang.nativeName}:`,
          audioText: targetText,
          audioLang: targetLang.code,
          options,
          correctAnswer: nativeText,
          phraseId: phrase.id,
          phonetic,
        });
      }
    }

    return generated;
  }, [phrases, nativeLang.code, targetLang.code]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [answeredState, setAnsweredState] = useState<boolean>(false);

  const currentQ = questions[currentIdx];

  const handleSelectOption = (opt: string) => {
    if (answeredState) return; // Prevent changing after answer
    setSelectedOption(opt);
    setAnsweredState(true);

    const isCorrect = opt === currentQ.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      const finalScore = score + (selectedOption === currentQ.correctAnswer ? 0 : 0);
      const scorePercent = Math.round((finalScore / questions.length) * 100);
      saveQuizScore(lessonId, scorePercent);

      if (scorePercent >= 70 && !isLessonCompleted(lessonId)) {
        toggleLessonCompleted(lessonId);
      }
      setIsFinished(true);
    } else {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setAnsweredState(false);
    }
  };

  const handleRetake = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
    setAnsweredState(false);
  };

  if (isFinished) {
    const scorePercent = Math.round((score / questions.length) * 100);
    const passed = scorePercent >= 70;

    return (
      <div className="p-8 sm:p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl max-w-xl mx-auto space-y-6">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto border ${
            passed
              ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
              : 'bg-amber-500/15 text-amber-500 border-amber-500/30'
          }`}
        >
          {passed ? <Award className="w-10 h-10" /> : <HelpCircle className="w-10 h-10" />}
        </div>

        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {passed ? 'Congratulations! Quiz Passed!' : 'Good Effort! Keep Practicing!'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            You scored {score} out of {questions.length} questions ({scorePercent}%).
            {passed
              ? ' This lesson has been marked as completed in your curriculum!'
              : ' Score at least 70% to earn the completion badge.'}
          </p>
        </div>

        <button
          onClick={handleRetake}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Quiz</span>
        </button>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress & Question Counter */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>
            Question {currentIdx + 1} of {questions.length}
          </span>
        </div>
        <div>Current Score: {score}</div>
      </div>

      <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          style={{ width: `${Math.round(((currentIdx + 1) / questions.length) * 100)}%` }}
          className="h-full bg-brand-600 rounded-full transition-all duration-300"
        />
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {currentQ.type === 'listening'
              ? 'Listening Comprehension'
              : currentQ.type === 'native-to-target'
              ? `Translate into ${targetLang.nativeName}`
              : `Translate into ${nativeLang.nativeName}`}
          </span>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
            {currentQ.prompt}
          </h3>

          {/* Audio button for listening challenge or question phrase */}
          {currentQ.audioText && (
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  playAudio(currentQ.audioText!, currentQ.audioLang || targetLang.code, 1.0)
                }
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-xs hover:bg-brand-500/20 transition-colors border border-brand-500/30"
              >
                <Headphones className="w-4 h-4" />
                <span>Play Sound Clip</span>
              </button>
              {currentQ.phonetic && currentQ.type !== 'listening' && (
                <span className="text-xs text-slate-400 italic">
                  [{currentQ.phonetic}]
                </span>
              )}
            </div>
          )}
        </div>

        {/* Options Grid */}
        <div className="space-y-2.5">
          {currentQ.options.map((opt, i) => {
            let btnStyle =
              'border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200';

            if (answeredState) {
              if (opt === currentQ.correctAnswer) {
                btnStyle =
                  'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/40';
              } else if (opt === selectedOption) {
                btnStyle =
                  'border-rose-500 bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold ring-2 ring-rose-500/40';
              } else {
                btnStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
              }
            }

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectOption(opt)}
                disabled={answeredState}
                className={`w-full p-4 rounded-2xl border text-left font-semibold text-sm transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt}</span>
                {answeredState && opt === currentQ.correctAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 ml-2" />
                )}
                {answeredState && opt === selectedOption && opt !== currentQ.correctAnswer && (
                  <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Next Question Button */}
        {answeredState && (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02]"
            >
              <span>
                {currentIdx + 1 >= questions.length ? 'View Results' : 'Next Question'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
