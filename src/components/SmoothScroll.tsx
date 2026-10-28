'use client';

import { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
      autoResize: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    const onScrollTriggerRefresh = () => {
      lenis.resize();
    };
    ScrollTrigger.addEventListener('refresh', onScrollTriggerRefresh);

    const timer1 = setTimeout(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    }, 250);

    const timer2 = setTimeout(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      ScrollTrigger.removeEventListener('refresh', onScrollTriggerRefresh);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
