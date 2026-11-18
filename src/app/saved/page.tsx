'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  Volume2,
  Trash2,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useLanguageLearning } from '@/context/LanguageLearningContext';
import { FlashcardDeck } from '@/components/FlashcardDeck';
import { Phrase } from '@/types';

export default function SavedPhrasesPage() {
  const {
    savedPhrases,
    removeSavedPhrase,
    playAudio,
    targetLang,
    nativeLang,
  } = useLanguageLearning();

  const [practiceMode, setPracticeMode] = useState(false);

  // Convert saved phrases into Phrase objects for FlashcardDeck
  const practiceDeckPhrases: Phrase[] = savedPhrases.map((sp, idx) => ({
    id: sp.phraseId,
    lessonId: sp.lessonId,
    order: idx + 1,
    uz: sp.nativeText,
    en: sp.targetText,
    ru: sp.nativeText,
    translations: {
      [sp.targetLangCode]: sp.targetText,
    },
    transliterations: {
      [sp.targetLangCode]: sp.phonetic || '',
    },
  }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Lessons
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <span>Saved Vocabulary & Phrases</span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                {savedPhrases.length} Items
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Review and listen to your custom vocabulary bookmarked across any of the 100 lessons
            </p>
          </div>

          {savedPhrases.length > 0 && (
            <button
              onClick={() => setPracticeMode(!practiceMode)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{practiceMode ? 'Show List View' : 'Practice as Flashcard Deck'}</span>
            </button>
          )}
        </div>

        {/* Content */}
        {savedPhrases.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Bookmark className="w-8 h-8 opacity-40" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              No saved phrases yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              While studying any lesson, click the bookmark icon on any phrase to save it here for quick review.
            </p>
            <Link
              href="/lesson/1"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Start with Lesson 1</span>
            </Link>
          </div>
        ) : practiceMode ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Saved Phrases Flashcard Practice
              </h3>
              <button
                onClick={() => setPracticeMode(false)}
                className="text-xs text-brand-600 font-bold hover:underline"
              >
                Back to phrase list
              </button>
            </div>
            <FlashcardDeck
              phrases={practiceDeckPhrases}
              nativeLang={nativeLang}
              targetLang={targetLang}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {savedPhrases.map((sp) => (
              <div
                key={sp.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Link
                      href={`/lesson/${sp.lessonId}`}
                      className="hover:text-brand-500 underline"
                    >
                      Lesson {sp.lessonId}
                    </Link>
                    <span>•</span>
                    <span>Saved {new Date(sp.savedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    {sp.nativeText}
                  </p>
                  <p className="text-sm font-black text-brand-600 dark:text-brand-400">
                    {sp.targetText}
                  </p>
                  {sp.phonetic && (
                    <p className="text-xs text-slate-500 italic">[{sp.phonetic}]</p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => playAudio(sp.targetText, sp.targetLangCode, 1.0)}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-600 hover:text-white text-slate-700 dark:text-slate-300 transition-colors"
                    title="Play Audio"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSavedPhrase(sp.id)}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
