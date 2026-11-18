'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Search,
  Filter,
  Play,
  ArrowRight,
  Globe,
  Award,
  Zap,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { LessonCard } from '@/components/LessonCard';
import { useLanguageLearning } from '@/context/LanguageLearningContext';
import { LESSONS_CATALOG } from '@/data/lessonsCatalog';
import { LessonCategory } from '@/types';

export default function HomePage() {
  const {
    nativeLang,
    targetLang,
    completedLessons,
  } = useLanguageLearning();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LessonCategory>('All');

  // Categories list
  const categories: LessonCategory[] = [
    'All',
    'Basics & Greetings',
    'People & Family',
    'Numbers & Time',
    'Travel & Directions',
    'Food & Dining',
    'Shopping & City',
    'Health & Work',
    'Grammar & Verbs',
  ];

  // Localized Hero titles based on selected Native Language
  const getHeroContent = () => {
    if (nativeLang.code === 'uz') {
      return {
        title: `O'zbek tilidan ${targetLang.nativeName}ni bepul o'rganing`,
        subtitle: `100 ta interaktiv dars, jonli talaffuz audiosi, fleshkartalar va testlar orqali ${targetLang.englishName} tilida erkin gapirishni boshlang.`,
        cta: '1-Darsdan boshlash',
      };
    }
    if (nativeLang.code === 'ru') {
      return {
        title: `Учите ${targetLang.nativeName} бесплатно с нуля`,
        subtitle: `100 структурированных уроков, аудио озвучка носителями, карточки и тесты для легкого изучения ${targetLang.englishName}.`,
        cta: 'Начать Урок 1',
      };
    }
    return {
      title: `Learn ${targetLang.nativeName} Free from English`,
      subtitle: `Master 50+ world languages through 100 structured lessons, real-time speech audio, interactive flashcards, and quizzes.`,
      cta: 'Start Lesson 1',
    };
  };

  const hero = getHeroContent();

  // Progress percentage
  const progressPercent = Math.round(
    (completedLessons.length / LESSONS_CATALOG.length) * 100
  );

  // Filtered lessons
  const filteredLessons = useMemo(() => {
    return LESSONS_CATALOG.filter((lesson) => {
      // Category filter
      if (selectedCategory !== 'All' && lesson.category !== selectedCategory) {
        return false;
      }

      // Search query filter (matches number or titles in uz, en, ru)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesNumber =
          lesson.id.toString() === q ||
          lesson.numberFormatted.includes(q);
        const matchesUz = lesson.titleUz.toLowerCase().includes(q);
        const matchesEn = lesson.titleEn.toLowerCase().includes(q);
        const matchesRu = lesson.titleRu.toLowerCase().includes(q);

        if (!matchesNumber && !matchesUz && !matchesEn && !matchesRu) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Localized Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-indigo-600 to-indigo-900 text-white p-8 sm:p-12 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-brand-100">
              <Globe className="w-3.5 h-3.5" />
              <span>
                {nativeLang.flag} {nativeLang.nativeName} ➔ {targetLang.flag} {targetLang.nativeName}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {hero.title}
            </h1>

            <p className="text-sm sm:text-base text-brand-100 leading-relaxed max-w-xl">
              {hero.subtitle}
            </p>

            {/* Action & Progress */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/lesson/1"
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-slate-950 font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{hero.cta}</span>
              </Link>

              <Link
                href="/alphabet"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all"
              >
                <span>{targetLang.nativeName} Alphabet</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Progress Card in Hero */}
          <div className="mt-8 sm:mt-0 lg:absolute lg:top-8 lg:right-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-7 text-white w-full lg:w-72 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-200">
              <span>Overall Progress</span>
              <span className="text-white font-black text-sm">{progressPercent}%</span>
            </div>

            {/* Progress bar */}
            <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden p-0.5">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-emerald-400 rounded-full transition-all duration-500 shadow-sm"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-brand-100 pt-1">
              <span>{completedLessons.length} Completed</span>
              <span>{LESSONS_CATALOG.length - completedLessons.length} Remaining</span>
            </div>
          </div>

          {/* Background decorative glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Search & Category Filter Section */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lessons (e.g., '1', 'family', 'oila')..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 shadow-sm"
              />
            </div>

            {/* Result Counter */}
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 self-start md:self-auto">
              Showing {filteredLessons.length} of 100 Lessons
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 100 Lessons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredLessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
            <span className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs">
              50
            </span>
            <span>50LANGUAGES Clone</span>
          </div>
          <p>
            Learn 50+ languages with 100 lessons, speech synthesis, flashcards, and quizzes.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-brand-600">
              Lessons
            </Link>
            <Link href="/alphabet" className="hover:text-brand-600">
              Alphabet
            </Link>
            <Link href="/saved" className="hover:text-brand-600">
              Saved Phrases
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
