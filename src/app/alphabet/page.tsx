'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Volume2,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Headphones,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useLanguageLearning } from '@/context/LanguageLearningContext';
import { getAlphabetForLanguage } from '@/data/alphabets';
import { AlphabetCharacter } from '@/types';

export default function AlphabetPage() {
  const { targetLang, playAudio } = useLanguageLearning();
  const alphabet = getAlphabetForLanguage(targetLang.code);
  const [selectedChar, setSelectedChar] = useState<AlphabetCharacter | null>(
    alphabet[0] || null
  );

  const handlePlayCharacter = (item: AlphabetCharacter) => {
    setSelectedChar(item);
    playAudio(item.example, targetLang.code, 1.0);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Lessons
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <span>{targetLang.flag}</span>
              <span>{targetLang.nativeName} Alphabet & Sounds</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Click any character to hear authentic native pronunciation and learn foundational vocabulary
            </p>
          </div>
        </div>

        {/* Selected Character Preview Hero */}
        {selectedChar && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-800 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center font-black text-4xl sm:text-5xl border border-white/20 shadow-inner">
                {selectedChar.char}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-200">
                  {selectedChar.name}
                </span>
                <h3 className="text-2xl font-black">{selectedChar.example}</h3>
                <p className="text-sm font-semibold text-brand-100">
                  Meaning: {selectedChar.exampleTranslation}
                </p>
                <p className="text-xs text-brand-200">
                  Phonetic sound: <strong className="text-white">{selectedChar.sound}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => handlePlayCharacter(selectedChar)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-slate-900 font-extrabold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all self-stretch sm:self-auto justify-center"
            >
              <Volume2 className="w-5 h-5 text-brand-600" />
              <span>Listen Pronunciation</span>
            </button>
          </div>
        )}

        {/* Alphabet Interactive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {alphabet.map((item, idx) => {
            const isSelected = selectedChar?.char === item.char;

            return (
              <div
                key={idx}
                onClick={() => handlePlayCharacter(item)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between group hover:-translate-y-0.5 ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30 ring-2 ring-brand-500/40 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {item.char}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayCharacter(item);
                    }}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                    {item.example}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {item.exampleTranslation}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
