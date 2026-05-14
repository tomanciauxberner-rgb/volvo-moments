import { NextResponse } from 'next/server';
import { matchCar } from '@/lib/matchCar';
import { generateMatchReason } from '@/lib/anthropic';
import { getHeroAssetForCar } from '@/lib/corpus';
import { rateLimit } from '@/lib/rateLimit';
import { validateProfile } from '@/lib/validateProfile';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
  if (!rawProfile || typeof rawProfile !== 'object') {
    return NextResponse.json({ error: 'profile_missing' }, { status: 400 });
  }

  const profile = validateProfile(
    rawProfile,
    (rawProfile as { raw_input?: string }).raw_input ?? '',
  );

  const { winner, runners_up } = matchCar(profile);
  const heroAsset = getHeroAssetForCar(winner.car);

  let reason;
  try {
    reason = await generateMatchReason(profile, winner.car);
  } catch (err) {
    console.error('match reason failed:', err instanceof Error ? err.message : err);
    reason = { headline: winner.car.tagline, reason: winner.car.tagline };
  }

  return NextResponse.json({
    match: {
      car: winner.car,
      score: winner.score,
      factors: winner.factors,
      hero_asset: heroAsset ?? null,
      reason,
      recommended_config: winner.recommended_config ?? null,
      resolved_tensions: winner.resolved_tensions ?? [],
    },
    alternatives: runners_up.map((r) => ({
      model: r.car.model,
      display_name: r.car.display_name,
      score: r.score,
    })),
  });
}
