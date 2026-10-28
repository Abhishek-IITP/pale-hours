'use client';

import { motion } from 'framer-motion';

interface CandleCanvasProps {
  isLit?: boolean;
  isStreaming?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function CandleCanvas({
  isLit = true,
  isStreaming = false,
  size = 'md',
  className = '',
}: CandleCanvasProps) {
  const sizeMap = {
    sm: { flameW: 'w-2.5', flameH: 'h-6', coreW: 'w-1', coreH: 'h-2.5', baseW: 'w-6' },
    md: { flameW: 'w-4', flameH: 'h-10', coreW: 'w-1.5', coreH: 'h-4', baseW: 'w-8' },
    lg: { flameW: 'w-6', flameH: 'h-14', coreW: 'w-2', coreH: 'h-6', baseW: 'w-12' },
  };

  const currentSize = sizeMap[size];

  if (!isLit) {
    return (
      <div className={`flex flex-col items-center justify-end ${className}`}>
        <div className="w-[1.5px] h-3 bg-[#6F6B62]" />
        <div className={`${currentSize.baseW} h-1.5 bg-[#CFC8B8]`} />
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col items-center justify-end select-none ${className}`}>
      <motion.div
        animate={
          isStreaming
            ? {
                scaleY: [1, 1.25, 0.9, 1.15, 1],
                scaleX: [1, 0.92, 1.08, 0.95, 1],
                y: [0, -2, 1, -1, 0],
              }
            : {
                scaleY: [1, 1.08, 0.96, 1],
                scaleX: [1, 0.97, 1.03, 1],
                y: [0, -1, 0.5, 0],
              }
        }
        transition={{
          duration: isStreaming ? 0.35 : 1.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`${currentSize.flameW} ${currentSize.flameH} bg-[#D9822B] rounded-[50%_50%_35%_35%/70%_70%_30%_30%] origin-bottom shadow-none relative`}
      >
        <div
          className={`${currentSize.coreW} ${currentSize.coreH} bg-[#FAF8F3] mx-auto mt-2 rounded-full opacity-80`}
        />
      </motion.div>
      <div className="w-[1.5px] h-2.5 bg-[#2B2A27]" />
      <div className={`${currentSize.baseW} h-1.5 bg-[#CFC8B8]`} />
    </div>
  );
}
