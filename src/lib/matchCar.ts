import type { MomentProfile, CatalogCar } from '@/types/corpus';
import { corpus } from './corpus';

export interface CarMatch {
  car: CatalogCar;
  score: number;
  factors: string[];
}

function countIntersect<T>(a: readonly T[], b: readonly T[]): number {
  const set = new Set(b);
  let n = 0;
  for (const x of a) if (set.has(x)) n++;
  return n;
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

  const totalPassengers =
    profile.passengers.adults + profile.passengers.children;
  if (totalPassengers > car.affinity.max_passengers) {
    score -= 3;
    factors.push('passengers_over -3');
  }
  if (totalPassengers >= car.affinity.min_passengers && totalPassengers <= car.affinity.max_passengers) {
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

  return { car, score, factors };
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
