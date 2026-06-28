import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cahiliyyə — İslamdan Əvvəlki Ərəbistan",
  description: "Cahiliyyə dövrünü öyrənin: quiz, AI müəllim, bilik kitabxanası",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" toastOptions={{
          style: { background: "#2D1F0A", color: "#F5EDD8", border: "1px solid #C8A96E40" }
        }} />
      </body>
    </html>
  );
}
