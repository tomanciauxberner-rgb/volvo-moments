'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    __volvoAudio?: HTMLAudioElement;
  }
}

const PRESETS = [
  'Early winter mornings driving my daughter to school in Brussels.',
  'Weekend escapes to the Ardennes with two kids and the dog.',
  'Quiet drives home through the city after long workdays.',
  'Long summer trips up the coast to Sweden.',
];

const STEPS = [
  'Listening…',
  'Sensing the moment…',
  'Finding your Volvo…',
  'One last thought…',
];

interface Props {
  onClose: () => void;
}

function unlockAudio() {
  if (typeof window === 'undefined') return;
  const audio = new Audio('/sounds/moment.mp3');
  audio.preload = 'auto';
  audio.volume = 0;
  const p = audio.play();
  if (p !== undefined) {
    p.then(() => {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 1;
    }).catch(() => {});
  }
  audio.volume = 1;
  window.__volvoAudio = audio;
}

export default function MomentOverlay({ onClose }: Props) {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
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
      unlockAudio();
      setSubmitting(true);
      setError(null);
      setStepIndex(0);

      try {
        const intentRes = await fetch('/api/extract-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: clean }),
        });
        if (!intentRes.ok) {
          const b = await intentRes.json().catch(() => ({}));
          throw new Error((b as { error?: string }).error || 'intent_failed');
        }
        const { profile } = await intentRes.json();
        setStepIndex(1);

        const matchRes = await fetch('/api/match-car', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile }),
        });
        if (!matchRes.ok) {
          const b = await matchRes.json().catch(() => ({}));
          throw new Error((b as { error?: string }).error || 'match_failed');
        }
        const matchData = await matchRes.json();
        setStepIndex(2);

        const reframeRes = await fetch('/api/generate-reframe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profile,
            car_model: matchData.match.car.model,
          }),
        });
        setStepIndex(3);

        let reframeData = null;
        if (reframeRes.ok) {
          reframeData = await reframeRes.json();
        }

        const payload = encodeURIComponent(
          JSON.stringify({
            profile,
            match: matchData.match,
            alternatives: matchData.alternatives,
            reframe: reframeData?.reframe ?? null,
            feature: reframeData?.feature ?? null,
          }),
        );
        router.push(`/moment/preview?d=${payload}`);
      } catch (e) {
        setSubmitting(false);
        setStepIndex(0);
        setError(e instanceof Error ? e.message : 'unknown');
      }
    },
    [submitting],
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
                       transition-colors duration-500 disabled:opacity-40"
          />

          <div className="text-xs text-volvo-mute mt-3 tracking-wide h-4">
            {submitting ? (
              <span className="animate-pulse">{STEPS[stepIndex]}</span>
            ) : error ? (
              `Error: ${error}`
            ) : (
              'Press enter when ready.'
            )}
          </div>

          {submitting && (
            <div className="mt-6 flex justify-center gap-1.5">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`block h-px transition-all duration-700 ${
                    i <= stepIndex ? 'w-8 bg-volvo-ink' : 'w-4 bg-volvo-line'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div
          className={`mt-10 w-full max-w-2xl transition-all duration-1000 delay-700 ${
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
              className="block w-full text-left text-sm px-4 py-3 border-b border-volvo-line
                         text-volvo-mute hover:text-volvo-ink hover:border-volvo-ink
                         transition-colors duration-300 disabled:opacity-40"
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
