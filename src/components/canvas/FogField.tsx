'use client';

import { useEffect, useRef } from 'react';

export default function FogField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    interface FogCloud {
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      alpha: number;
    }

    const clouds: FogCloud[] = Array.from({ length: 24 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 180 + Math.random() * 260,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.25,
      alpha: 0.12 + Math.random() * 0.15,
    }));

    let time = 0;

    const render = () => {
      time += 0.008;

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < clouds.length; i++) {
        const c = clouds[i];
        c.x += c.speedX;
        c.y += c.speedY;

        if (c.x < -c.radius) c.x = width + c.radius;
        if (c.x > width + c.radius) c.x = -c.radius;
        if (c.y < -c.radius) c.y = height + c.radius;
        if (c.y > height + c.radius) c.y = -c.radius;

        const dx = c.x - mouse.x;
        const dy = c.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let repel = 1;
        if (dist < 260) {
          const force = (1 - dist / 260) * 45;
          c.x += (dx / dist) * force * 0.08;
          c.y += (dy / dist) * force * 0.08;
          repel = Math.max(0.2, dist / 260);
        }

        const currentRadius = c.radius + Math.sin(time + i) * 20;

        const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, currentRadius);
        grad.addColorStop(0, `rgba(250, 248, 243, ${c.alpha * repel})`);
        grad.addColorStop(0.6, `rgba(239, 234, 223, ${c.alpha * 0.5 * repel})`);
        grad.addColorStop(1, 'rgba(244, 240, 232, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
}
