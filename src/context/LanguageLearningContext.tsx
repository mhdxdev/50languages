'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Language,
  SavedPhrase,
  LanguageLearningContextType,
} from '@/types';
import { LANGUAGES, getLanguageByCode } from '@/data/languages';

const STORAGE_KEYS = {
  NATIVE_LANG: '50lang_native_lang',
  TARGET_LANG: '50lang_target_lang',
  COMPLETED: '50lang_completed_lessons',
  SAVED: '50lang_saved_phrases',
  QUIZ: '50lang_quiz_scores',
  THEME: '50lang_dark_theme',
};

const LanguageLearningContext = createContext<LanguageLearningContextType | undefined>(undefined);

export const LanguageLearningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default to Uzbek -> English
  const [nativeLang, setNativeLangState] = useState<Language>(LANGUAGES[0]); // uz
  const [targetLang, setTargetLangState] = useState<Language>(LANGUAGES[1]); // en

  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>([]);
  const [quizScores, setQuizScores] = useState<Record<number, number>>({});
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Audio state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeSpeechText, setActiveSpeechText] = useState<string | null>(null);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const storedNative = localStorage.getItem(STORAGE_KEYS.NATIVE_LANG);
      if (storedNative) setNativeLangState(getLanguageByCode(storedNative));

      const storedTarget = localStorage.getItem(STORAGE_KEYS.TARGET_LANG);
      if (storedTarget) setTargetLangState(getLanguageByCode(storedTarget));

      const storedCompleted = localStorage.getItem(STORAGE_KEYS.COMPLETED);
      if (storedCompleted) setCompletedLessons(JSON.parse(storedCompleted));

      const storedSaved = localStorage.getItem(STORAGE_KEYS.SAVED);
      if (storedSaved) setSavedPhrases(JSON.parse(storedSaved));

      const storedQuiz = localStorage.getItem(STORAGE_KEYS.QUIZ);
      if (storedQuiz) setQuizScores(JSON.parse(storedQuiz));

      const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (storedTheme !== null) {
        const isDark = storedTheme === 'true';
        setIsDarkMode(isDark);
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else {
        // Default dark mode for modern SaaS feel
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      console.error('Failed to load learning state from localStorage', e);
    }
  }, []);

  // Update Native Language
  const setNativeLang = useCallback((lang: Language) => {
    setNativeLangState(lang);
    localStorage.setItem(STORAGE_KEYS.NATIVE_LANG, lang.code);
  }, []);

  // Update Target Language
  const setTargetLang = useCallback((lang: Language) => {
    setTargetLangState(lang);
    localStorage.setItem(STORAGE_KEYS.TARGET_LANG, lang.code);
  }, []);

  // Swap Languages
  const swapLanguages = useCallback(() => {
    setNativeLangState((prevNative) => {
      setTargetLangState((prevTarget) => {
        localStorage.setItem(STORAGE_KEYS.NATIVE_LANG, prevTarget.code);
        localStorage.setItem(STORAGE_KEYS.TARGET_LANG, prevNative.code);
        return prevNative;
      });
      return targetLang;
    });
  }, [targetLang]);

  // Toggle Lesson Completion
  const toggleLessonCompleted = useCallback((lessonId: number) => {
    setCompletedLessons((prev) => {
      const updated = prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId];
      localStorage.setItem(STORAGE_KEYS.COMPLETED, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isLessonCompleted = useCallback(
    (lessonId: number) => completedLessons.includes(lessonId),
    [completedLessons]
  );

  // Toggle Bookmark Phrase
  const toggleBookmarkPhrase = useCallback(
    (phrase: {
      lessonId: number;
      phraseId: string;
      nativeText: string;
      targetText: string;
      phonetic?: string;
    }) => {
      setSavedPhrases((prev) => {
        const exists = prev.some((p) => p.phraseId === phrase.phraseId);
        let updated: SavedPhrase[];
        if (exists) {
          updated = prev.filter((p) => p.phraseId !== phrase.phraseId);
        } else {
          const newSaved: SavedPhrase = {
            id: `saved-${Date.now()}-${Math.random()}`,
            lessonId: phrase.lessonId,
            phraseId: phrase.phraseId,
            nativeText: phrase.nativeText,
            targetText: phrase.targetText,
            phonetic: phrase.phonetic,
            nativeLangCode: nativeLang.code,
            targetLangCode: targetLang.code,
            savedAt: new Date().toISOString(),
          };
          updated = [newSaved, ...prev];
        }
        localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(updated));
        return updated;
      });
    },
    [nativeLang.code, targetLang.code]
  );

  const isPhraseSaved = useCallback(
    (phraseId: string) => savedPhrases.some((p) => p.phraseId === phraseId),
    [savedPhrases]
  );

  const removeSavedPhrase = useCallback((id: string) => {
    setSavedPhrases((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Save Quiz Score
  const saveQuizScore = useCallback((lessonId: number, scorePercent: number) => {
    setQuizScores((prev) => {
      const currentBest = prev[lessonId] || 0;
      if (scorePercent > currentBest) {
        const updated = { ...prev, [lessonId]: scorePercent };
        localStorage.setItem(STORAGE_KEYS.QUIZ, JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  }, []);

  // Audio Playback via Web Speech API
  const stopAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setActiveSpeechText(null);
  }, []);

  const playAudio = useCallback(
    (text: string, langCode: string, rate: number = 1.0) => {
      if (typeof window === 'undefined') return;

      if (!('speechSynthesis' in window)) {
        console.warn('Web Speech API is not supported in this browser.');
        return;
      }

      // Stop previous utterance
      window.speechSynthesis.cancel();

      const langObj = getLanguageByCode(langCode);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langObj.speechLocale;
      utterance.rate = rate; // 1.0x normal or 0.7x slow

      // Pick closest available system voice
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const matchedVoice = voices.find(
          (v) =>
            v.lang.toLowerCase() === langObj.speechLocale.toLowerCase() ||
            v.lang.toLowerCase().startsWith(langCode.toLowerCase())
        );
        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }
      }

      utterance.onstart = () => {
        setIsPlayingAudio(true);
        setActiveSpeechText(text);
      };

      utterance.onend = () => {
        setIsPlayingAudio(false);
        setActiveSpeechText(null);
      };

      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setActiveSpeechText(null);
      };

      window.speechSynthesis.speak(utterance);
    },
    []
  );

  // Toggle Dark Mode
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem(STORAGE_KEYS.THEME, String(next));
      return next;
    });
  }, []);

  return (
    <LanguageLearningContext.Provider
      value={{
        nativeLang,
        targetLang,
        setNativeLang,
        setTargetLang,
        swapLanguages,
        completedLessons,
        toggleLessonCompleted,
        isLessonCompleted,
        savedPhrases,
        toggleBookmarkPhrase,
        isPhraseSaved,
        removeSavedPhrase,
        quizScores,
        saveQuizScore,
        playAudio,
        stopAudio,
        isPlayingAudio,
        activeSpeechText,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </LanguageLearningContext.Provider>
  );
};

export const useLanguageLearning = () => {
  const context = useContext(LanguageLearningContext);
  if (!context) {
    throw new Error('useLanguageLearning must be used within a LanguageLearningProvider');
  }
  return context;
};
