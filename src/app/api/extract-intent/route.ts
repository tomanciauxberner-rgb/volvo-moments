import { NextResponse } from 'next/server';
import { extractIntent } from '@/lib/anthropic';
import { validateProfile } from '@/lib/validateProfile';
import { rateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_LEN = 280;

function sanitize(s: unknown): string {
  if (typeof s !== 'string') return '';
  return s.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, MAX_LEN);
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

  const text = sanitize((body as { text?: unknown })?.text);
  if (text.length < 5) {
    return NextResponse.json({ error: 'text_too_short' }, { status: 400 });
  }

  try {
    const raw = await extractIntent(text);
    const profile = validateProfile(raw, text);
    return NextResponse.json({ profile });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    console.error('extract-intent error:', msg);
    return NextResponse.json({ error: 'extraction_failed' }, { status: 502 });
  }
}
