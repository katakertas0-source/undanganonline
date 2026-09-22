import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { getSiteOrigin } from '@/lib/supabase/metadata';
import './globals.css';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: 'Kertas.Kata — Undangan Online Simple, Elegant, Exclusive',
  description: 'Digital invitations designed for meaningful moments. High-fashion editorial aesthetics inspired by timeless minimalism by Kertas.Kata.',
  icons: {
    icon: [
      { url: '/icon.png?v=2', sizes: '192x192', type: 'image/png' },
      { url: '/favicon.ico?v=2' },
      { url: '/icon-512.png?v=2', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png?v=2', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=2',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-scroll-behavior="smooth" className={`${cormorant.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#F8F7F3] text-[#111111]">
        {children}
      </body>
    </html>
  );
}
