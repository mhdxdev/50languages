export type Direction = 'ltr' | 'rtl';

export interface Language {
  code: string;
  speechLocale: string;
  nativeName: string;
  englishName: string;
  uzbekName: string;
  flag: string;
  dir: Direction;
  popular?: boolean;
}

export type LessonCategory =
  | 'All'
  | 'Basics & Greetings'
  | 'People & Family'
  | 'Numbers & Time'
  | 'Travel & Directions'
  | 'Food & Dining'
  | 'Shopping & City'
  | 'Health & Work'
  | 'Grammar & Verbs';

export interface Lesson {
  id: number;
  numberFormatted: string; // "01", "02", ... "100"
  category: LessonCategory;
  titleUz: string;
  titleEn: string;
  titleRu: string;
  icon?: string;
}

export interface Phrase {
  id: string;
  lessonId: number;
  order: number;
  uz: string;
  en: string;
  ru: string;
  transliterations?: Record<string, string>; // e.g. { ko: 'Annyeonghaseyo', ar: 'Marhaban', ru: 'Privet', ja: 'Konnichiwa', zh: 'Ni hao' }
  translations?: Record<string, string>; // explicit translations for 50+ languages
}

export interface SavedPhrase {
  id: string;
  lessonId: number;
  phraseId: string;
  nativeText: string;
  targetText: string;
  phonetic?: string;
  nativeLangCode: string;
  targetLangCode: string;
  savedAt: string;
}

export interface QuizQuestion {
  id: number;
  type: 'native-to-target' | 'target-to-native' | 'listening';
  prompt: string;
  audioText?: string;
  audioLang?: string;
  options: string[];
  correctAnswer: string;
  phraseId: string;
  phonetic?: string;
}

export interface AlphabetCharacter {
  char: string;
  name: string;
  sound: string;
  example: string;
  exampleTranslation: string;
  transliteration?: string;
}

export interface LanguageLearningContextType {
  nativeLang: Language;
  targetLang: Language;
  setNativeLang: (lang: Language) => void;
  setTargetLang: (lang: Language) => void;
  swapLanguages: () => void;
  
  // Progress
  completedLessons: number[]; // e.g. [1, 2, 5]
  toggleLessonCompleted: (lessonId: number) => void;
  isLessonCompleted: (lessonId: number) => boolean;

  // Saved Phrases
  savedPhrases: SavedPhrase[];
  toggleBookmarkPhrase: (phrase: {
    lessonId: number;
    phraseId: string;
    nativeText: string;
    targetText: string;
    phonetic?: string;
  }) => void;
  isPhraseSaved: (phraseId: string) => boolean;
  removeSavedPhrase: (id: string) => void;

  // Quiz Scores
  quizScores: Record<number, number>; // lessonId -> best score percent
  saveQuizScore: (lessonId: number, scorePercent: number) => void;

  // Audio Player
  playAudio: (text: string, langCode: string, rate?: number) => void;
  stopAudio: () => void;
  isPlayingAudio: boolean;
  activeSpeechText: string | null;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}
