'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Terminal, Cpu, Database, HardDrive, Shield, Sparkles, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function OpenPage() {
  const [selectedModel, setSelectedModel] = useState<string>('gemma3');

  const modelSamples: Record<string, { name: string; tag: string; voice: string; quote: string }> = {
    gemma3: {
      name: 'Gemma 3 (12B / 4B Int4)',
      tag: 'Lyrical & Tender (Primary)',
      voice: 'Google DeepMind open weights. Soft, literary prose attuned to emotional subtlety, memory, and the tactile feeling of paper and ink.',
      quote:
        '“Dust over an open nerve. The apology breathes softly in the margin, wondering if forgiveness has an expiration date. It was never read, but the hours spent writing it were honest hours.”',
    },
    qwen3: {
      name: 'Qwen 3 (8B Q4_K_M)',
      tag: 'Contemplative & Precise',
      voice: 'A quiet, reverent tone that treats deleted code and unfinished letters as archaeological artifacts.',
      quote:
        '“A letter of contrition composed between 2:14 AM and dawn. It arrived at every truth except the courage to be delivered. It spent three years cooling in the ~/Drafts folder, turning slowly from an act of grace into a fossil of pride.”',
    },
    llama3: {
      name: 'Llama 3.3 (8B Q5_K_S)',
      tag: 'Analytical & Structural',
      voice: 'Clear, structural post-mortem focusing on cognitive friction, decision thresholds, and architectural cessation.',
      quote:
        '“Artifact analysis: High semantic remorse. Transmission halted at line 14 due to decision threshold hesitation. Architecture sound; social delivery canceled. Stored on local SSD with zero external footprint.”',
    },
    mistral: {
      name: 'Mistral Small (24B)',
      tag: 'Direct & Unsparing',
      voice: 'Concise, sharp, and impatient with hesitation. Strips away romanticism to deliver the bare truth.',
      quote:
        '“Six drafts, zero transmissions. A clean confession suffocated by fear. You spent two hours writing what could have been said in three words. Either send it today or delete the file.”',
    },
    personal: {
      name: 'Fine-Tuned Personal Voice (LoRA)',
      tag: 'Your Own Cadence',
      voice: 'Adapted on your own past journals and essays using a local LoRA adapter so the mirror sounds like you.',
      quote:
        '“You wrote this because you were terrified of being seen. You don’t need to hide behind drafts anymore. Drink some tea, make the call, and let the ghost go.”',
    },
  };

  const currentSample = modelSamples[selectedModel] || modelSamples['gemma3'];

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#F4F0E8] py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-28">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="font-mono-code text-[10px] tracking-[0.25em] text-[#6F6B62] uppercase mb-4">
            Architecture &middot; Local-First &middot; The Sovereign Stack
          </div>
          <h1 className="font-serif-display text-4xl sm:text-6xl text-[#2B2A27] mb-6">
            How It Haunts
          </h1>
          <p className="font-editorial italic text-lg text-[#6F6B62] leading-relaxed">
            Your abandoned thoughts are your most vulnerable possessions. If an AI reads them, that model must belong to you, run on your machine, and vanish when you close the lid.
          </p>
        </div>

        {/* ANIMATED ARCHITECTURE DIAGRAM */}
        <section className="space-y-6">
          <div className="flex items-baseline justify-between pb-3 hairline-b">
            <span className="font-mono-code text-xs tracking-widest text-[#2B2A27] uppercase">
              LOCAL DATA FLOW &middot; ZERO CLOUD TELEMETRY
            </span>
            <span className="font-mono-code text-[10px] text-[#D9822B]">100% AIR-GAPPED READY</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Step 1 */}
            <div className="vellum-sheet p-6 flex flex-col justify-between">
              <div>
                <HardDrive className="w-6 h-6 text-[#2B2A27] mb-4" />
                <span className="font-mono-code text-[10px] text-[#D9822B] uppercase block mb-1">
                  Step 01
                </span>
                <h3 className="font-serif-display text-xl text-[#2B2A27] mb-2">Local Folder</h3>
                <p className="font-editorial italic text-xs text-[#6F6B62]">
                  ~/Drafts, git commits, raw audio memos on your SSD.
                </p>
              </div>
              <span className="mt-4 font-mono-code text-[9px] text-[#6F6B62]">ON DISK</span>
            </div>

            {/* Step 2 */}
            <div className="vellum-sheet p-6 flex flex-col justify-between">
              <div>
                <Terminal className="w-6 h-6 text-[#2B2A27] mb-4" />
                <span className="font-mono-code text-[10px] text-[#D9822B] uppercase block mb-1">
                  Step 02
                </span>
                <h3 className="font-serif-display text-xl text-[#2B2A27] mb-2">whisper.cpp</h3>
                <p className="font-editorial italic text-xs text-[#6F6B62]">
                  C++ local audio transcription and lightweight AST parser.
                </p>
              </div>
              <span className="mt-4 font-mono-code text-[9px] text-[#6F6B62]">NO API KEYS</span>
            </div>

            {/* Step 3 */}
            <div className="vellum-sheet p-6 flex flex-col justify-between bg-[#EFEADF]">
              <div>
                <Cpu className="w-6 h-6 text-[#D9822B] mb-4" />
                <span className="font-mono-code text-[10px] text-[#D9822B] uppercase block mb-1">
                  Step 03
                </span>
                <h3 className="font-serif-display text-xl text-[#2B2A27] mb-2">Local GGUF</h3>
                <p className="font-editorial italic text-xs text-[#6F6B62]">
                  Ollama / llama.cpp running Gemma 3 or Qwen 3 locally.
                </p>
              </div>
              <span className="mt-4 font-mono-code text-[9px] text-[#D9822B]">LOCAL WEIGHTS</span>
            </div>

            {/* Step 4 */}
            <div className="vellum-sheet p-6 flex flex-col justify-between">
              <div>
                <Sparkles className="w-6 h-6 text-[#2B2A27] mb-4" />
                <span className="font-mono-code text-[10px] text-[#D9822B] uppercase block mb-1">
                  Step 04
                </span>
                <h3 className="font-serif-display text-xl text-[#2B2A27] mb-2">Streamed Epitaph</h3>
                <p className="font-editorial italic text-xs text-[#6F6B62]">
                  Tokens streamed to the UI with flame flicker sync.
                </p>
              </div>
              <span className="mt-4 font-mono-code text-[9px] text-[#6F6B62]">40 TOK/S</span>
            </div>

            {/* Severed Step */}
            <div className="vellum-sheet p-6 flex flex-col justify-between opacity-50 relative border-dashed border-[#D9822B]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-[1px] w-full bg-[#D9822B] rotate-45" />
              </div>
              <div>
                <WifiOff className="w-6 h-6 text-[#6F6B62] mb-4" />
                <span className="font-mono-code text-[10px] text-[#6F6B62] uppercase block mb-1">
                  Severed
                </span>
                <h3 className="font-serif-display text-xl text-[#2B2A27] line-through mb-2">The Cloud</h3>
                <p className="font-editorial italic text-xs text-[#6F6B62]">
                  No vendor servers, no logs, zero packets leave your Wi-Fi.
                </p>
              </div>
              <span className="mt-4 font-mono-code text-[9px] text-[#D9822B]">CUT BY DESIGN</span>
            </div>
          </div>
        </section>

        {/* OPEN VS CLOSED TYPOGRAPHIC COMPARISON */}
        <section className="space-y-8">
          <div className="pb-3 hairline-b">
            <h2 className="font-serif-display text-3xl text-[#2B2A27]">
              Open vs. Closed AI
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-mono-code text-xs">
            {/* Closed */}
            <div className="space-y-6">
              <span className="text-[#6F6B62] uppercase tracking-widest block text-[10px]">
                PROPRIETARY / CLOUD APIS
              </span>

              <div className="space-y-4 text-[#6F6B62]">
                <div className="hairline-b pb-3">
                  <div className="text-[#2B2A27] mb-1">DRAFTS SENT OVER THE INTERNET</div>
                  <p className="font-editorial italic text-sm">
                    Your most intimate regrets, unsent apologies, and raw code transmitted to a corporate data center.
                  </p>
                </div>

                <div className="hairline-b pb-3">
                  <div className="text-[#2B2A27] mb-1">SUBSCRIPTION PAYWALLS</div>
                  <p className="font-editorial italic text-sm">
                    $20/month rent to access your own memory. If your card expires, your altar disappears.
                  </p>
                </div>

                <div className="hairline-b pb-3">
                  <div className="text-[#2B2A27] mb-1">MODEL DEPRECATION & SILENT RETIREMENT</div>
                  <p className="font-editorial italic text-sm">
                    Vendors shut down model checkpoints without warning. The voice that wrote your memorial vanishes.
                  </p>
                </div>

                <div>
                  <div className="text-[#2B2A27] mb-1">TERMS OF SERVICE SURVEILLANCE</div>
                  <p className="font-editorial italic text-sm">
                    Prompts inspected by automated safety filters and retained for corporate training pipelines.
                  </p>
                </div>
              </div>
            </div>

            {/* Open */}
            <div className="space-y-6">
              <span className="text-[#D9822B] uppercase tracking-widest block text-[10px]">
                PALE HOURS (OPEN-WEIGHT LOCAL)
              </span>

              <div className="space-y-4 text-[#2B2A27]">
                <div className="hairline-b pb-3">
                  <div className="text-[#D9822B] mb-1">WORKS WITH WI-FI OFF</div>
                  <p className="font-editorial italic text-sm text-[#6F6B62]">
                    Data never leaves your local disk. Disconnect your router and the site continues without a single dropped token.
                  </p>
                </div>

                <div className="hairline-b pb-3">
                  <div className="text-[#D9822B] mb-1">ZERO OPERATING COST</div>
                  <p className="font-editorial italic text-sm text-[#6F6B62]">
                    Runs on your laptop CPU or Apple Silicon GPU via quantized GGUF weights. It costs zero dollars per token.
                  </p>
                </div>

                <div className="hairline-b pb-3">
                  <div className="text-[#D9822B] mb-1">PERMANENT SOVEREIGNTY</div>
                  <p className="font-editorial italic text-sm text-[#6F6B62]">
                    The model weights are files on your SSD. No vendor can revoke, alter, or decommission them.
                  </p>
                </div>

                <div>
                  <div className="text-[#D9822B] mb-1">FINE-TUNE YOUR OWN CADENCE</div>
                  <p className="font-editorial italic text-sm text-[#6F6B62]">
                    Run Gemma 3 as your primary voice, or train a private LoRA adapter on your personal writing style.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE MODEL VOICE SWAPPER */}
        <section className="space-y-8">
          <div className="pb-3 hairline-b">
            <h2 className="font-serif-display text-3xl text-[#2B2A27]">
              The Model Voice Swapper
            </h2>
            <p className="font-editorial italic text-sm text-[#6F6B62] mt-1">
              Select an open-weight model to observe how different architectures interpret the exact same abandoned letter.
            </p>
          </div>

          {/* Model Selection Tabs */}
          <div className="flex flex-wrap gap-3 font-mono-code text-xs">
            {Object.entries(modelSamples).map(([key, data]) => (
              <button
                key={key}
                onClick={() => setSelectedModel(key)}
                className={`px-4 py-2 hairline-all transition-colors interactive uppercase ${
                  selectedModel === key
                    ? 'bg-[#2B2A27] text-[#FAF8F3]'
                    : 'bg-[#EFEADF] text-[#6F6B62] hover:text-[#2B2A27]'
                }`}
              >
                {data.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Active Voice Box */}
          <div className="vellum-sheet p-8 sm:p-12 space-y-6">
            <div className="flex items-center justify-between font-mono-code text-xs text-[#6F6B62] pb-3 hairline-b">
              <span className="text-[#2B2A27] font-semibold">{currentSample.name}</span>
              <span className="text-[#D9822B]">{currentSample.tag}</span>
            </div>

            <p className="font-editorial text-xs text-[#6F6B62] italic">
              {currentSample.voice}
            </p>

            <AnimatePresence mode="wait">
              <motion.blockquote
                key={selectedModel}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="font-editorial italic text-xl sm:text-2xl text-[#2B2A27] leading-relaxed pl-4 border-l-2 border-[#D9822B]"
              >
                {currentSample.quote}
              </motion.blockquote>
            </AnimatePresence>
          </div>
        </section>

        {/* RUN INSTRUCTIONS & ESSAY */}
        <section className="space-y-8">
          <div className="pb-3 hairline-b">
            <h2 className="font-serif-display text-3xl text-[#2B2A27]">
              Run It Locally in 2 Minutes
            </h2>
          </div>

          <div className="bg-[#FAF8F3] hairline-all p-6 font-mono-code text-xs text-[#2B2A27] space-y-4">
            <div>
              <span className="text-[#6F6B62] block mb-1"># 1. Install Ollama and pull an open-weight model</span>
              <code>curl -fsSL https://ollama.com/install.sh | sh</code><br />
              <code>ollama pull gemma3</code>
            </div>

            <div>
              <span className="text-[#6F6B62] block mb-1"># 2. Clone repository &amp; install with Bun</span>
              <code>git clone https://github.com/pale-hours/pale-hours.git</code><br />
              <code>cd pale-hours &amp;&amp; bun install</code>
            </div>

            <div>
              <span className="text-[#6F6B62] block mb-1"># 3. Launch local dev server (works with Wi-Fi off)</span>
              <code>bun dev</code>
            </div>
          </div>
        </section>

        {/* ESSAY */}
        <article className="prose max-w-none pt-8 space-y-6">
          <h2 className="font-serif-display text-3xl text-[#2B2A27]">
            Why Open-Source AI is the Only Medium for Human Memory
          </h2>

          <div className="font-editorial italic text-base sm:text-lg text-[#6F6B62] leading-relaxed space-y-4">
            <p>
              When a person abandons a project, they are rarely abandoning lines of code or paragraphs of prose. They are abandoning an imagined future. The 3 AM commit that ends on a segfault is not a syntax error; it is the boundary where enthusiasm met exhaustion.
            </p>
            <p>
              To offer these artifacts to a centralized commercial API is to misunderstand what they are. A commercial model is designed to optimize, summarize, and convert human intention into productivity metrics. Worse, it logs your drafts to remote databases, subject to terms of service changes and vendor surveillance.
            </p>
            <p>
              Open weights fundamentally change this relationship. When a 4-bit quantized model runs on your own silicon, it owes nothing to an investor and seeks no retention metric. It acts as an open, private mirror. In the spirit of Día de los Muertos, Pale Hours does not ask you to monetize your past. It simply offers an altar, a candle flame, and the dignity of remembrance.
            </p>
          </div>
        </article>

        {/* CALL TO ACTION */}
        <div className="pt-12 hairline-t text-center">
          <Link
            href="/vigil"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#EFEADF] hairline-all text-xs font-mono-code tracking-[0.2em] uppercase text-[#2B2A27] hover:bg-[#FAF8F3] transition-colors interactive"
          >
            <span>ENTER THE VIGIL</span>
            <ArrowRight className="w-4 h-4 text-[#D9822B]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
