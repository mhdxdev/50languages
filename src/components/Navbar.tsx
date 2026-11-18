'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Globe,
  ArrowRightLeft,
  BookOpen,
  Volume2,
  Bookmark,
  Sun,
  Moon,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  Search,
  X,
} from 'lucide-react';
import { useLanguageLearning } from '@/context/LanguageLearningContext';
import { LANGUAGES } from '@/data/languages';
import { Language } from '@/types';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const {
    nativeLang,
    targetLang,
    setNativeLang,
    setTargetLang,
    swapLanguages,
    completedLessons,
    savedPhrases,
    isDarkMode,
    toggleDarkMode,
  } = useLanguageLearning();

  const [openSelector, setOpenSelector] = useState<'native' | 'target' | null>(null);
  const [langSearch, setLangSearch] = useState('');

  const filteredLanguages = LANGUAGES.filter((l) => {
    const q = langSearch.toLowerCase();
    return (
      l.nativeName.toLowerCase().includes(q) ||
      l.englishName.toLowerCase().includes(q) ||
      l.uzbekName.toLowerCase().includes(q)
    );
  });

  const handleSelectLang = (lang: Language) => {
    if (openSelector === 'native') {
      if (lang.code === targetLang.code) {
        swapLanguages();
      } else {
        setNativeLang(lang);
      }
    } else if (openSelector === 'target') {
      if (lang.code === nativeLang.code) {
        swapLanguages();
      } else {
        setTargetLang(lang);
      }
    }
    setOpenSelector(null);
    setLangSearch('');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-emerald-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                50
              </div>
              <div className="flex flex-col">
                <span className="font-black text-slate-900 dark:text-white tracking-tight text-lg leading-none">
                  50<span className="text-brand-600 dark:text-brand-400">LANGUAGES</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                  Learn 50+ Languages Free
                </span>
              </div>
            </Link>

            {/* DUAL LANGUAGE SELECTOR BAR */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 p-1 sm:p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-inner max-w-xl flex-1 mx-2">
              {/* Native Language ("I speak") */}
              <button
                type="button"
                onClick={() => {
                  setOpenSelector('native');
                  setLangSearch('');
                }}
                className="flex-1 flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-all text-left min-w-0"
              >
                <span className="text-lg flex-shrink-0">{nativeLang.flag}</span>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block leading-none">
                    I speak
                  </span>
                  <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate block">
                    {nativeLang.nativeName}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 hidden sm:block" />
              </button>

              {/* Swap Button */}
              <button
                type="button"
                onClick={swapLanguages}
                title="Swap Native & Target Languages"
                className="p-2 mx-1 rounded-xl bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 shadow-sm hover:scale-110 active:scale-95 transition-all flex-shrink-0"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>

              {/* Target Language ("I want to learn") */}
              <button
                type="button"
                onClick={() => {
                  setOpenSelector('target');
                  setLangSearch('');
                }}
                className="flex-1 flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 hover:bg-brand-500/20 dark:hover:bg-brand-500/30 transition-all text-left min-w-0 border border-brand-500/30"
              >
                <span className="text-lg flex-shrink-0">{targetLang.flag}</span>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-brand-600 dark:text-brand-400 font-bold uppercase tracking-wider block leading-none">
                    I learn
                  </span>
                  <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate block">
                    {targetLang.nativeName}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-brand-500 flex-shrink-0 hidden sm:block" />
              </button>
            </div>

            {/* Right: Nav links, Stats & Theme toggle */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              <nav className="hidden lg:flex items-center gap-1">
                <Link
                  href="/"
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    pathname === '/'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  100 Lessons
                </Link>
                <Link
                  href="/alphabet"
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    pathname === '/alphabet'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Alphabet
                </Link>
                <Link
                  href="/saved"
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    pathname === '/saved'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Saved</span>
                  {savedPhrases.length > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-black rounded-full bg-emerald-500 text-white">
                      {savedPhrases.length}
                    </span>
                  )}
                </Link>
              </nav>

              {/* Completed counter pill */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{completedLessons.length}/100</span>
              </div>

              {/* Dark / Light Toggle */}
              <button
                type="button"
                onClick={toggleDarkMode}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile secondary navigation bar */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs font-bold">
          <Link
            href="/"
            className={`flex items-center gap-1 py-1 px-3 rounded-lg ${
              pathname === '/' ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Lessons</span>
          </Link>
          <Link
            href="/alphabet"
            className={`flex items-center gap-1 py-1 px-3 rounded-lg ${
              pathname === '/alphabet' ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Alphabet</span>
          </Link>
          <Link
            href="/saved"
            className={`flex items-center gap-1 py-1 px-3 rounded-lg ${
              pathname === '/saved' ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved ({savedPhrases.length})</span>
          </Link>
        </div>
      </header>

      {/* LANGUAGE SELECTOR MODAL DIALOG */}
      {openSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {openSelector === 'native' ? 'Select Your Native Language (I speak)' : 'Select Target Language to Learn'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Over 50 world languages with real-time native speech pronunciation
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpenSelector(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  autoFocus
                  value={langSearch}
                  onChange={(e) => setLangSearch(e.target.value)}
                  placeholder="Search language by name, English, or Uzbek..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Language Grid List */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredLanguages.map((lang) => {
                const isCurrent =
                  openSelector === 'native'
                    ? lang.code === nativeLang.code
                    : lang.code === targetLang.code;

                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLang(lang)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                      isCurrent
                        ? 'border-brand-500 bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 ring-1 ring-brand-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0">{lang.flag}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {lang.nativeName}
                        </span>
                        {lang.popular && (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                        {lang.englishName} ({lang.uzbekName})
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
