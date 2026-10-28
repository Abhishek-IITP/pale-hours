'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FogField from '@/components/canvas/FogField';
import CandleCanvas from '@/components/canvas/CandleCanvas';
import { INITIAL_GHOSTS } from '@/data/ghosts';
import { WifiOff, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const horizontalSectionRef = useRef<HTMLDivElement | null>(null);
  const horizontalTrainRef = useRef<HTMLDivElement | null>(null);
  const disappearingRef = useRef<HTMLDivElement | null>(null);

  const heroWords = ['Everything', 'you', 'never', 'finished', 'is', 'still', 'here.'];

  const deadDraftParagraph = [
    "I'll", 'write', 'you', 'again', 'when', 'the', 'winter', 'passes.',
    'The', 'trains', 'are', 'running', 'on', 'schedule', 'again,',
    'and', 'the', 'apartment', 'has', 'finally', 'grown', 'quiet.',
    'It', "wasn't", 'that', 'I', 'forgot.', 'It', 'was', 'that',
    'it', "didn't", 'die.', 'It', 'was', 'never', 'read.'
  ];

  const sixGhosts = INITIAL_GHOSTS.slice(0, 6);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Disappearing sentence scrub
      if (disappearingRef.current) {
        gsap.to('.draft-word', {
          scrollTrigger: {
            trigger: disappearingRef.current,
            start: 'top 30%',
            end: 'bottom top',
            scrub: 1.2,
          },
          opacity: 0.15,
          stagger: 0.08,
        });

        gsap.to('.strike-line', {
          scrollTrigger: {
            trigger: disappearingRef.current,
            start: 'top 40%',
            end: 'bottom top',
            scrub: 0.8,
          },
          scaleX: 1,
          stagger: 0.15,
        });
      }

      // 2. Horizontal drift on desktop
      if (horizontalSectionRef.current && horizontalTrainRef.current) {
        gsap.to(horizontalTrainRef.current, {
          x: () => (window.innerWidth < 768 ? 0 : -(horizontalTrainRef.current ? horizontalTrainRef.current.scrollWidth - window.innerWidth + 150 : 0)),
          ease: 'none',
          scrollTrigger: {
            trigger: horizontalSectionRef.current,
            pin: true,
            scrub: 1,
            end: () => `+=${horizontalTrainRef.current ? horizontalTrainRef.current.scrollWidth : 2000}`,
            invalidateOnRefresh: true,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-24">
        <FogField />

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          <div className="mb-6 flex items-center gap-3 px-3 py-1.5 bg-[#EFEADF] hairline-all text-[10px] font-mono-code tracking-[0.2em] text-[#6F6B62]">
            <span className="w-2 h-2 rounded-full bg-[#D9822B] animate-pulse" />
            <span>LOCAL · OFFLINE · OPEN-WEIGHT</span>
          </div>

          <h1 className="font-serif-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.95] tracking-tight text-[#2B2A27] mb-8">
            {heroWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className={`inline-block mr-[0.25em] ${i === 3 || i === 5 ? 'font-editorial italic text-[#2B2A27]' : ''}`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <p className="max-w-2xl text-base sm:text-lg text-[#6F6B62] font-editorial italic leading-relaxed mb-12">
            Your unsent drafts, dead repositories, and half-written notes are the most private things you own. This sanctuary reads them locally on your laptop with open weights, composes each a quiet epitaph, and asks you whether to light a candle or let it go.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <Link
              href="/vigil"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#EFEADF] hairline-all text-sm font-mono-code tracking-[0.2em] uppercase text-[#2B2A27] interactive overflow-hidden"
            >
              <span className="absolute inset-0 bg-[#FAF8F3] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center gap-3">
                <span>LIGHT A CANDLE</span>
                <ArrowRight className="w-4 h-4 text-[#D9822B] group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              href="/open"
              className="inline-flex items-center gap-2 px-6 py-4 hairline-all text-sm font-mono-code tracking-[0.16em] uppercase text-[#6F6B62] hover:text-[#2B2A27] interactive transition-colors"
            >
              <WifiOff className="w-4 h-4" />
              <span>WHY OPEN MATTERS</span>
            </Link>
          </div>
        </div>
      </section>

      {/* THE DISAPPEARING SENTENCE (PINNED SCRUB) */}
      <section
        ref={disappearingRef}
        className="relative min-h-[100vh] py-32 px-6 bg-[#EFEADF] hairline-t hairline-b flex flex-col items-center justify-center"
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 font-mono-code text-[10px] tracking-[0.25em] text-[#6F6B62] uppercase">
            Rite 0 — The Unread Manuscript
          </div>

          <p className="font-editorial text-2xl sm:text-4xl md:text-5xl leading-[1.3] text-[#2B2A27] relative">
            {deadDraftParagraph.map((word, i) => (
              <span key={i} className="relative inline-block mr-[0.25em] my-1">
                <span className="draft-word transition-opacity">{word}</span>
                <span
                  className="strike-line absolute left-0 right-0 top-1/2 h-[1px] bg-[#CFC8B8] origin-left scale-x-0"
                />
              </span>
            ))}
          </p>

          <div className="mt-12 font-mono-code text-sm text-[#6F6B62] flex items-center gap-4">
            <span className="h-[1px] w-12 bg-[#CFC8B8]" />
            <span className="italic font-editorial text-[#2B2A27] text-lg">
              &ldquo;It didn&apos;t die. It was never read.&rdquo;
            </span>
          </div>
        </div>
      </section>

      {/* HORIZONTAL DRIFT OF GHOSTS */}
      <section
        ref={horizontalSectionRef}
        className="relative py-24 bg-[#F4F0E8] hairline-b overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="font-mono-code text-[10px] tracking-[0.25em] text-[#6F6B62] uppercase mb-2">
            Drifting Sheets — Six Artifacts
          </div>
          <h2 className="font-serif-display text-3xl sm:text-5xl text-[#2B2A27]">
            Fossils of intention, resting on your drive.
          </h2>
        </div>

        <div
          ref={horizontalTrainRef}
          className="flex flex-col md:flex-row gap-8 px-6 md:px-12"
        >
          {sixGhosts.map((ghost, index) => (
            <div
              key={ghost.id}
              className="vellum-sheet w-full md:w-[420px] flex-shrink-0 p-8 relative md:hover:-translate-y-2 transition-transform duration-400"
              style={{
                transform: index % 2 === 0 ? 'rotate(0.6deg)' : 'rotate(-0.5deg)',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono-code text-[10px] tracking-[0.2em] text-[#6F6B62] uppercase">
                  {ghost.originDate}
                </span>
                <span className="font-mono-code text-[9px] px-2 py-0.5 bg-[#EFEADF] hairline-all text-[#6F6B62] uppercase">
                  {ghost.type}
                </span>
              </div>

              <h3 className="font-serif-display text-2xl text-[#2B2A27] mb-3">
                {ghost.title}
              </h3>

              <p className="font-editorial italic text-sm text-[#6F6B62] mb-6 line-clamp-3">
                &ldquo;{ghost.snippet}&rdquo;
              </p>

              <div className="hairline-t pt-4 flex items-center justify-between">
                <span className="font-mono-code text-[10px] text-[#6F6B62]">
                  {ghost.size} · {ghost.daysAbandoned}d ago
                </span>
                <Link
                  href={`/vigil?ghost=${ghost.id}`}
                  className="font-mono-code text-[10px] tracking-widest text-[#2B2A27] hover:text-[#D9822B] interactive"
                >
                  READ EPITAPH &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* THE THREE RITES */}
      <section className="py-32 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <div className="font-mono-code text-[10px] tracking-[0.25em] text-[#6F6B62] uppercase mb-2">
            The Actions of Remembrance
          </div>
          <h2 className="font-serif-display text-4xl sm:text-5xl text-[#2B2A27]">
            Three Rites for your Packages of Dust.
          </h2>
        </div>

        <div className="flex flex-col gap-16">
          {/* Rite I: Find */}
          <div className="vellum-sheet p-8 md:p-12 flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="max-w-md">
              <div className="font-mono-code text-[10px] tracking-widest text-[#D9822B] mb-2">
                RITE I — FIND
              </div>
              <h3 className="font-serif-display text-3xl text-[#2B2A27] mb-4">
                Point it at a folder you avoided.
              </h3>
              <p className="font-editorial italic text-base text-[#6F6B62] leading-relaxed">
                Pale Hours finds dead git branches, audio voice notes, unsent text messages, screenshots, and comments labeled // TODO. Nothing is uploaded. Everything is transcribed locally via whisper.cpp.
              </p>
            </div>
            <div className="bg-[#FAF8F3] hairline-all p-6 w-full md:w-72 font-mono-code text-xs text-[#6F6B62]">
              <div className="flex items-center gap-2 mb-3 text-[#2B2A27]">
                <span className="w-2 h-2 rounded-full bg-[#D9822B]" />
                <span>local_scanner.si</span>
              </div>
              <div className="space-y-1">
                <div>&gt; whisper, 12 files</div>
                <div>&gt; git repos, 4 dead</div>
                <div className="text-[#D9822B]">&gt; 0 bytes transmitted</div>
              </div>
            </div>
          </div>

          {/* Rite II: Remember */}
          <div className="vellum-sheet p-8 md:p-12 flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="max-w-md">
              <div className="font-mono-code text-[10px] tracking-widest text-[#D9822B] mb-2">
                RITE II — REMEMBER
              </div>
              <h3 className="font-serif-display text-3xl text-[#2B2A27] mb-4">
                A local model writes its epitaph.
              </h3>
              <p className="font-editorial italic text-base text-[#6F6B62] leading-relaxed">
                Open-weight Gemma 3 reads your words with quiet, lyrical precision. It does not try to optimize your productivity. It speaks only of what you once cared about, and what it was trying to become.
              </p>
            </div>

            <div className="flex items-center justify-center w-full md:w-72 h-32 bg-[#EFEADF] hairline-all">
              <CandleCanvas size="lg" isStreaming={true} />
            </div>
          </div>

          {/* Rite III: Release */}
          <div className="vellum-sheet p-8 md:p-12 flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="max-w-md">
              <div className="font-mono-code text-[10px] tracking-widest text-[#D9822B] mb-2">
                RITE III — RELEASE
              </div>
              <h3 className="font-serif-display text-3xl text-[#2B2A27] mb-4">
                Light a path forward, or let it go to ash.
              </h3>
              <p className="font-editorial italic text-base text-[#6F6B62] leading-relaxed">
                The model drafts a single, gentle first step to revive it. Or if you are ready, you may click &ldquo;Let it go&rdquo; — the vellum sheet dissolves into upward drifting ash, to a chime of brass.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 p-6 bg-[#FAF8F3] hairline-all text-sm font-mono-code text-[#2B2A27]">
              <span className="text-[#D9822B]">LIGHT CANDLE</span>
              <span className="text-[#CFC8B8]">/</span>
              <span className="text-[#6F6B62]">LET IT GO</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY MOMENT */}
      <section className="py-32 px-6 bg-[#EFEADF] hairline-t hairline-b">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          <div className="relative mb-8">
            <WifiOff className="w-16 h-16 text-[#2B2A27]" />
            <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-[#D9822B] -rotate-45" />
          </div>

          <h2 className="font-serif-display text-4xl sm:text-6xl text-[#2B2A27] mb-6">
            No cloud. No account. No one watching.
          </h2>

          <p className="font-editorial italic text-lg text-[#6F6B62] leading-relaxed mb-10">
            Your dead drafts are not training data for a vendor. They do not leave your SSD. They stay where you wrote them, and when you turn your laptop off, they sleep with you.
          </p>

          <div className="flex items-center gap-8 font-mono-code text-xs tracking-[0.2em] text-[#6F6B62]">
            <span>0 BYTES SENT</span>
            <span className="text-[#CFC8B8]">·</span>
            <span>GGUF ON SILICON</span>
            <span className="text-[#CFC8B8]">·</span>
            <span>100% LOCAL MODELS</span>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="py-24 bg-[#F4F0E8] overflow-hidden">
        <div className="space-y-6">
          <div className="flex whitespace-nowrap gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="font-serif-display italic text-3xl sm:text-4xl text-[#6F6B62]/80">
                &ldquo;An apology that arrived at every correct truth except courage&rdquo; &mdash; &ldquo;A 3 AM masterpiece that met a 7 AM segfault&rdquo; &mdash;
              </span>
            ))}
          </div>
          <div className="flex whitespace-nowrap gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="font-serif-display italic text-3xl sm:text-4xl text-[#6F6B62]/60">
                &ldquo;A translator marooned on an untranslatable preposition&rdquo; &mdash; &ldquo;It wasn&apos;t that I forgot. It wasn&apos;t read.&rdquo; &mdash;
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 bg-[#EFEADF] hairline-t text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <div className="mb-6">
            <CandleCanvas size="lg" isStreaming={false} />
          </div>

          <h2 className="font-serif-display text-4xl sm:text-6xl text-[#2B2A27] mb-6">
            Your ghosts are waiting for you.
          </h2>

          <p className="font-editorial italic text-base text-[#6F6B62] leading-relaxed mb-10 max-w-xl">
            Enter the Vigil. Drop an unfinished draft or choose from your past. Hear what it was trying to say before you stopped.
          </p>

          <Link
            href="/vigil"
            className="group relative inline-flex items-center gap-4 px-10 py-5 bg-[#EFEADF] hairline-all text-sm font-mono-code tracking-[0.25em] uppercase text-[#2B2A27] interactive overflow-hidden"
          >
            <span className="absolute inset-0 bg-[#FAF8F3] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center gap-3">
              <span>LIGHT A CANDLE — ENTER THE VIGIL</span>
              <ArrowRight className="w-4 h-4 text-[#D9822B] group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
