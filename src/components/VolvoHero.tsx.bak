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
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pt-20 md:pt-28">
          <h1 className="text-white text-4xl md:text-6xl font-light leading-[1.05] max-w-2xl">
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
            className="mt-10 inline-flex items-center gap-2 text-white/85 hover:text-white text-sm tracking-wide group transition-colors"
            aria-label="Open AI moment input"
          >
            <span className="w-8 h-px bg-white/70 group-hover:w-12 transition-all duration-500" />
            <span className="italic font-light">
              Or — describe a moment, and let us find your Volvo
            </span>
          </button>
        </div>
      </section>

      {overlayOpen && <MomentOverlay onClose={() => setOverlayOpen(false)} />}
    </>
  );
}
