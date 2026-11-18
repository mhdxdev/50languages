# 50LANGUAGES — Language Learning Platform & SaaS Subscription Admin

A unified, production-ready **Next.js 14+ (App Router)** + **TypeScript** + **Tailwind CSS** application combining the authentic **50LANGUAGES** language learning platform with an end-to-end **SaaS Subscription Management Admin Panel (`/admin`)**.

---

## 🌟 Architecture & Key Features

### 🎓 1. Language Learning Platform (`/`, `/lesson/[id]`, `/alphabet`, `/saved`)
- **50+ World Languages Support (`src/data/languages.ts`)**:
  - Full native support for **Uzbek (`O'zbek tili 🇺🇿`)**, **English (`🇬🇧`)**, and **Russian (`🇷🇺`)**, plus German, Korean, Turkish, Arabic, Spanish, French, Chinese, Japanese, and 40+ more.
  - Dual-language selector with instant swap (`⇄`) button to learn any language pair.
  - Full RTL support for Arabic, Persian, Hebrew, and Urdu.
- **100 Lessons Curriculum (`/`)**:
  - Structured 100 lesson progression categorized into *Basics & Greetings*, *People & Family*, *Numbers & Time*, *Travel & Directions*, *Food & Dining*, *Shopping & City*, *Health & Work*, and *Grammar & Verbs*.
  - Lessons 1–10 free for all users; advanced lessons unlocked for Pro learners.
- **Interactive Lesson Workspace (`/lesson/[id]`)**:
  - **Phrasebook & Speech Audio**: Dual-column native/target table with Web Speech API native pronunciation and 0.7x turtle speed.
  - **"Play All Audio"** auto-player with active row highlighting.
  - **3D Flashcards Deck**: Flip animations, auto-audio, mastered vs practice-again queues.
  - **Lesson Quiz**: Multi-choice Native → Target, Target → Native, and Listening challenge modes with completion auto-tracking.
- **Alphabet & Sounds Guide (`/alphabet`)**: Pronunciation guide for Cyrillic, Hangul, Arabic, Hiragana, German, Latin.
- **Saved Phrases (`/saved`)**: Personal phrasebook with one-click custom practice deck.

---

### 💼 2. SaaS Subscription Management Admin Panel (`/admin`)
- **Unified React Context & State Sync (`src/context/SubscriptionContext.tsx`)**:
  - Pre-seeded with 12+ realistic learners, 4 language tier plans, 5 pending receipt payment verification requests, and complete transaction ledger.
  - Backed by `localStorage` for immediate zero-setup persistence and real-time synchronization between the frontend and admin panel.
- **Collapsible Admin Navigation (`/admin/layout.tsx`)**:
  - Quick sidebar links with active routes, pending counter badges, global ⌘K search, currency toggle ($ USD / UZS), and quick "Grant Pro" modal.
- **Overview & Revenue Analytics (`/admin`)**:
  - 4 Dynamic KPI Cards: Monthly Recurring Revenue (MRR), Active Subscribers, Pending Verifications, Churn / Expiring Soon.
  - Revenue Growth Bar Chart & Plan Tier Distribution breakdown.
  - Live activity feed of recent upgrades, approvals, cancellations, and renewals.
- **Subscriptions & Users Management (`/admin/subscriptions`)**:
  - Advanced data table with search, plan filters, and status badges (`Active`, `Expiring Soon`, `Expired`, `Suspended`).
  - Actions per user: Upgrade/Downgrade plan, Extend (+7d, +30d, +365d), Cancel/Reactivate, and User Details Drawer.
- **Payment Verification & Manual Receipt Approvals (`/admin/requests`)**:
  - Dedicated workflow for local Uzbek and international payments (**Uzcard, Humo, Click, Payme, Wire Transfer**).
  - Receipt preview modal with transaction IDs and transfer amounts.
  - **One-Click "Approve & Activate"**: Automatically transitions learner to Pro, logs transaction, updates MRR.
  - **"Reject with Reason"**: Customizable admin note.
- **Plans & Pricing Manager (`/admin/plans`)**:
  - Configure tiers (`Free Starter`, `Pro Monthly`, `Pro Annual`, `Founder Lifetime`) with USD and UZS pricing, features list, popular badges, and visibility toggles.
  - "Create New Plan" modal.
- **Transactions & Billing Ledger (`/admin/transactions`)**:
  - Complete payment audit log with status filters (`Completed`, `Pending`, `Refunded`, `Failed`).
  - 1-Click **CSV Export** and **Issue Refund** action.
- **Frontend Integration (`src/components/UpgradeModal.tsx`)**:
  - "Upgrade to Pro" modal accessible directly from the Navbar.
  - User persona switcher dropdown in the Navbar to test Free vs Pro learner states in real time.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation
```bash
git clone https://github.com/mhdxdev/50languages.git
cd 50languages
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the 50Languages learning interface, or [http://localhost:3000/admin](http://localhost:3000/admin) for the SaaS Subscription Management Panel.
