import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageLearningProvider } from '@/context/LanguageLearningContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '50LANGUAGES — Learn 50+ Languages Free with 100 Lessons',
  description:
    'Learn 50+ languages from Uzbek, English, Russian and more with 100 structured lessons, speech audio, flashcards, and quizzes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-50 dark:bg-slate-950 antialiased selection:bg-brand-500 selection:text-white`}>
        <LanguageLearningProvider>{children}</LanguageLearningProvider>
      </body>
    </html>
  );
}
