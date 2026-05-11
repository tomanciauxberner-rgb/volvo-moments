import type {
  MomentProfile, Season, TimeOfDay, Environment, Mood, UseCase,
} from '@/types/corpus';

const SEASONS: Season[] = ['winter', 'spring', 'summer', 'autumn', 'any'];
const TIMES: TimeOfDay[] = ['dawn', 'morning', 'day', 'dusk', 'night', 'any'];
const ENVS: Environment[] = [
  'urban', 'suburban', 'highway', 'forest', 'mountain', 'coastal', 'nordic', 'studio',
];
const MOODS: Mood[] = [
  'calm', 'protective', 'adventurous', 'intimate',
  'ceremonial', 'introspective', 'energetic',
];
const USE_CASES: UseCase[] = [
  'commute', 'family', 'weekend_escape', 'long_trip',
  'urban_daily', 'cargo_hauling', 'solo',
];
const BUDGETS = ['entry', 'mid', 'premium', 'unknown'] as const;

function isString(v: unknown): v is string {
  return typeof v === 'string';
}

function pickEnum<T extends string>(v: unknown, list: readonly T[], fallback: T): T {
  return isString(v) && (list as readonly string[]).includes(v) ? (v as T) : fallback;
}

function pickEnumArray<T extends string>(
  v: unknown, list: readonly T[], min: number, max: number, fallback: T[],
): T[] {
  if (!Array.isArray(v)) return fallback;
  const cleaned = v.filter((x): x is T => isString(x) && (list as readonly string[]).includes(x));
  if (cleaned.length < min) return fallback;
  return cleaned.slice(0, max);
}

function clampInt(v: unknown, min: number, max: number, fallback: number): number {
  const n = typeof v === 'number' && Number.isFinite(v) ? Math.round(v) : fallback;
  return Math.max(min, Math.min(max, n));
}

export function validateProfile(raw: unknown, rawInput: string): MomentProfile {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;

  const passengersRaw = (r.passengers && typeof r.passengers === 'object'
    ? r.passengers : {}) as Record<string, unknown>;

  const valuesRaw = Array.isArray(r.values_implicit) ? r.values_implicit : [];
  const values: string[] = valuesRaw
    .filter(isString)
    .map((s) => s.toLowerCase().replace(/[^a-z_-]/g, '').slice(0, 24))
    .filter((s) => s.length > 0)
    .slice(0, 4);

  const summary = isString(r.emotional_summary)
    ? r.emotional_summary.replace(/\s+/g, ' ').trim().slice(0, 200)
    : 'A moment shaped by quiet intention.';

  return {
    raw_input: rawInput,
    season: pickEnum(r.season, SEASONS, 'any'),
    time_of_day: pickEnum(r.time_of_day, TIMES, 'any'),
    environment: pickEnum(r.environment, ENVS, 'urban'),
    mood: pickEnumArray(r.mood, MOODS, 1, 3, ['calm']),
    use_case: pickEnumArray(r.use_case, USE_CASES, 1, 2, ['solo']),
    passengers: {
      adults: clampInt(passengersRaw.adults, 0, 8, 1),
      children: clampInt(passengersRaw.children, 0, 6, 0),
      pets: passengersRaw.pets === true,
    },
    values_implicit: values,
    budget_signal: pickEnum(r.budget_signal, BUDGETS, 'unknown'),
    emotional_summary: summary,
  };
}
