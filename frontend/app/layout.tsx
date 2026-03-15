import type { Metadata } from "next";
import "./globals.css";
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: "LectureLens AI — Transform Videos into Structured Knowledge",
  description:
    "Paste any educational video URL and let AI generate structured notes, flashcards, quizzes, mind maps, and a personalized AI tutor — all from a single video.",
  keywords: "AI learning, video notes, flashcards, quiz, mind map, education, lecture notes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
