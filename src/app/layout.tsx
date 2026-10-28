import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import FilmGrain from '@/components/FilmGrain';
import CustomCursor from '@/components/CustomCursor';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Preloader from '@/components/Preloader';
import SmoothScroll from '@/components/SmoothScroll';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pale Hours — Local Graveyard for Abandoned Things',
  description:
    'A local-first digital graveyard for your own abandoned drafts, dead side-projects, and unfinished things. Powered by local open-weight AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F4F0E8] text-[#2B2A27]">
        <Preloader />
        <FilmGrain />
        <CustomCursor />
        <SmoothScroll>
          <Navigation />
          <main className="flex-1 pt-16 flex flex-col">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
