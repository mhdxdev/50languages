# 50LANGUAGES Clone — 50+ World Languages Platform

A 100% functional, production-ready clone of the **50LANGUAGES** platform (`50languages.com`) built with **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, and **Lucide Icons**.

---

## 🌟 Key Features

1. **50+ World Languages Support (`src/data/languages.ts`)**:
   - Defaults to **Uzbek (`O'zbek tili 🇺🇿`)**, **English (`🇬🇧`)**, and **Russian (`🇷🇺`)**, plus German, Korean, Turkish, Arabic, Spanish, French, Chinese, Japanese, and 40+ more.
   - Dual-language selector with instant swap (`⇄`) button to learn any language pair.
   - Full RTL support for Arabic, Persian, Hebrew, and Urdu.

2. **100 Lessons Curriculum (`src/data/lessonsCatalog.ts` & `/`)**:
   - Authentic 100 lesson progression categorized into *Basics & Greetings*, *People & Family*, *Numbers & Time*, *Travel & Directions*, *Food & Dining*, *Shopping & City*, *Health & Work*, and *Grammar & Verbs*.
   - Instant search and category filter pills.
   - Overall progress tracker (`0% – 100%`).

3. **Interactive Lesson Workspace (`/lesson/[id]`)**:
   - **Tab 1: Phrasebook & Audio List**:
     - Dual-column phrase table with authentic translations in Native & Target languages.
     - Web Speech API speech synthesis with speed control (`1.0x` and `0.7x` turtle speed).
     - **"Play All Audio"** continuous auto-player with row highlighting.
     - Hide/Show Target text for active recall practice.
     - Phonetic transliteration toggle.
     - Bookmark to `/saved` with single click.
   - **Tab 2: Interactive Flashcards (`src/components/FlashcardDeck.tsx`)**:
     - 3D flip card deck with automatic speech audio playback upon flip.
     - "Practice Again" (re-queues card) and "Mastered" buttons.
   - **Tab 3: Lesson Quiz (`src/components/LessonQuiz.tsx`)**:
     - 10-question quiz with 3 interactive types: Native → Target, Target → Native, and **Listening Challenge** (audio-only prompt).
     - Instant visual feedback and score calculation (≥ 70% automatically marks lesson completed!).

4. **Alphabet & Sounds Guide (`/alphabet`)**:
   - Audio pronunciation guide for Hangul (Korean), Cyrillic (Russian), Arabic, Japanese Hiragana, German diacritics, and Latin alphabets.

5. **Saved Vocabulary & Custom Practice (`/saved`)**:
   - Stored bookmarked phrases with audio playback and ability to practice as a custom flashcard deck.
