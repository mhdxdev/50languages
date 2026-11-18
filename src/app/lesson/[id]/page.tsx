'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
  Volume2,
  Turtle,
  Bookmark,
  Copy,
  Check,
  Eye,
  EyeOff,
  Play,
  Pause,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Sparkles,
  HelpCircle,
  Share2,
  Lock,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { FlashcardDeck } from '@/components/FlashcardDeck';
import { LessonQuiz } from '@/components/LessonQuiz';
import { UpgradeModal } from '@/components/UpgradeModal';
import { useLanguageLearning } from '@/context/LanguageLearningContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { LESSONS_CATALOG } from '@/data/lessonsCatalog';
import { getPhrasesForLesson } from '@/data/phrasesData';
import { Phrase } from '@/types';

export default function LessonWorkspacePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const lessonId = parseInt(params.id as string, 10) || 1;

  const {
    nativeLang,
    targetLang,
    isLessonCompleted,
    toggleLessonCompleted,
    playAudio,
    stopAudio,
    isPlayingAudio,
    activeSpeechText,
    isPhraseSaved,
    toggleBookmarkPhrase,
  } = useLanguageLearning();

  const { currentUser } = useSubscription();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const isPro = currentUser?.planId && currentUser.planId !== 'free';
  const isProNotice = !isPro && lessonId > 10;

  // Tab state: 'phrases' | 'flashcards' | 'quiz'
  const initialTab = (searchParams.get('tab') as 'phrases' | 'flashcards' | 'quiz') || 'phrases';
  const [activeTab, setActiveTab] = useState<'phrases' | 'flashcards' | 'quiz'>(initialTab);

  // Toolbar toggles
  const [showTargetText, setShowTargetText] = useState(true);
  const [showPhonetics, setShowPhonetics] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // "Play All" continuous playlist state
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);
  const playAllTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const lesson = LESSONS_CATALOG.find((l) => l.id === lessonId) || LESSONS_CATALOG[0];
  const phrases = getPhrasesForLesson(lessonId);
  const isCompleted = isLessonCompleted(lessonId);

  const prevLessonId = lessonId > 1 ? lessonId - 1 : null;
  const nextLessonId = lessonId < 100 ? lessonId + 1 : null;

  // Title in Native & Target languages
  const getNativeTitle = () => {
    if (nativeLang.code === 'uz') return lesson.titleUz;
    if (nativeLang.code === 'ru') return lesson.titleRu;
    return lesson.titleEn;
  };

  const getTargetTitle = () => {
    if (targetLang.code === 'uz') return lesson.titleUz;
    if (targetLang.code === 'ru') return lesson.titleRu;
    if (targetLang.code === 'en') return lesson.titleEn;
    return lesson.titleEn;
  };

  const getNativePhraseText = (p: Phrase) => {
    if (nativeLang.code === 'uz') return p.uz;
    if (nativeLang.code === 'ru') return p.ru;
    return p.en;
  };

  const getTargetPhraseText = (p: Phrase) => {
    if (targetLang.code === 'uz') return p.uz;
    if (targetLang.code === 'ru') return p.ru;
    if (targetLang.code === 'en') return p.en;
    return p.translations?.[targetLang.code] || p.en;
  };

  const getPhoneticText = (p: Phrase) => {
    return p.transliterations?.[targetLang.code] || '';
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Continuous "Play All" loop
  const handleTogglePlayAll = () => {
    if (isPlayingAll) {
      stopAudio();
      setIsPlayingAll(false);
      setCurrentPlayingIndex(null);
      if (playAllTimeoutRef.current) clearTimeout(playAllTimeoutRef.current);
    } else {
      setIsPlayingAll(true);
      playPhraseSequence(0);
    }
  };

  const playPhraseSequence = (index: number) => {
    if (index >= phrases.length) {
      setIsPlayingAll(false);
      setCurrentPlayingIndex(null);
      return;
    }

    setCurrentPlayingIndex(index);
    const phrase = phrases[index];
    const targetText = getTargetPhraseText(phrase);

    playAudio(targetText, targetLang.code, 1.0);

    // Estimate duration based on text length + pause
    const wordCount = targetText.split(' ').length;
    const durationMs = Math.max(wordCount * 450 + 1200, 2200);

    playAllTimeoutRef.current = setTimeout(() => {
      playPhraseSequence(index + 1);
    }, durationMs);
  };

  // Cleanup on unmount or tab switch
  useEffect(() => {
    return () => {
      if (playAllTimeoutRef.current) clearTimeout(playAllTimeoutRef.current);
      stopAudio();
    };
  }, [stopAudio]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Navigation Breadcrumb & Lesson Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> 100 Lessons
              </Link>
              <span>/</span>
              <span>{lesson.category}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-brand-500/20">
                {lesson.numberFormatted}
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {getNativeTitle()}
                </h1>
                <p
                  dir={targetLang.dir}
                  className="text-sm font-bold text-brand-600 dark:text-brand-400 mt-0.5"
                >
                  {targetLang.flag} {getTargetTitle()}
                </p>
              </div>
            </div>
          </div>

          {/* Mark Complete Checkbox Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleLessonCompleted(lessonId)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-sm ${
                isCompleted
                  ? 'bg-emerald-600 text-white shadow-emerald-600/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'Completed ✓' : 'Mark Completed'}</span>
            </button>
          </div>
        </div>

        {/* Pro Tier Learner Banner */}
        {isProNotice && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-indigo-500/10 border border-amber-500/20 dark:border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Advanced Lesson {lessonId} — Pro Language Tier
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upgrade to Pro to unlock all 100 lessons, HD offline audio, flashcards & priority tutor support.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-brand-600 text-white shadow-md shadow-brand-500/20 hover:scale-105 transition-all self-start sm:self-auto flex-shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upgrade to Pro</span>
            </button>
          </div>
        )}

        {/* 3 Interactive Tabs */}
        <div className="flex items-center p-1 bg-slate-200/80 dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('phrases')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
              activeTab === 'phrases'
                ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Phrasebook ({phrases.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
              activeTab === 'flashcards'
                ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Interactive Flashcards</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
              activeTab === 'quiz'
                ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            <span>Lesson Quiz</span>
          </button>
        </div>

        {/* TAB 1: PHRASEBOOK & AUDIO LIST */}
        {activeTab === 'phrases' && (
          <div className="space-y-4">
            {/* Study Controls Toolbar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-sm">
              {/* Left toggles: Hide Target Text, Hide Phonetics */}
              <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-slate-700 dark:text-slate-300">
                <button
                  type="button"
                  onClick={() => setShowTargetText(!showTargetText)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
                    showTargetText
                      ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                  title="Toggle target language visibility for active recall"
                >
                  {showTargetText ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span>{showTargetText ? 'Target Visible' : 'Target Hidden'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPhonetics(!showPhonetics)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
                    showPhonetics
                      ? 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800'
                      : 'border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <span>Phonetics: {showPhonetics ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              {/* Right: Play All Audio Continuous Playlist */}
              <button
                type="button"
                onClick={handleTogglePlayAll}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                  isPlayingAll
                    ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/30'
                    : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-500/25 hover:scale-[1.02]'
                }`}
              >
                {isPlayingAll ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isPlayingAll ? 'Stop Auto-Play' : 'Play All Phrases Audio'}</span>
              </button>
            </div>

            {/* Phrases Dual Column List */}
            <div className="space-y-2.5">
              {phrases.map((phrase, idx) => {
                const nativeText = getNativePhraseText(phrase);
                const targetText = getTargetPhraseText(phrase);
                const phonetic = getPhoneticText(phrase);
                const isBookmarked = isPhraseSaved(phrase.id);
                const isCurrentlyPlaying = currentPlayingIndex === idx;

                return (
                  <div
                    key={phrase.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                      isCurrentlyPlaying
                        ? 'bg-brand-50 dark:bg-brand-950/40 border-brand-500 shadow-md ring-2 ring-brand-500/30'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Number + Native Text */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                          {phrase.order}
                        </span>
                        <div className="min-w-0">
                          <p className="text-base font-bold text-slate-900 dark:text-white">
                            {nativeText}
                          </p>
                          <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                            {nativeLang.nativeName} ({nativeLang.flag})
                          </span>
                        </div>
                      </div>

                      {/* Right: Target Language Text (with RTL support) + Phonetic */}
                      <div className="flex-1 min-w-0 md:text-right">
                        {showTargetText ? (
                          <div>
                            <p
                              dir={targetLang.dir}
                              className="text-base sm:text-lg font-black text-brand-600 dark:text-brand-400 tracking-tight"
                            >
                              {targetText}
                            </p>
                            {showPhonetics && phonetic && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-0.5">
                                [{phonetic}]
                              </p>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowTargetText(true)}
                            className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg hover:text-brand-500"
                          >
                            Click to reveal translation
                          </button>
                        )}
                      </div>

                      {/* Action Tools: Play 1.0x, Slow 0.7x, Bookmark, Copy */}
                      <div className="flex items-center justify-end gap-1.5 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                        {/* Audio 1.0x */}
                        <button
                          type="button"
                          onClick={() => playAudio(targetText, targetLang.code, 1.0)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-600 hover:text-white text-slate-700 dark:text-slate-300 transition-colors"
                          title="Listen at normal speed (1.0x)"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>

                        {/* Audio Slow 0.7x */}
                        <button
                          type="button"
                          onClick={() => playAudio(targetText, targetLang.code, 0.7)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-300 transition-colors"
                          title="Listen slowly (0.7x turtle speed)"
                        >
                          <Turtle className="w-4 h-4 text-emerald-500 hover:text-white" />
                        </button>

                        {/* Bookmark / Star */}
                        <button
                          type="button"
                          onClick={() =>
                            toggleBookmarkPhrase({
                              lessonId,
                              phraseId: phrase.id,
                              nativeText,
                              targetText,
                              phonetic: phonetic || undefined,
                            })
                          }
                          className={`p-2 rounded-xl transition-colors ${
                            isBookmarked
                              ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                              : 'bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-white text-slate-400'
                          }`}
                          title={isBookmarked ? 'Remove Bookmark' : 'Bookmark to Saved Phrases'}
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                        </button>

                        {/* Copy */}
                        <button
                          type="button"
                          onClick={() => handleCopy(phrase.id, `${targetText} — ${nativeText}`)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
                          title="Copy phrase"
                        >
                          {copiedId === phrase.id ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE FLASHCARDS */}
        {activeTab === 'flashcards' && (
          <FlashcardDeck
            phrases={phrases}
            nativeLang={nativeLang}
            targetLang={targetLang}
          />
        )}

        {/* TAB 3: LESSON QUIZ */}
        {activeTab === 'quiz' && (
          <LessonQuiz
            lessonId={lessonId}
            phrases={phrases}
            nativeLang={nativeLang}
            targetLang={targetLang}
          />
        )}

        {/* BOTTOM NAVIGATION: PREV / NEXT LESSON */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          {prevLessonId ? (
            <Link
              href={`/lesson/${prevLessonId}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-300 shadow-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous (Lesson {prevLessonId})</span>
            </Link>
          ) : (
            <div />
          )}

          <button
            onClick={() => toggleLessonCompleted(lessonId)}
            className={`hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              isCompleted
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Marked Completed' : 'Complete Lesson'}</span>
          </button>

          {nextLessonId ? (
            <Link
              href={`/lesson/${nextLessonId}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 font-bold text-xs sm:text-sm text-white shadow-md shadow-brand-500/25 transition-all"
            >
              <span>Next (Lesson {nextLessonId})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </main>

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
}
