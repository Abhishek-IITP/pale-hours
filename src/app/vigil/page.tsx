'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INITIAL_GHOSTS, Ghost } from '@/data/ghosts';
import CandleCanvas from '@/components/canvas/CandleCanvas';
import { audio } from '@/lib/audio';
import {
  WifiOff,
  Flame,
  Wind,
  Plus,
  Radio,
  FileText,
  UploadCloud,
  Check,
  RotateCcw,
} from 'lucide-react';

export default function VigilPage() {
  const [ghosts, setGhosts] = useState<Ghost[]>(INITIAL_GHOSTS);
  const [selectedId, setSelectedId] = useState<string>(INITIAL_GHOSTS[0].id);
  const [streamedText, setStreamedText] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamMode, setStreamMode] = useState<'demo' | 'live'>('demo');
  const [activeModel, setActiveModel] = useState<string>('gemma3');
  const [tokensPerSec, setTokensPerSec] = useState<number>(38);
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSnippet, setNewSnippet] = useState('');
  const [revivalMode, setRevivalMode] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const abortControllerRef = useRef<AbortController | null>(null);

  const selectedGhost = ghosts.find((g) => g.id === selectedId) || ghosts[0];

  // Load from local storage or API on mount
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

  // Sync to local storage
  const updateGhosts = (newGhosts: Ghost[]) => {
    setGhosts(newGhosts);
    try {
      localStorage.setItem('pale_hours_ghosts', JSON.stringify(newGhosts));
    } catch {
      // ignore
    }
  };

  // Trigger streaming when a ghost is selected or action is taken
  const startStream = async (ghost: Ghost, action: 'epitaph' | 'revive' = 'epitaph') => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsStreaming(true);
    setStreamedText('');
    setRevivalMode(action === 'revive');

    try {
      const res = await fetch('/api/epitaph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ghostId: ghost.id,
          action,
          mode: streamMode,
          model: activeModel,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.body) throw new Error('No body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let tokenCount = 0;
      const startTime = performance.now();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.response) {
                accumulated += data.response;
                setStreamedText(accumulated);
                tokenCount++;

                // Subtle audio tick
                if (tokenCount % 3 === 0 && audio) {
                  audio.playTokenFlicker();
                }

                // Update tok/s
                const elapsed = (performance.now() - startTime) / 1000;
                if (elapsed > 0.2) {
                  setTokensPerSec(Math.round(tokenCount / elapsed));
                }
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    } catch {
      // Fallback: display full text directly
      setStreamedText(action === 'revive' ? ghost.revivalStep : ghost.epitaph.fullText);
    } finally {
      setIsStreaming(false);
    }
  };

  // Stream epitaph on initial ghost select
  useEffect(() => {
    if (selectedGhost) {
      startStream(selectedGhost, 'epitaph');
    }
  }, [selectedId]);

  // Mouse tilt calculation on center stage vellum sheet
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({ x: x * 8, y: -y * 8 });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  // Rite: Light a Candle
  const handleLightCandle = () => {
    if (!selectedGhost) return;
    if (audio) {
      audio.playChime(528, 0.2);
    }

    const updated = ghosts.map((g) =>
      g.id === selectedGhost.id ? { ...g, isLit: true, litAt: new Date().toISOString() } : g
    );
    updateGhosts(updated);

    // Stream the revival step
    startStream(selectedGhost, 'revive');

    // Notify backend
    fetch('/api/ghosts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedGhost.id, isLit: true }),
    }).catch(() => {});
  };

  // Rite: Let It Go
  const handleLetItGo = () => {
    if (!selectedGhost) return;
    if (audio) {
      audio.playRelease();
    }

    const updated = ghosts.map((g) =>
      g.id === selectedGhost.id ? { ...g, isReleased: true, releasedAt: new Date().toISOString() } : g
    );
    updateGhosts(updated);

    // Switch to next unreleased ghost
    setTimeout(() => {
      const next = updated.find((g) => !g.isReleased);
      if (next) setSelectedId(next.id);
    }, 1400);

    // Notify backend
    fetch('/api/ghosts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedGhost.id, isReleased: true }),
    }).catch(() => {});
  };

  // File Drop Handler
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string) || '';
      const snippet = content.slice(0, 300) || 'An imported draft with no readable text.';

      const newGhost: Ghost = {
        id: `dropped-${Date.now()}`,
        title: file.name,
        type: file.name.endsWith('.m4a') || file.name.endsWith('.mp3') ? 'voice' : 'draft',
        originDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        abandonedDate: 'Recent',
        daysAbandoned: 0,
        snippet,
        path: `~/Local/${file.name}`,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        epitaph: {
          whatItWas: `A file dropped into the Vigil: ${file.name}.`,
          whenItDied: 'Preserved upon this altar today.',
          whatItWasTryingToBecome: 'An expression given second breath.',
          fullText: `Here rests ${file.name}, summoned into the local vigil from disk. It was never delivered to the network, and its contents remain solely within the memory of this silicon room.`,
        },
        revivalStep: 'Re-open this file in your editor and write one single sentence today.',
        isLit: false,
        isReleased: false,
        modelVoices: {
          qwen3: 'A new manuscript summoned from your files.',
          gemma3: 'Dust stirred from cold disk sectors.',
          llama3: 'New local artifact indexed.',
          mistral: 'Imported without network telemetry.',
          personal: 'You decided to bring this back into the room.',
        },
      };

      const nextList = [newGhost, ...ghosts];
      updateGhosts(nextList);
      setSelectedId(newGhost.id);

      // Persist to API
      fetch('/api/ghosts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGhost),
      }).catch(() => {});
    };
    reader.readAsText(file);
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newGhost: Ghost = {
      id: `manual-${Date.now()}`,
      title: newTitle.trim(),
      type: 'draft',
      originDate: 'Today',
      abandonedDate: 'Recent',
      daysAbandoned: 0,
      snippet: newSnippet.trim() || 'A private fragment without description.',
      path: `~/Notes/Drafts/${newTitle.trim()}`,
      size: '1.0 KB',
      epitaph: {
        whatItWas: `A manuscript added to memory: ${newTitle.trim()}.`,
        whenItDied: 'Today.',
        whatItWasTryingToBecome: 'A complete work.',
        fullText: `Here lies ${newTitle.trim()}, inscribed manually into the vigil. It represents a thought that refused to be forgotten.`,
      },
      revivalStep: 'Write the immediate next paragraph without stopping to delete anything.',
      isLit: false,
      isReleased: false,
      modelVoices: {
        qwen3: 'Written directly into memory.',
        gemma3: 'Fresh ink on clean vellum.',
        llama3: 'Direct input registered.',
        mistral: 'No cloud was harmed in this inscription.',
        personal: 'You gave words to something you kept inside.',
      },
    };

    updateGhosts([newGhost, ...ghosts]);
    setSelectedId(newGhost.id);
    setShowAddModal(false);
    setNewTitle('');
    setNewSnippet('');
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#F4F0E8] flex flex-col">
      {/* TOP TELEMETRY BAR */}
      <div className="w-full bg-[#EFEADF] hairline-b px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono-code">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D9822B] animate-pulse" />
            <span className="text-[#2B2A27] font-medium uppercase tracking-wider">THE VIGIL</span>
          </div>
          <span className="text-[#CFC8B8]">|</span>
          <div className="flex items-center gap-1.5 text-[#6F6B62]">
            <span className="hidden sm:inline">MODEL:</span>
            <select
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value)}
              className="bg-[#FAF8F3] hairline-all px-2 py-0.5 text-[10px] text-[#2B2A27] font-semibold uppercase focus:outline-none cursor-pointer"
            >
              <option value="gemma3">GEMMA 3 (12B)</option>
              <option value="qwen3">QWEN 3 (8B)</option>
              <option value="llama3">LLAMA 3.3 (8B)</option>
              <option value="mistral">MISTRAL (24B)</option>
              <option value="personal">PERSONAL LORA</option>
            </select>
          </div>
          <span className="text-[#CFC8B8] hidden sm:inline">|</span>
          <span className="text-[#6F6B62] hidden md:inline">
            INFERENCE: <span className="text-[#D9822B]">{tokensPerSec} TOK/S</span>
          </span>
        </div>

        {/* Live / Demo Toggle + Offline badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF8F3] hairline-all text-[10px] text-[#6F6B62]">
            <WifiOff className="w-3 h-3 text-[#D9822B]" />
            <span>OFFLINE ONLY</span>
          </div>

          <div className="flex items-center hairline-all bg-[#FAF8F3] text-[10px]">
            <button
              onClick={() => setStreamMode('live')}
              className={`px-2.5 py-1 transition-colors ${
                streamMode === 'live'
                  ? 'bg-[#2B2A27] text-[#FAF8F3]'
                  : 'text-[#6F6B62] hover:text-[#2B2A27]'
              }`}
            >
              LIVE OLLAMA
            </button>
            <button
              onClick={() => setStreamMode('demo')}
              className={`px-2.5 py-1 transition-colors ${
                streamMode === 'demo'
                  ? 'bg-[#2B2A27] text-[#FAF8F3]'
                  : 'text-[#6F6B62] hover:text-[#2B2A27]'
              }`}
            >
              DEMO MODE
            </button>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 hairline-l hairline-r">
        {/* LEFT COLUMN: FILE LEDGER */}
        <aside className="lg:col-span-4 hairline-b lg:hairline-b-0 lg:hairline-r p-6 flex flex-col justify-between bg-[#F4F0E8]/50">
          <div>
            <div className="flex items-center justify-between mb-6 pb-3 hairline-b">
              <span className="font-mono-code text-[10px] tracking-[0.2em] text-[#6F6B62] uppercase">
                ABANDONED ARTIFACTS ({ghosts.filter((g) => !g.isReleased).length})
              </span>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1 text-[10px] font-mono-code text-[#D9822B] hover:text-[#2B2A27] transition-colors interactive"
              >
                <Plus className="w-3 h-3" />
                <span>ADD DRAFT</span>
              </button>
            </div>

            {/* List */}
            <div className="space-y-1">
              {ghosts.map((ghost) => {
                const isSelected = ghost.id === selectedId;
                return (
                  <div
                    key={ghost.id}
                    onClick={() => {
                      if (!ghost.isReleased) setSelectedId(ghost.id);
                    }}
                    className={`w-full text-left p-3.5 transition-all duration-200 cursor-pointer interactive relative ${
                      isSelected
                        ? 'bg-[#EFEADF] hairline-all'
                        : 'hover:bg-[#FAF8F3] hairline-b'
                    } ${ghost.isReleased ? 'opacity-30 line-through' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono-code text-[11px] text-[#2B2A27] truncate font-medium max-w-[200px]">
                        {ghost.title}
                      </span>
                      <div className="flex items-center gap-2">
                        {ghost.isLit && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D9822B]" title="Candle Lit" />
                        )}
                        <span className="font-mono-code text-[9px] text-[#6F6B62] uppercase">
                          {ghost.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono-code text-[#6F6B62]">
                      <span>{ghost.originDate}</span>
                      <span>{ghost.daysAbandoned}d ago</span>
                    </div>

                    {isSelected && (
                      <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#D9822B]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CIRCULAR DASHED DROP ZONE */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            className={`mt-8 p-8 border border-dashed rounded-full flex flex-col items-center justify-center text-center transition-all duration-300 aspect-square max-w-[240px] mx-auto ${
              isDragging
                ? 'border-[#D9822B] bg-[#EFEADF] scale-105'
                : 'border-[#CFC8B8] hover:border-[#2B2A27] bg-[#FAF8F3]/50'
            }`}
          >
            <UploadCloud className="w-5 h-5 text-[#6F6B62] mb-2" />
            <span className="font-mono-code text-[10px] tracking-wider uppercase text-[#2B2A27]">
              DROP LOCAL FILE
            </span>
            <span className="font-mono-code text-[8px] text-[#6F6B62] mt-1">
              .txt · .md · .py · .js · .m4a
            </span>
          </div>
        </aside>

        {/* CENTER STAGE: FLOATING VELLUM SHEET */}
        <section
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="lg:col-span-8 p-6 lg:p-12 flex flex-col justify-between relative overflow-hidden"
        >
          {/* 3D Floating Sheet */}
          <motion.div
            style={{
              rotateX: mouseTilt.y,
              rotateY: mouseTilt.x,
              transformPerspective: 1200,
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="vellum-sheet p-8 sm:p-12 relative flex-1 flex flex-col justify-between"
          >
            <div>
              {/* Header metadata */}
              <div className="flex items-center justify-between pb-4 hairline-b mb-6 text-xs font-mono-code text-[#6F6B62]">
                <div className="flex items-center gap-3">
                  <span className="uppercase tracking-widest text-[#2B2A27]">
                    {selectedGhost?.title}
                  </span>
                  <span>·</span>
                  <span>{selectedGhost?.size}</span>
                </div>
                <div className="flex items-center gap-3">
                  {selectedGhost?.isLit ? (
                    <span className="flex items-center gap-1.5 text-[#D9822B]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D9822B]" />
                      CANDLE LIT
                    </span>
                  ) : (
                    <span className="text-[#6F6B62]">CANDLE UNLIT</span>
                  )}
                </div>
              </div>

              {/* Excerpt / Raw lost content */}
              <div className="mb-8 p-4 bg-[#F4F0E8] hairline-all font-mono-code text-xs text-[#2B2A27] leading-relaxed max-h-36 overflow-y-auto">
                <span className="text-[#6F6B62] block mb-1 text-[9px] uppercase tracking-wider">
                  ORIGINAL SNIPPET:
                </span>
                {selectedGhost?.snippet}
              </div>

              {/* Model Streamed Epitaph */}
              <div className="min-h-[160px]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono-code text-[10px] tracking-[0.2em] text-[#D9822B] uppercase">
                    {revivalMode ? 'REVIVAL FIRST STEP (OPEN MODEL)' : 'COMPOSED EPITAPH (OPEN MODEL)'}
                  </span>
                  {isStreaming && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D9822B] animate-ping" />
                  )}
                </div>

                <p className="font-editorial italic text-xl sm:text-2xl text-[#2B2A27] leading-relaxed">
                  {streamedText || 'Summoning local open weights to read this silence...'}
                  {isStreaming && (
                    <span className="inline-block w-1.5 h-5 bg-[#D9822B] ml-1 animate-pulse align-middle" />
                  )}
                </p>
              </div>
            </div>

            {/* Bottom Actions: Candle & Links */}
            <div className="hairline-t pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <CandleCanvas size="lg" isLit={selectedGhost?.isLit} isStreaming={isStreaming} />
                <div className="font-mono-code text-[10px] text-[#6F6B62]">
                  <div>DIED: {selectedGhost?.epitaph.whenItDied}</div>
                  <div>WAS TRYING: {selectedGhost?.epitaph.whatItWasTryingToBecome}</div>
                </div>
              </div>

              {/* Two Ritual Text Links */}
              <div className="flex items-center gap-8 font-mono-code text-sm">
                <button
                  onClick={handleLightCandle}
                  className="group flex items-center gap-2 text-[#2B2A27] hover:text-[#D9822B] transition-colors interactive tracking-wider uppercase font-medium"
                >
                  <Flame className="w-4 h-4 text-[#D9822B] group-hover:scale-110 transition-transform" />
                  <span>LIGHT A CANDLE</span>
                </button>

                <span className="text-[#CFC8B8]">/</span>

                <button
                  onClick={handleLetItGo}
                  className="group flex items-center gap-2 text-[#6F6B62] hover:text-[#2B2A27] transition-colors interactive tracking-wider uppercase font-medium"
                >
                  <Wind className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  <span>LET IT GO</span>
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      {/* MANUAL DRAFT MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-[#2B2A27]/40 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="vellum-sheet p-8 max-w-lg w-full bg-[#F4F0E8]"
            >
              <div className="flex items-center justify-between mb-6 pb-2 hairline-b">
                <span className="font-serif-display text-2xl text-[#2B2A27]">
                  Inscribe an Abandoned Draft
                </span>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-xs font-mono-code text-[#6F6B62] hover:text-[#2B2A27]"
                >
                  CANCEL
                </button>
              </div>

              <form onSubmit={handleManualAdd} className="space-y-4 font-mono-code text-xs">
                <div>
                  <label className="block text-[#6F6B62] mb-1 uppercase tracking-wider text-[10px]">
                    Title or File Name
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="unsent-email-2022.txt"
                    className="w-full p-2.5 bg-[#FAF8F3] hairline-all text-[#2B2A27] outline-none focus:border-[#D9822B]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#6F6B62] mb-1 uppercase tracking-wider text-[10px]">
                    Snippet or Lost Words
                  </label>
                  <textarea
                    rows={4}
                    value={newSnippet}
                    onChange={(e) => setNewSnippet(e.target.value)}
                    placeholder="Paste the words you stopped writing..."
                    className="w-full p-2.5 bg-[#FAF8F3] hairline-all text-[#2B2A27] outline-none focus:border-[#D9822B]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#EFEADF] hairline-all text-xs tracking-wider uppercase text-[#2B2A27] hover:bg-[#FAF8F3] transition-colors"
                  >
                    PLACE IN VIGIL
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
