type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;

export function rateLimit(key: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const b = buckets.get(key);

  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfter: 0 };
  }

  if (b.count >= MAX_PER_WINDOW) {
    return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  }

  b.count += 1;
  return { ok: true, retryAfter: 0 };
}
