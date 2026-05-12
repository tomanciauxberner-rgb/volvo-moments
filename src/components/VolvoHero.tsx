'use client';

import { useState } from 'react';
import MomentOverlay from './MomentOverlay';

export default function VolvoHero() {
  const [overlayOpen, setOverlayOpen] = useState(false);

  return (
    <>
      <section
        className="relative w-full min-h-[calc(100vh-92px)] bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/cars/ex30_exterior_01.webp')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/40" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pt-20 md:pt-28">
          <h1 className="text-white text-4xl md:text-6xl font-light leading-[1.05] max-w-2xl drop-shadow-sm">
            Volvo EX30 électrique
          </h1>
          <p className="text-white/95 text-base md:text-lg mt-4 font-light">
            À partir de 299 € / mois HTVA en renting financier.*
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#"
              className="bg-white text-black rounded-full px-6 py-3 text-[15px] hover:bg-white/90 transition-colors"
            >
              La Volvo EX30 électrique
            </a>
            <a
              href="#"
              className="border border-white text-white rounded-full px-6 py-3 text-[15px] hover:bg-white/10 transition-colors"
            >
              Voir l'offre
            </a>
          </div>

          <button
            onClick={() => setOverlayOpen(true)}
            className="group mt-6 hidden md:flex flex-col items-start text-left"
            aria-label="Open Volvo Moments"
          >
            <span className="text-[11px] uppercase tracking-[0.35em] text-white/70 group-hover:text-white transition-colors">
              Volvo Moments
            </span>
            <span className="mt-2 text-white text-2xl font-light italic drop-shadow-md">
              Or — describe a moment, and let us find your Volvo
            </span>
            <span className="mt-3 w-10 h-px bg-white/60 group-hover:w-20 group-hover:bg-white transition-all duration-500" />
          </button>
        </div>

        <button
          onClick={() => setOverlayOpen(true)}
          className="md:hidden absolute bottom-24 left-6 right-6 z-20 group flex flex-col items-start text-left"
          aria-label="Open Volvo Moments"
        >
          <span className="text-[11px] uppercase tracking-[0.35em] text-white/70">
            Volvo Moments
          </span>
          <span className="mt-1 text-white text-base font-light italic drop-shadow-md">
            Or — describe a moment, and let us find your Volvo
          </span>
          <span className="mt-2 w-8 h-px bg-white/60 group-hover:w-16 group-hover:bg-white transition-all duration-500" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 z-10 h-24 bg-gradient-to-t from-black/50 to-transparent" />
      </section>

      {overlayOpen && <MomentOverlay onClose={() => setOverlayOpen(false)} />}
    </>
  );
}
