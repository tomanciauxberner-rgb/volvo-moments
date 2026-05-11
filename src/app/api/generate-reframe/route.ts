import { NextResponse } from 'next/server';
import { generateReframe } from '@/lib/anthropic';
import { validateProfile } from '@/lib/validateProfile';
import { rateLimit } from '@/lib/rateLimit';
import { corpus } from '@/lib/corpus';
import type { EmotionalFeature, Mood, UseCase } from '@/types/corpus';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function pickBestFeature(
  carModel: string,
  moods: Mood[],
  useCases: UseCase[],
): EmotionalFeature | null {
  const car = corpus.catalog.find((c) => c.model === carModel);
  if (!car || !car.emotional_features?.length) return null;

  const moodSet = new Set(moods);
  const useSet = new Set(useCases);

  let best: EmotionalFeature | null = null;
  let bestScore = -1;

  for (const feat of car.emotional_features) {
    const moodHits = feat.match_moods.filter((m) => moodSet.has(m)).length;
    const useHits = feat.match_use_cases.filter((u) => useSet.has(u)).length;
    const score = moodHits * 2 + useHits;
    if (score > bestScore) {
      bestScore = score;
      best = feat;
    }
  }

  return best ?? car.emotional_features[0];
}

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'anon';

  const rl = rateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'rate_limited', retry_after: rl.retryAfter },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const rawProfile = (body as { profile?: unknown })?.profile;
  const carModel = (body as { car_model?: unknown })?.car_model;

  if (!rawProfile || typeof rawProfile !== 'object') {
    return NextResponse.json({ error: 'profile_missing' }, { status: 400 });
  }
  if (!carModel || typeof carModel !== 'string') {
    return NextResponse.json({ error: 'car_model_missing' }, { status: 400 });
  }

  const profile = validateProfile(
    rawProfile,
    (rawProfile as { raw_input?: string }).raw_input ?? '',
  );

  const feature = pickBestFeature(carModel, profile.mood, profile.use_case);
  if (!feature) {
    return NextResponse.json({ error: 'no_feature_found' }, { status: 404 });
  }

  try {
    const reframe = await generateReframe(profile, feature);
    return NextResponse.json({ reframe, feature });
  } catch (err) {
    console.error('generate-reframe error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'reframe_failed' }, { status: 502 });
  }
}
