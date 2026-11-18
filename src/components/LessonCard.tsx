'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  BookOpen,
  Sparkles,
  HelpCircle,
  Play,
  Award,
  Lock,
} from 'lucide-react';
import { Lesson } from '@/types';
import { useLanguageLearning } from '@/context/LanguageLearningContext';
import { useSubscription } from '@/context/SubscriptionContext';

interface LessonCardProps {
  lesson: Lesson;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson }) => {
  const {
    nativeLang,
    targetLang,
    isLessonCompleted,
    toggleLessonCompleted,
    quizScores,
  } = useLanguageLearning();

  const { currentUser } = useSubscription();
  const isPro = currentUser?.planId && currentUser.planId !== 'free';
  const isProLocked = !isPro && lesson.number > 10;

  const completed = isLessonCompleted(lesson.id);
  const bestScore = quizScores[lesson.id];

  // Title in Native language
  const getNativeTitle = () => {
    if (nativeLang.code === 'uz') return lesson.titleUz;
    if (nativeLang.code === 'ru') return lesson.titleRu;
    return lesson.titleEn;
  };

  // Title in Target language
  const getTargetTitle = () => {
    if (targetLang.code === 'uz') return lesson.titleUz;
    if (targetLang.code === 'ru') return lesson.titleRu;
    return lesson.titleEn;
  };

  return (
    <div
      className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1 ${
        completed
          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 shadow-md shadow-emerald-500/5'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-500 shadow-sm hover:shadow-xl'
      }`}
    >
      <div>
        {/* Top bar: Number badge + Category + Completion Toggle */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm transition-colors ${
                completed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-brand-600/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 group-hover:bg-brand-600 group-hover:text-white'
              }`}
            >
              {lesson.numberFormatted}
            </span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {lesson.category}
            </span>
            {isProLocked && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-amber-500/20 to-brand-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <Lock className="w-2.5 h-2.5" /> PRO
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {bestScore !== undefined && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <Award className="w-3 h-3" />
                {bestScore}%
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleLessonCompleted(lesson.id);
              }}
              title={completed ? 'Mark as Incomplete' : 'Mark as Completed'}
              className={`p-1.5 rounded-xl transition-colors ${
                completed
                  ? 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700'
                  : 'text-slate-300 dark:text-slate-600 hover:text-emerald-500'
              }`}
            >
              <CheckCircle2
                className={`w-5 h-5 ${completed ? 'fill-emerald-600/20' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Titles: Native & Target */}
        <Link href={`/lesson/${lesson.id}`} className="block">
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
            {getNativeTitle()}
          </h3>
          <p
            dir={targetLang.dir}
            className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1"
          >
            {targetTitleDisplay(getTargetTitle(), targetLang.flag)}
          </p>
        </Link>
      </div>

      {/* Action Buttons: Study, Flashcards, Quiz */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-1.5 text-xs font-bold">
        <Link
          href={`/lesson/${lesson.id}`}
          className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-brand-600 hover:text-white transition-all text-center"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Study</span>
        </Link>

        <Link
          href={`/lesson/${lesson.id}?tab=flashcards`}
          className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white transition-all text-center"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Cards</span>
        </Link>

        <Link
          href={`/lesson/${lesson.id}?tab=quiz`}
          className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-600 hover:text-white transition-all text-center"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Quiz</span>
        </Link>
      </div>
    </div>
  );
};

function targetTitleDisplay(title: string, flag: string) {
  return `${flag} ${title}`;
}
