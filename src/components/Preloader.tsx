'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [mounted, setMounted] = useState(false);
  const [complete, setComplete] = useState(false);
  const [ignited, setIgnited] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer1 = setTimeout(() => setIgnited(true), 300);
    const timer2 = setTimeout(() => setComplete(true), 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!mounted) return null;

  const titleLetters = 'Pale Hours'.split('');

  return (
    <AnimatePresence>
      {!complete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[10000] bg-[#F4F0E8] flex flex-col items-center justify-center cursor-pointer select-none"
          onClick={() => setComplete(true)}
          suppressHydrationWarning
        >
          {/* Candle Flame Assembly */}
          <div className="relative mb-8 flex flex-col items-center" suppressHydrationWarning>
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={ignited ? { scaleY: [0, 1.2, 0.95, 1], opacity: 1 } : { scaleY: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-4 h-9 bg-[#D9822B] rounded-[50%_50%_35%_35%/70%_70%_30%_30%] animate-flame origin-bottom shadow-none"
              suppressHydrationWarning
            >
              <div className="w-1.5 h-4 bg-[#FAF8F3] mx-auto mt-3 rounded-full opacity-70" />
            </motion.div>
            <div className="w-[1.5px] h-3 bg-[#2B2A27]" />
            <div className="w-8 h-1.5 bg-[#CFC8B8]" />
          </div>

          {/* Letter by letter text assembly */}
          <div className="flex items-center gap-[0.05em] overflow-hidden" suppressHydrationWarning>
            {titleLetters.map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                animate={ignited ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                transition={{
                  duration: 0.7,
                  delay: 0.5 + index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`font-serif-display text-4xl md:text-5xl text-[#2B2A27] tracking-tight ${
                  char === ' ' ? 'w-3' : ''
                }`}
                suppressHydrationWarning
              >
                {char}
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={ignited ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="mt-4 font-mono-code text-[10px] tracking-[0.25em] text-[#6F6B62] uppercase"
            suppressHydrationWarning
          >
            A local sanctuary for abandoned things
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
