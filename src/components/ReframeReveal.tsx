'use client';

import { useEffect, useRef, useState } from 'react';
import type { MomentProfile, CatalogCar, EmotionalFeature } from '@/types/corpus';

interface Alternative {
  model: string;
  display_name: string;
  score: number;
}

interface Props {
  poeticLine: string;
  reframe: string;
  reason: string;
  feature: EmotionalFeature | null;
  car: CatalogCar;
  profile: MomentProfile;
  alternatives: Alternative[];
}

export default function ReframeReveal({
  poeticLine,
  reframe,
  reason,
  feature,
  car,
  profile,
  alternatives,
}: Props) {
  const [phase, setPhase] = useState<'poetic' | 'wait' | 'reframe' | 'full'>('poetic');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setPhase('wait'), 1800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  useEffect(() => {
    if (phase !== 'wait') return;
    timerRef.current = setTimeout(() => setPhase('reframe'), 900);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'reframe') return;
    timerRef.current = setTimeout(() => setPhase('full'), 2800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase]);

  return (
    <section className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24">

      <div className="min-h-[120px]">
        <p
          className={`text-xl md:text-2xl font-light leading-relaxed text-volvo-ink italic transition-all duration-1000 ${
            phase === 'poetic' ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'
          }`}
        >
          {poeticLine}
        </p>

        {(phase === 'wait' || phase === 'reframe' || phase === 'full') && reframe && (
          <div className="mt-8">
            <p
              className={`text-[11px] uppercase tracking-[0.4em] text-volvo-mute transition-all duration-700 ${
                phase === 'wait' ? 'opacity-0' : 'opacity-100'
              }`}
            >
              wait…
            </p>

            <p
              className={`mt-4 text-xl md:text-2xl font-light leading-relaxed text-volvo-ink transition-all duration-1000 delay-300 ${
                phase === 'reframe' || phase === 'full'
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-3'
              }`}
            >
              {reframe}
            </p>
          </div>
        )}
      </div>

      {(phase === 'full') && (
        <>
          <div
            className="mt-16 pt-12 border-t border-volvo-line transition-all duration-1000 animate-fadeIn"
          >
            <p className="text-[11px] uppercase tracking-[0.4em] text-volvo-mute">
              Why the {car.display_name} for this moment
            </p>
            <p className="mt-6 text-lg md:text-xl font-light leading-relaxed text-volvo-ink/90">
              {reason}
            </p>
          </div>

          {feature && (
            <div className="mt-12 pt-12 border-t border-volvo-line animate-fadeIn">
              <p className="text-[11px] uppercase tracking-[0.4em] text-volvo-mute">
                Ce que cela change concrètement
              </p>
              <p className="mt-4 text-base font-medium text-volvo-ink leading-snug">
                {feature.headline}
              </p>
              <p className="mt-3 text-[15px] font-light text-volvo-ink/75 leading-relaxed max-w-xl">
                {feature.body}
              </p>
            </div>
          )}

          <div className="mt-12 pt-12 border-t border-volvo-line animate-fadeIn">
            <p className="text-[11px] uppercase tracking-[0.4em] text-volvo-mute">
              The moment you described
            </p>
            <p className="mt-4 text-lg font-light text-volvo-ink/80">
              "{profile.raw_input}"
            </p>
            <p className="mt-2 text-sm italic text-volvo-mute">
              {profile.emotional_summary}
            </p>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 text-sm">
              <MetaField label="Season" value={profile.season} />
              <MetaField label="Time" value={profile.time_of_day} />
              <MetaField label="Environment" value={profile.environment} />
              <MetaField label="Mood" value={profile.mood.join(', ')} />
            </div>
          </div>

          <div className="mt-14 flex flex-wrap gap-3 animate-fadeIn">
            <a
              href={car.config_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-volvo-ink text-white rounded-full px-7 py-3.5 text-[15px] hover:opacity-90 transition-opacity"
            >
              Configure your {car.display_name}
            </a>
            <a
              href="/"
              className="border border-volvo-ink rounded-full px-7 py-3.5 text-[15px] hover:bg-volvo-ink hover:text-white transition-colors"
            >
              Try another moment
            </a>
          </div>

          {alternatives.length > 0 && (
            <div className="mt-14 pt-12 border-t border-volvo-line animate-fadeIn">
              <p className="text-[11px] uppercase tracking-[0.4em] text-volvo-mute">
                Also considered
              </p>
              <ul className="mt-4 space-y-1 text-sm text-volvo-mute">
                {alternatives.map((a) => (
                  <li key={a.model}>Volvo {a.display_name}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-volvo-mute">{label}</div>
      <div className="mt-1 text-volvo-ink capitalize">{value}</div>
    </div>
  );
}
