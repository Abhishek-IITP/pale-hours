'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { audio } from '@/lib/audio';
import { Volume2, VolumeX, WifiOff, Menu, X } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const [soundOn, setSoundOn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!audio) return;
    const unsub = audio.subscribe((enabled) => setSoundOn(enabled));
    return unsub;
  }, []);

  const handleSoundToggle = async () => {
    if (audio) {
      await audio.toggle();
    }
  };

  const navLinks = [
    { label: 'The Vigil', href: '/vigil' },
    { label: 'The Ofrenda', href: '/ofrenda' },
    { label: 'How It Haunts', href: '/open' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#F4F0E8]/85 backdrop-blur-md hairline-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo Wordmark */}
        <Link href="/" className="group flex items-baseline gap-3 interactive">
          <span className="font-serif-display text-2xl tracking-tight text-[#2B2A27] group-hover:text-[#D9822B] transition-colors duration-300">
            Pale Hours
          </span>
          <span className="font-mono-code text-[9px] tracking-[0.2em] text-[#6F6B62] uppercase hidden sm:inline">
            LOCAL · OPEN-WEIGHT
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono-code text-xs tracking-[0.16em] uppercase transition-colors duration-200 interactive relative py-1 ${
                  isActive ? 'text-[#2B2A27] font-medium' : 'text-[#6F6B62] hover:text-[#2B2A27]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#D9822B]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Sound + Telemetry Chip */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 hairline-all bg-[#FAF8F3] text-[10px] font-mono-code text-[#6F6B62]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9822B] animate-pulse" />
            <span>0 BYTES CLOUD</span>
          </div>

          <button
            onClick={handleSoundToggle}
            className="flex items-center gap-2 px-3 py-1.5 hairline-all bg-[#EFEADF] hover:bg-[#FAF8F3] text-[#2B2A27] transition-colors duration-200 interactive text-xs font-mono-code"
            title="Toggle atmospheric room tone and chimes"
          >
            {soundOn ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#D9822B]" />
                <span className="text-[10px] tracking-widest text-[#D9822B]">SOUND: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#6F6B62]" />
                <span className="text-[10px] tracking-widest text-[#6F6B62]">SOUND: OFF</span>
              </>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#2B2A27] interactive"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#EFEADF] hairline-b px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-mono-code text-sm tracking-wider uppercase text-[#2B2A27] py-2 hairline-b"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-2 text-xs font-mono-code text-[#6F6B62]">
            <WifiOff className="w-3.5 h-3.5 text-[#D9822B]" />
            <span>OFFLINE-FIRST ON-DEVICE INFERENCE</span>
          </div>
        </div>
      )}
    </header>
  );
}
