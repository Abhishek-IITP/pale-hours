'use client';

export default function FilmGrain() {
  return (
    <div
      aria-hidden="true"
      className="film-grain-layer fixed inset[-20%] w-[140%] h-[140%] pointer-events-none z-50 opacity-[0.04] mix-blend-multiply"
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}
