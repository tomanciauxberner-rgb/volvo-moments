import type { MomentProfile, CatalogCar, ConfigOption, Tension } from '@/types/corpus';
import { corpus } from './corpus';

export interface CarMatch {
  car: CatalogCar;
  score: number;
  factors: string[];
  recommended_config: ConfigOption | null;
  resolved_tensions: Tension[];
}

function countIntersect<T>(a: readonly T[], b: readonly T[]): number {
  const set = new Set(b);
  let n = 0;
  for (const x of a) if (set.has(x)) n++;
  return n;
}

function pickRecommendedConfig(
  profile: MomentProfile,
  car: CatalogCar,
): ConfigOption | null {
  if (!car.config_options?.length) return null;

  let best: ConfigOption | null = null;
  let bestScore = -Infinity;

  for (const opt of car.config_options) {
    const moodHits = countIntersect(profile.mood, opt.match_moods);
    const useHits = countIntersect(profile.use_case, opt.match_use_cases);
    const valueHits = countIntersect(profile.values_implicit, opt.match_values);
    const score = moodHits * 3 + useHits * 2 + valueHits;
    if (score > bestScore) {
      bestScore = score;
      best = opt;
    }
  }

  return best;
}

function detectResolvedTensions(
  profile: MomentProfile,
  car: CatalogCar,
): Tension[] {
  if (!car.tensions?.length) return [];

  const triggers = new Set<string>();

  const hasElectricAnxiety =
    profile.values_implicit.includes('sustainability') &&
    (profile.use_case.includes('long_trip') || profile.use_case.includes('weekend_escape'));
  if (hasElectricAnxiety) triggers.add('electric_vs_range_anxiety');

  const hasBudgetTension =
    profile.budget_signal !== 'unknown' &&
    profile.budget_signal !== car.affinity.budget_tier;
  if (hasBudgetTension) triggers.add('budget_vs_desire');

  const hasFamilyVsSolo =
    profile.use_case.includes('family') && profile.use_case.includes('solo');
  if (hasFamilyVsSolo) triggers.add('family_vs_solo_identity');

  const hasSpaceTension =
    profile.environment === 'urban' &&
    (profile.use_case.includes('cargo_hauling') || profile.passengers.children > 1);
  if (hasSpaceTension) triggers.add('space_vs_agility');

  const hasAdventureTension =
    profile.mood.includes('adventurous') && profile.mood.includes('calm');
  if (hasAdventureTension) triggers.add('adventure_vs_comfort');

  const hasPremiumTension =
    car.affinity.budget_tier === 'premium' && profile.budget_signal !== 'premium';
  if (hasPremiumTension) triggers.add('premium_vs_practicality');

  return car.tensions.filter((t) => triggers.has(t.type));
}

function scoreCar(profile: MomentProfile, car: CatalogCar): CarMatch {
  const factors: string[] = [];
  let score = 0;

  const moodHits = countIntersect(profile.mood, car.affinity.moods);
  if (moodHits > 0) {
    score += moodHits * 3;
    factors.push(`mood +${moodHits * 3}`);
  }

  const useHits = countIntersect(profile.use_case, car.affinity.use_cases);
  if (useHits > 0) {
    score += useHits * 2;
    factors.push(`use_case +${useHits * 2}`);
  }

  if (car.affinity.environments.includes(profile.environment)) {
    score += 2;
    factors.push('environment +2');
  }

  if (
    car.affinity.seasons.includes(profile.season) ||
    car.affinity.seasons.includes('any')
  ) {
    score += 1;
    factors.push('season +1');
  }

  if (
    profile.budget_signal !== 'unknown' &&
    profile.budget_signal === car.affinity.budget_tier
  ) {
    score += 5;
    factors.push('budget +5');
  }

  const totalPassengers = profile.passengers.adults + profile.passengers.children;
  if (totalPassengers > car.affinity.max_passengers) {
    score -= 3;
    factors.push('passengers_over -3');
  }
  if (
    totalPassengers >= car.affinity.min_passengers &&
    totalPassengers <= car.affinity.max_passengers
  ) {
    score += 1;
    factors.push('passengers_fit +1');
  }

  const safetyDriven = profile.values_implicit.includes('safety');
  if (safetyDriven && car.type === 'flagship_suv') {
    score += 2;
    factors.push('safety_flagship +2');
  }

  const sustainabilityDriven = profile.values_implicit.includes('sustainability');
  if (sustainabilityDriven && (car.type === 'city_ev' || car.type === 'flagship_suv')) {
    score += 2;
    factors.push('sustainability_electric +2');
  }

  return {
    car,
    score,
    factors,
    recommended_config: pickRecommendedConfig(profile, car),
    resolved_tensions: detectResolvedTensions(profile, car),
  };
}

export function matchCar(profile: MomentProfile): {
  winner: CarMatch;
  runners_up: CarMatch[];
} {
  const ranked = corpus.catalog
    .map((car) => scoreCar(profile, car))
    .sort((a, b) => b.score - a.score);

  return {
    winner: ranked[0],
    runners_up: ranked.slice(1, 3),
  };
}
