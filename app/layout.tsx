import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://repo-tracker.vercel.app'), // 実際のURLに変更
  title: {
    default: 'REPO Tracker - Real-time Ability Tracking for REPO Game',
    template: '%s | REPO Tracker'
  },
  description: 'Track and share REPO game abilities with your friends in real-time. Manage player stats, check enemy information, and coordinate strategies together. Free multiplayer tracking tool.',
  keywords: ['REPO', 'REPO game', 'REPO tracker', 'ability tracker', 'game tools', 'multiplayer tools', 'Steam game', 'REPO abilities', 'enemy information', 'ゲームツール', 'REPO 能力値', '敵キャラ情報'],
  authors: [{ name: 'REPO Tracker' }],
  creator: 'REPO Tracker',
  publisher: 'REPO Tracker',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    alternateLocale: ['en_US'],
    url: 'https://repo-tracker.vercel.app',
    siteName: 'REPO Tracker',
    title: 'REPO Tracker - Real-time Ability Tracking',
    description: 'Track and share REPO game abilities with your friends in real-time. Free multiplayer tracking tool.',
    images: [
      {
        url: '/og-image.png', // 後で作成
        width: 1200,
        height: 630,
        alt: 'REPO Tracker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REPO Tracker - Real-time Ability Tracking',
    description: 'Track and share REPO game abilities with your friends in real-time.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Google Search Console登録後に追加
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="canonical" href="https://repo-tracker.vercel.app" />
        <link rel="alternate" hrefLang="ja" href="https://repo-tracker.vercel.app" />
        <link rel="alternate" hrefLang="en" href="https://repo-tracker.vercel.app" />
        <link rel="alternate" hrefLang="x-default" href="https://repo-tracker.vercel.app" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}