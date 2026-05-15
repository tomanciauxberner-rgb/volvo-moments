'use client';

import { useEffect, useState } from 'react';
import type { MomentProfile, VisualAsset, CatalogCar, EmotionalFeature, ConfigOption, Tension } from '@/types/corpus';
import type { MatchReason, ReframeResult } from '@/lib/anthropic';
import ReframeReveal from '@/components/ReframeReveal';

interface MatchPayload {
  car: CatalogCar;
  score: number;
  factors: string[];
  hero_asset: VisualAsset | null;
  reason: MatchReason;
  recommended_config: ConfigOption | null;
  resolved_tensions: Tension[];
}

interface Alternative {
  model: string;
  display_name: string;
  score: number;
}

interface PageData {
  profile: MomentProfile;
  match: MatchPayload;
  alternatives: Alternative[];
  reframe: ReframeResult | null;
  feature: EmotionalFeature | null;
}

const STORAGE_KEY = 'volvo_moment_payload';

export default function PreviewPage() {
  const [data, setData] = useState<PageData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        setData(JSON.parse(raw) as PageData);
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-volvo-mute animate-pulse">Loading your moment…</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-volvo-mute">No moment to show.</p>
        <a href="/" className="mt-6 underline underline-offset-4">← back</a>
      </main>
    );
  }

  const { profile, match, alternatives, reframe, feature } = data;
  const heroPath = match.hero_asset?.local_path ?? '/assets/cars/ex30_exterior_01.webp';

  return (
    <main>
      <ReframeReveal
        poeticLine={reframe?.poetic_line ?? match.reason.headline}
        reframe={reframe?.reframe ?? match.reason.reason}
        reason={match.reason.reason}
        feature={feature}
        car={match.car}
        profile={profile}
        alternatives={alternatives}
        heroPath={heroPath}
        recommendedConfig={match.recommended_config}
        resolvedTensions={match.resolved_tensions}
      />
    </main>
  );
}
