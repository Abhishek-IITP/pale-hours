'use client';

import { useEffect, useState, useRef } from 'react';

interface BreathParticle {
  id: number;
  x: number;
  y: number;
  opacity: number;
  scale: number;
}

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<BreathParticle[]>([]);
  const lastEmit = useRef(0);
  const particleId = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('a') ||
        target?.closest('button') ||
        target?.closest('.interactive') ||
        target?.closest('input')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }

      const now = performance.now();
      if (now - lastEmit.current > 45) {
        lastEmit.current = now;
        const newParticle: BreathParticle = {
          id: particleId.current++,
          x: e.clientX,
          y: e.clientY,
          opacity: 0.35,
          scale: isHovered ? 1.4 : 1.0,
        };
        setParticles((prev) => [...prev.slice(-14), newParticle]);
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            opacity: p.opacity - 0.035,
            scale: p.scale + 0.04,
          }))
          .filter((p) => p.opacity > 0.02)
      );
    }, 32);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      clearInterval(interval);
    };
  }, [isHovered]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${12 * p.scale}px`,
            height: `${12 * p.scale}px`,
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#D9822B',
            opacity: p.opacity * 0.3,
            filter: 'blur(3px)',
          }}
        />
      ))}

      <div
        className="absolute rounded-full border border-[#D9822B]"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: isHovered ? '44px' : '20px',
          height: isHovered ? '44px' : '20px',
          transform: 'translate(-50%, -50%)',
          backgroundColor: isHovered ? 'rgba(217, 130, 43, 0.08)' : 'transparent',
          transition: 'width 0.15s, height 0.15s, background-color 0.15s',
        }}
      >
        <div className="absolute left-1/2 top-1/2 w-[3px] h-[3px] rounded-full bg-[#D9822B] -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}
