'use client';

import { useEffect, useState } from 'react';
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
  heroPath: string;
}

type Phase = 'intro' | 'result';

export default function ReframeReveal({
  poeticLine,
  reframe,
  reason,
  feature,
  car,
  profile,
  alternatives,
  heroPath,
}: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [poeticVisible, setPoeticVisible] = useState(false);
  const [waitVisible, setWaitVisible] = useState(false);
  const [reframeVisible, setReframeVisible] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [resultVisible, setResultVisible] = useState(false);

  useEffect(() => {
    // t=50ms   : phrase 1 entre en fondu
    const t0 = setTimeout(() => setPoeticVisible(true), 50);
    // t=5000ms : phrase 1 sort en fondu
    const t1 = setTimeout(() => setPoeticVisible(false), 5000);
    // t=5800ms : "wait…" entre en fondu (après que phrase 1 soit invisible)
    const t2 = setTimeout(() => setWaitVisible(true), 5800);
    // t=7800ms : phrase 2 entre en fondu avec slide
    const t3 = setTimeout(() => setReframeVisible(true), 7800);
    // t=13500ms: tout l'écran intro sort en fondu
    const t4 = setTimeout(() => setIntroVisible(false), 13500);
    // t=14300ms: résultat entre en fondu
    const t5 = setTimeout(() => {
      setPhase('result');
      setResultVisible(true);
    }, 14300);

    return () => {
      [t0, t1, t2, t3, t4, t5].forEach(clearTimeout);
    };
  }, []);

  if (phase === 'intro') {
    return (
      <div
        className={`fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-8 text-center transition-opacity duration-700 ${
          introVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p
          className={`text-2xl md:text-4xl font-light italic text-volvo-ink max-w-2xl leading-relaxed transition-opacity duration-1000 absolute ${
            poeticVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {poeticLine}
        </p>

        <div className="flex flex-col items-center gap-8">
          <p
            className={`text-[11px] uppercase tracking-[0.5em] text-volvo-mute transition-opacity duration-1000 ${
              waitVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            wait…
          </p>
          <p
            className={`text-2xl md:text-4xl font-light text-volvo-ink max-w-2xl leading-relaxed transition-all duration-1000 ${
              reframeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {reframe}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`transition-opacity duration-700 ${resultVisible ? 'opacity-100' : 'opacity-0'}`}>
      <section
        className="relative w-full h-[60vh] md:h-[75vh] bg-cover bg-center"
        style={{ backgroundImage: `url('${heroPath}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 h-full flex flex-col justify-end pb-12 md:pb-16">
          <p className="text-white/75 text-[11px] uppercase tracking-[0.4em]">
            Your moment, your Volvo
          </p>
          <h1 className="mt-4 text-white text-4xl md:text-6xl font-light leading-[1.05]">
            Volvo {car.display_name}
          </h1>
          <p className="mt-2 text-white/70 text-sm font-light">
            {car.price_be?.label}
            {car.price_be?.motorisation && (
              <span className="ml-2 opacity-70">— {car.price_be.motorisation}</span>
            )}
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="animate-fadeIn">
          <p className="text-[11px] uppercase tracking-[0.4em] text-volvo-mute">
            Why the {car.display_name} for this moment
          </p>
          <p className="mt-6 text-xl md:text-2xl font-light leading-relaxed text-volvo-ink">
            {reason}
          </p>
        </div>

        {feature && (
          <div className="mt-14 pt-12 border-t border-volvo-line animate-fadeIn">
            <p className="text-[11px] uppercase tracking-[0.4em] text-volvo-mute">
              What this means for you
            </p>
            <p className="mt-4 text-base font-medium text-volvo-ink leading-snug">
              {feature.headline}
            </p>
            <p className="mt-3 text-[15px] font-light text-volvo-ink/75 leading-relaxed max-w-xl">
              {feature.body}
            </p>
          </div>
        )}

        <div className="mt-14 pt-12 border-t border-volvo-line animate-fadeIn">
          <p className="text-[11px] uppercase tracking-[0.4em] text-volvo-mute">
            The moment you described
          </p>
          <p className="mt-4 text-lg font-light text-volvo-ink/80 italic">
            "{profile.raw_input}"
          </p>
          <p className="mt-2 text-sm text-volvo-mute">
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
      </section>

      <footer className="text-center text-[10px] text-volvo-mute tracking-wide py-8 px-4">
        Editorial demo. © Volvo Car Corporation. Not affiliated with Volvo Cars.
      </footer>
    </div>
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
