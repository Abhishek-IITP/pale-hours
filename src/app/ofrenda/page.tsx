'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INITIAL_GHOSTS, Ghost } from '@/data/ghosts';
import CandleCanvas from '@/components/canvas/CandleCanvas';
import { audio } from '@/lib/audio';
import { Flame, X, Sparkles, BookOpen, Clock, Tag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function OfrendaPage() {
  const [ghosts, setGhosts] = useState<Ghost[]>(INITIAL_GHOSTS);
  const [selectedGhost, setSelectedGhost] = useState<Ghost | null>(null);
  const [activeTier, setActiveTier] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('pale_hours_ghosts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGhosts(parsed);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const litGhosts = ghosts.filter((g) => g.isLit);
  const releasedGhosts = ghosts.filter((g) => g.isReleased);

  // Split into three altar tiers
  const tiers = [
    { title: 'Tier I — Words Unspoken & Unsent', items: ghosts.filter((g) => g.type === 'draft' || g.type === 'voice') },
    { title: 'Tier II — Architectures Half-Built', items: ghosts.filter((g) => g.type === 'repo' || g.type === 'plan') },
    { title: 'Tier III — The Quiet Intentions', items: ghosts.filter((g) => g.type === 'poem' || g.type === 'todo') },
  ];

  const handleOpenGhost = (ghost: Ghost) => {
    setSelectedGhost(ghost);
    if (audio) {
      audio.playChime(432, 0.12);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#F4F0E8] flex flex-col py-12 px-6">
      <div className="max-w-7xl mx-auto w-full">
        {/* STAT STRIP: YEAR OF UNFINISHED THINGS */}
        <div className="mb-16 p-6 bg-[#EFEADF] hairline-all flex flex-wrap items-center justify-between gap-6 text-xs font-mono-code text-[#6F6B62]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#D9822B]" />
            <span className="font-semibold text-[#2B2A27] tracking-widest uppercase">
              YEAR OF UNFINISHED THINGS
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-8">
            <div>
              <span className="text-[#6F6B62]">DISCOVERED: </span>
              <span className="text-[#2B2A27] font-semibold">{ghosts.length}</span>
            </div>
            <div>
              <span className="text-[#6F6B62]">CANDLES LIT: </span>
              <span className="text-[#D9822B] font-semibold">{litGhosts.length}</span>
            </div>
            <div>
              <span className="text-[#6F6B62]">RELEASED: </span>
              <span className="text-[#2B2A27] font-semibold">{releasedGhosts.length}</span>
            </div>
            <div>
              <span className="text-[#6F6B62]">MOST HAUNTED: </span>
              <span className="text-[#2B2A27] font-semibold uppercase">OCTOBER (MIST & INTENTION)</span>
            </div>
          </div>
        </div>

        {/* HERO TITLE */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="font-mono-code text-[10px] tracking-[0.25em] text-[#6F6B62] uppercase mb-3">
            The Digital Altar &middot; Día de los Muertos
          </div>
          <h1 className="font-serif-display text-4xl sm:text-6xl text-[#2B2A27] mb-6">
            The Ofrenda of Unfinished Things
          </h1>
          <p className="font-editorial italic text-base sm:text-lg text-[#6F6B62] leading-relaxed">
            Every ghost on this altar was once a living hour. Here, they are not discarded; they are given paper lace, a warm flame, and the quiet dignity of having been attempted.
          </p>
        </div>

        {/* THREE ALTAR TIERS */}
        <div className="space-y-24">
          {tiers.map((tier, tierIdx) => (
            <div key={tierIdx} className="space-y-8">
              {/* Tier Header / Shelf Line */}
              <div className="flex items-baseline justify-between pb-3 hairline-b">
                <h2 className="font-serif-display text-2xl text-[#2B2A27]">
                  {tier.title}
                </h2>
                <span className="font-mono-code text-[10px] tracking-widest text-[#6F6B62] uppercase">
                  SHELF {tierIdx + 1} &middot; {tier.items.length} ARTIFACTS
                </span>
              </div>

              {/* Tier Shelves Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tier.items.map((ghost) => {
                  return (
                    <motion.div
                      key={ghost.id}
                      onClick={() => handleOpenGhost(ghost)}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="vellum-sheet p-8 flex flex-col justify-between cursor-pointer interactive relative group"
                    >
                      {/* Papel Picado Header Banner */}
                      <div className="mb-6 flex items-center justify-between">
                        {/* Papel Picado SVG flag (Sways in wind) */}
                        <div className="relative">
                          <svg
                            className="w-10 h-10 text-[#CFC8B8] group-hover:text-[#D9822B] transition-colors origin-top animate-flame"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4 2H36V32L28 36L20 32L12 36L4 32V2Z"
                              stroke="currentColor"
                              strokeWidth="1.2"
                              fill="#FAF8F3"
                            />
                            <circle cx="20" cy="14" r="3" stroke="currentColor" strokeWidth="1" />
                            <path d="M14 22L20 18L26 22" stroke="currentColor" strokeWidth="1" />
                          </svg>
                        </div>

                        {/* Candle Flame on the altar */}
                        <div className="flex items-center gap-2">
                          <CandleCanvas size="sm" isLit={ghost.isLit} />
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-mono-code text-[9px] text-[#6F6B62] uppercase tracking-wider">
                          <span>{ghost.originDate}</span>
                          <span>&middot;</span>
                          <span>{ghost.size}</span>
                        </div>

                        <h3 className="font-serif-display text-2xl text-[#2B2A27] group-hover:text-[#D9822B] transition-colors mb-3">
                          {ghost.title}
                        </h3>

                        <p className="font-editorial italic text-xs text-[#6F6B62] line-clamp-3 mb-6">
                          &ldquo;{ghost.epitaph.whatItWas}&rdquo;
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="hairline-t pt-4 flex items-center justify-between text-[10px] font-mono-code text-[#6F6B62]">
                        <span className="uppercase">
                          {ghost.isLit ? 'FLAME BURNING' : 'UNLIT'}
                        </span>
                        <span className="text-[#2B2A27] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          READ STORY &rarr;
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM CALL TO ACTION */}
        <div className="mt-28 pt-12 hairline-t text-center">
          <Link
            href="/vigil"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#EFEADF] hairline-all text-xs font-mono-code tracking-[0.2em] uppercase text-[#2B2A27] hover:bg-[#FAF8F3] transition-colors interactive"
          >
            <span>LIGHT A CANDLE FOR ANOTHER ARTIFACT</span>
            <ArrowRight className="w-4 h-4 text-[#D9822B]" />
          </Link>
        </div>
      </div>

      {/* FULL-SCREEN SHARED-LAYOUT READING VIEW MODAL */}
      <AnimatePresence>
        {selectedGhost && (
          <div className="fixed inset-0 z-50 bg-[#2B2A27]/60 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="vellum-sheet p-8 sm:p-14 max-w-3xl w-full bg-[#F4F0E8] relative my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedGhost(null)}
                className="absolute top-6 right-6 p-2 text-[#6F6B62] hover:text-[#2B2A27] interactive"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Altar Header */}
              <div className="flex items-center gap-4 mb-8 pb-6 hairline-b">
                <CandleCanvas size="md" isLit={selectedGhost.isLit} />
                <div>
                  <div className="font-mono-code text-[10px] tracking-[0.2em] text-[#6F6B62] uppercase mb-1">
                    OFFERING ON THE OFRENDA &middot; {selectedGhost.originDate}
                  </div>
                  <h2 className="font-serif-display text-3xl sm:text-4xl text-[#2B2A27]">
                    {selectedGhost.title}
                  </h2>
                </div>
              </div>

              {/* Body Stories */}
              <div className="space-y-6">
                <div>
                  <span className="font-mono-code text-[10px] tracking-widest text-[#D9822B] uppercase block mb-1">
                    WHAT IT WAS TRYING TO BECOME
                  </span>
                  <p className="font-editorial text-lg text-[#2B2A27] italic">
                    {selectedGhost.epitaph.whatItWasTryingToBecome}
                  </p>
                </div>

                <div className="p-4 bg-[#FAF8F3] hairline-all font-mono-code text-xs text-[#2B2A27]">
                  <span className="text-[#6F6B62] block mb-1 text-[9px] uppercase tracking-wider">
                    ORIGINAL EXCERPT
                  </span>
                  &ldquo;{selectedGhost.snippet}&rdquo;
                </div>

                <div>
                  <span className="font-mono-code text-[10px] tracking-widest text-[#D9822B] uppercase block mb-1">
                    FULL MEMORIAL EPITAPH
                  </span>
                  <p className="font-editorial text-base text-[#6F6B62] leading-relaxed">
                    {selectedGhost.epitaph.fullText}
                  </p>
                </div>

                {selectedGhost.revivalStep && (
                  <div className="p-4 bg-[#EFEADF] hairline-all">
                    <span className="font-mono-code text-[10px] tracking-widest text-[#2B2A27] uppercase block mb-1">
                      FIRST SMALL STEP TO REVIVE
                    </span>
                    <p className="font-editorial italic text-sm text-[#2B2A27]">
                      {selectedGhost.revivalStep}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="mt-10 pt-6 hairline-t flex items-center justify-between text-xs font-mono-code text-[#6F6B62]">
                <span>PATH: {selectedGhost.path}</span>
                <button
                  onClick={() => setSelectedGhost(null)}
                  className="text-[#2B2A27] hover:text-[#D9822B] uppercase tracking-wider"
                >
                  RETURN TO ALTAR
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
