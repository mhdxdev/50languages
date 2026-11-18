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
  isPro?: boolean;
}

export interface Phrase {
  id: string;
  lessonId: number;
  order: number;
  uz: string;
  en: string;
  ru: string;
  transliterations?: Record<string, string>;
  translations?: Record<string, string>;
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
  completedLessons: number[];
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
  quizScores: Record<number, number>;
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

// ---------------------------------------------------------------------
// SAAS SUBSCRIPTION & ADMIN TYPES
// ---------------------------------------------------------------------

export type PlanTier = 'free' | 'pro-monthly' | 'pro-annual' | 'lifetime' | string;

export type SubscriptionStatus = 'active' | 'expiring_soon' | 'expired' | 'suspended';

export type PaymentMethod = 'click' | 'payme' | 'uzcard' | 'humo' | 'stripe' | 'wire';

export type TransactionStatus = 'completed' | 'pending' | 'refunded' | 'failed';

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  billingCycle: 'monthly' | 'annual' | 'lifetime' | 'free';
  progressPercent: number;
  lastActive: string;
  notes?: string;
  role?: 'user' | 'admin';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceUSD: number;
  priceUZS: number;
  billingCycle: 'monthly' | 'annual' | 'lifetime' | 'free';
  durationDays: number;
  features: string[];
  popular?: boolean;
  isActive: boolean;
  badge?: string;
}

export interface SubscriptionRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  planId: string;
  planName: string;
  paymentMethod: PaymentMethod;
  amountUSD: number;
  amountUZS: number;
  submittedAt: string;
  status: RequestStatus;
  receiptUrl?: string;
  transactionRef?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  amountUSD: number;
  amountUZS: number;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  date: string;
  receiptUrl?: string;
  invoiceNumber: string;
}

export interface ActivityLog {
  id: string;
  type: 'upgrade' | 'approval' | 'rejection' | 'cancellation' | 'extension' | 'refund' | 'plan_created';
  title: string;
  description: string;
  timestamp: string;
  adminName: string;
}

export interface RevenueAnalytics {
  mrrUSD: number;
  mrrUZS: number;
  activeSubscribers: number;
  freeUsers: number;
  pendingRequestsCount: number;
  expiringSoonCount: number;
  monthlyRevenueData: {
    month: string;
    usd: number;
    uzs: number;
    subscribers: number;
  }[];
  planDistribution: {
    planId: string;
    name: string;
    count: number;
    percentage: number;
    color: string;
  }[];
}

export interface SubscriptionContextType {
  users: User[];
  plans: SubscriptionPlan[];
  requests: SubscriptionRequest[];
  transactions: Transaction[];
  activities: ActivityLog[];
  currentUser: User;
  currency: 'USD' | 'UZS';
  analytics: RevenueAnalytics;

  setCurrency: (currency: 'USD' | 'UZS') => void;
  setCurrentUser: (user: User) => void;

  // Requests
  approveRequest: (requestId: string, adminNotes?: string) => void;
  rejectRequest: (requestId: string, reason: string) => void;
  submitSubscriptionRequest: (
    data: Omit<SubscriptionRequest, 'id' | 'submittedAt' | 'status'>
  ) => void;

  // Subscriptions & Users
  extendSubscription: (userId: string, days: number) => void;
  changeUserPlan: (userId: string, newPlanId: string, customDurationDays?: number) => void;
  toggleUserStatus: (userId: string, newStatus: SubscriptionStatus) => void;
  toggleAutoRenew: (userId: string) => void;
  grantProAccess: (userId: string, planId: string, durationDays: number) => void;

  // Plans Management
  updatePlan: (planId: string, updatedPlan: Partial<SubscriptionPlan>) => void;
  createPlan: (newPlan: Omit<SubscriptionPlan, 'id'>) => void;
  togglePlanActive: (planId: string) => void;

  // Transactions & Billing
  issueRefund: (transactionId: string, revokeAccess?: boolean) => void;
  exportTransactionsCSV: () => void;

  // Helpers
  getPlanById: (planId: string) => SubscriptionPlan | undefined;
  getUserById: (userId: string) => User | undefined;
  resetToDefaults: () => void;
  isUserPro: (user?: User) => boolean;
}
