'use client';

import { useEffect, useState, useCallback } from 'react';

const PRESETS = [
  'Early winter mornings driving my daughter to school in Brussels.',
  'Weekend escapes to the Ardennes with two kids and the dog.',
  'Quiet drives home through the city after long workdays.',
  'Long summer trips up the coast to Sweden.',
];

interface Props {
  onClose: () => void;
}

export default function MomentOverlay({ onClose }: Props) {
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, []);

  const submit = useCallback(
    async (text: string) => {
      const clean = text.replace(/[<>]/g, '').trim().slice(0, 280);
      if (clean.length < 5 || submitting) return;
      setSubmitting(true);
      // Session 2 will replace this with POST /api/extract-intent.
      // For session 1, we just navigate with the text in the URL.
      const encoded = encodeURIComponent(clean);
      window.location.href = `/moment/preview?text=${encoded}`;
    },
    [submitting]
  );

  return (
    <div
      className={`fixed inset-0 z-50 bg-white transition-opacity duration-700 ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-6 right-6 p-2 text-volvo-mute hover:text-volvo-ink transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>

      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <p
          className={`text-[11px] uppercase tracking-[0.4em] text-volvo-mute transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          Volvo Moments
        </p>

        <h2
          className={`mt-8 text-3xl md:text-5xl font-light max-w-3xl leading-tight transition-all duration-1000 delay-200 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          Not every life fits the same car.
        </h2>

        <div
          className={`mt-16 w-full max-w-2xl transition-all duration-1000 delay-500 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value.slice(0, 280))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit(value);
            }}
            placeholder="Describe a moment you would want to drive through."
            aria-label="Describe a moment"
            autoFocus
            disabled={submitting}
            className="w-full bg-transparent border-0 border-b border-volvo-line
                       focus:border-volvo-ink focus:outline-none
                       text-center text-lg md:text-xl py-4
                       placeholder:text-volvo-mute placeholder:font-light
                       transition-colors duration-500"
          />
          <div className="text-xs text-volvo-mute mt-3 tracking-wide">
            Press enter when ready.
          </div>
        </div>

        <div
          className={`mt-10 flex flex-wrap justify-center gap-2 max-w-3xl transition-all duration-1000 delay-700 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => {
                setValue(p);
                submit(p);
              }}
              disabled={submitting}
              className="text-xs px-4 py-2 rounded-full border border-volvo-line text-volvo-mute
                         hover:border-volvo-ink hover:text-volvo-ink
                         transition-colors duration-300 max-w-full"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <footer className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-volvo-mute tracking-wide px-4">
        Editorial demo. © Volvo Car Corporation. Not affiliated with Volvo Cars.
      </footer>
    </div>
  );
}
