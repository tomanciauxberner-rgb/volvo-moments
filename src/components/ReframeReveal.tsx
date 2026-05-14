'use client';

import { useEffect, useState } from 'react';
import type { MomentProfile, CatalogCar, EmotionalFeature, ConfigOption, Tension } from '@/types/corpus';

declare global {
  interface Window {
    __volvoAudio?: HTMLAudioElement;
  }
}

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
  recommendedConfig: ConfigOption | null;
  resolvedTensions: Tension[];
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
  recommendedConfig,
  resolvedTensions,
}: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [poeticVisible, setPoeticVisible] = useState(false);
  const [waitVisible, setWaitVisible] = useState(false);
  const [reframeVisible, setReframeVisible] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [resultVisible, setResultVisible] = useState(false);

  useEffect(() => {
    const t0 = setTimeout(() => setPoeticVisible(true), 50);
    const t1 = setTimeout(() => setPoeticVisible(false), 7000);
    const t2 = setTimeout(() => {
      setWaitVisible(true);
      if (window.__volvoAudio) {
        window.__volvoAudio.currentTime = 0;
        window.__volvoAudio.play().catch(() => {});
      }
    }, 7500);
    const t3 = setTimeout(() => setReframeVisible(true), 8500);
    const t4 = setTimeout(() => setIntroVisible(false), 17500);
    const t5 = setTimeout(() => {
      setPhase('result');
      setResultVisible(true);
    }, 18200);

    return () => {
      [t0, t1, t2, t3, t4, t5].forEach(clearTimeout);
      if (window.__volvoAudio) {
        window.__volvoAudio.pause();
      }
    };
  }, []);

  const otherFeatures = car.emotional_features
    ? car.emotional_features
        .filter((f) => f.id !== feature?.id)
        .filter((f) => {
          const moodMatch = f.match_moods.some((m) => profile.mood.includes(m));
          const useMatch = f.match_use_cases.some((u) => profile.use_case.includes(u));
          return moodMatch || useMatch;
        })
        .slice(0, 3)
    : [];

  if (phase === 'intro') {
    return (
      <div
        className={`fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-6 text-center transition-opacity duration-700 ${
          introVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p
          className={`text-2xl md:text-4xl font-light italic text-volvo-ink max-w-2xl leading-relaxed transition-opacity duration-1000 absolute px-6 ${
            poeticVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {poeticLine}
        </p>

        <div className="flex flex-col items-center gap-6 md:gap-8">
          <p
            className={`text-[11px] uppercase tracking-[0.5em] text-volvo-mute transition-opacity duration-1000 ${
              waitVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            wait…
          </p>
          <p
            className={`text-xl md:text-4xl font-light text-volvo-ink max-w-xl md:max-w-2xl leading-relaxed transition-all duration-1000 ${
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
        className="relative w-full h-[50vh] md:h-[75vh] bg-cover bg-center"
        style={{ backgroundImage: `url('${heroPath}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 h-full flex flex-col justify-end pb-8 md:pb-16">
          <p className="text-white/75 text-[10px] md:text-[11px] uppercase tracking-[0.4em]">
            Your moment, your Volvo
          </p>
          <h1 className="mt-3 text-white text-3xl md:text-6xl font-light leading-[1.05]">
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

      <section className="max-w-3xl mx-auto px-6 md:px-12 py-12 md:py-24">

        <div className="animate-fadeIn">
          <p className="text-[11px] uppercase tracking-[0.4em] text-volvo-mute">
            Why the {car.display_name} for this moment
          </p>
          <p className="mt-6 text-lg md:text-2xl font-light leading-relaxed text-volvo-ink">
            {reason}
          </p>
        </div>

        {feature && (
          <div className="mt-12 pt-10 border-t border-volvo-line animate-fadeIn">
            <p className="text-[11px] uppercase tracking-[0.4em] text-volvo-mute">
              What this means for you
            </p>
            <p className="mt-4 text-base font-medium text-volvo-ink leading-snug">
              {feature.headline}
            </p>
            <p className="mt-3 text-[15px] font-light text-volvo-ink/75 leading-relaxed">
              {feature.body}
            </p>
            {feature.emotional_trigger && (
              <p className="mt-4 text-[13px] font-light text-volvo-mute italic leading-relaxed border-l-2 border-volvo-line pl-4">
                {feature.emotional_trigger}
              </p>
            )}
          </div>
        )}

        {otherFeatures.length > 0 && (
          <div className="mt-12 pt-10 border-t border-volvo-line animate-fadeIn">
            <p className="text-[11px] uppercase tracking-[0.4em] text-volvo-mute">
              What else the {car.display_name} brings to this moment
            </p>
            <div className="mt-6 space-y-8">
              {otherFeatures.map((f) => (
                <div key={f.id}>
                  <p className="text-base font-medium text-volvo-ink leading-snug">
                    {f.headline}
                  </p>
                  <p className="mt-2 text-[15px] font-light text-volvo-ink/75 leading-relaxed">
                    {f.body}
                  </p>
                  {f.emotional_trigger && (
                    <p className="mt-3 text-[13px] font-light text-volvo-mute italic leading-relaxed border-l-2 border-volvo-line pl-4">
                      {f.emotional_trigger}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendedConfig && (
          <div className="mt-12 pt-10 border-t border-volvo-line animate-fadeIn">
            <p className="text-[11px] uppercase tracking-[0.4em] text-volvo-mute">
              The configuration for your moment
            </p>
            <p className="mt-4 text-base font-medium text-volvo-ink leading-snug">
              {recommendedConfig.label}
            </p>
            <p className="mt-2 text-[15px] font-light text-volvo-ink/75 leading-relaxed">
              {recommendedConfig.description}
            </p>
            <p className="mt-3 text-sm text-volvo-mute">
              {recommendedConfig.price_delta_label}
            </p>
            <a
              href={recommendedConfig.config_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block bg-volvo-ink text-white rounded-full px-7 py-3.5 text-[15px] hover:opacity-90 transition-opacity"
            >
              Configure this {car.display_name}
            </a>
          </div>
        )}

        {resolvedTensions.length > 0 && (
          <div className="mt-12 pt-10 border-t border-volvo-line animate-fadeIn">
            <p className="text-[11px] uppercase tracking-[0.4em] text-volvo-mute">
              What you might be wondering
            </p>
            <div className="mt-6 space-y-6">
              {resolvedTensions.map((t) => (
                <div key={t.type}>
                  <p className="text-[13px] font-medium text-volvo-ink/60 italic">
                    {t.label}
                  </p>
                  <p className="mt-2 text-[15px] font-light text-volvo-ink/80 leading-relaxed">
                    {t.resolution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 pt-10 border-t border-volvo-line animate-fadeIn">
          <p className="text-[11px] uppercase tracking-[0.4em] text-volvo-mute">
            The moment you described
          </p>
          <p className="mt-4 text-base md:text-lg font-light text-volvo-ink/80 italic">
            "{profile.raw_input}"
          </p>
          <p className="mt-2 text-sm text-volvo-mute">
            {profile.emotional_summary}
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 text-sm">
            <MetaField label="Season" value={profile.season} />
            <MetaField label="Time" value={profile.time_of_day} />
            <MetaField label="Environment" value={profile.environment} />
            <MetaField label="Mood" value={profile.mood.join(', ')} />
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 animate-fadeIn">
          {!recommendedConfig && (
            <a
              href={car.config_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-volvo-ink text-white rounded-full px-7 py-3.5 text-[15px] text-center hover:opacity-90 transition-opacity"
            >
              Configure your {car.display_name}
            </a>
          )}
          <a
            href="/"
            className="border border-volvo-ink rounded-full px-7 py-3.5 text-[15px] text-center hover:bg-volvo-ink hover:text-white transition-colors"
          >
            Try another moment
          </a>
        </div>

        {alternatives.length > 0 && (
          <div className="mt-12 pt-10 border-t border-volvo-line animate-fadeIn">
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
