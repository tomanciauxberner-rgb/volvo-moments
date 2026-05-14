export type Season = 'winter' | 'spring' | 'summer' | 'autumn' | 'any';
export type TimeOfDay = 'dawn' | 'morning' | 'day' | 'dusk' | 'night' | 'any';
export type Environment =
  | 'urban' | 'suburban' | 'highway' | 'forest'
  | 'mountain' | 'coastal' | 'nordic' | 'studio';
export type Mood =
  | 'calm' | 'protective' | 'adventurous' | 'intimate'
  | 'ceremonial' | 'introspective' | 'energetic';
export type UseCase =
  | 'commute' | 'family' | 'weekend_escape' | 'long_trip'
  | 'urban_daily' | 'cargo_hauling' | 'solo';
export type CarModel = 'EX30' | 'EX40' | 'EX90' | 'XC60' | 'XC90' | 'V60';
export type CarType = 'city_ev' | 'compact_suv' | 'flagship_suv' | 'wagon' | 'hybrid_suv';
export type BudgetTier = 'entry' | 'mid' | 'premium';

export type TensionType =
  | 'budget_vs_desire'
  | 'space_vs_agility'
  | 'electric_vs_range_anxiety'
  | 'family_vs_solo_identity'
  | 'premium_vs_practicality'
  | 'adventure_vs_comfort';

export interface MomentProfile {
  raw_input: string;
  season: Season;
  time_of_day: TimeOfDay;
  environment: Environment;
  mood: Mood[];
  use_case: UseCase[];
  passengers: { adults: number; children: number; pets: boolean };
  values_implicit: string[];
  budget_signal: BudgetTier | 'unknown';
  emotional_summary: string;
}

export interface VisualAsset {
  id: string;
  type: 'photo' | 'video';
  local_path: string;
  source_url: string;
  car_model: CarModel | null;
  shot: 'exterior' | 'interior' | 'detail' | 'lifestyle' | 'landscape';
  tags: {
    seasons: Season[];
    times: TimeOfDay[];
    environments: Environment[];
    moods: Mood[];
    use_cases: UseCase[];
    has_people: boolean;
    dominant_palette: 'warm' | 'cool' | 'neutral' | 'monochrome';
  };
  duration_sec: number | null;
}

export interface EmotionalFeature {
  id: string;
  headline: string;
  body: string;
  emotional_trigger: string;
  match_moods: Mood[];
  match_use_cases: UseCase[];
  match_values?: string[];
}

export interface PriceBE {
  from: number;
  label: string;
  motorisation: string;
}

/**
 * A specific trim / option package that can be recommended.
 * config_url points to volvocars.com with options pre-selected where possible.
 */
export interface ConfigOption {
  id: string;
  label: string;
  description: string;
  price_delta_label: string;
  match_moods: Mood[];
  match_use_cases: UseCase[];
  match_values: string[];
  config_url: string;
}

/**
 * The precise configuration we surface to the user after matching.
 * e.g. "EX40 Extended Range in Fjord Blue with Pilot Assist and Harman Kardon"
 */
export interface RecommendedConfig {
  option_id: string;
  label: string;
  why: string;
  config_url: string;
}

/**
 * A tension is a detected conflict inside the user's profile
 * that we surface and resolve explicitly rather than ignore.
 */
export interface Tension {
  type: TensionType;
  label: string;
  resolution: string;
}

/**
 * An alternative model presented with an emotional reason — not just a name.
 */
export interface AlternativeMatch {
  model: CarModel;
  display_name: string;
  score: number;
  emotional_bridge: string;
  why_not_winner: string;
}

export interface CatalogCar {
  model: CarModel;
  type: CarType;
  display_name: string;
  tagline: string;
  price_be: PriceBE;
  emotional_features: EmotionalFeature[];
  config_options: ConfigOption[];
  tensions: Tension[];
  affinity: {
    seasons: Season[];
    environments: Environment[];
    moods: Mood[];
    use_cases: UseCase[];
    min_passengers: number;
    max_passengers: number;
    budget_tier: BudgetTier;
  };
  hero_asset_id: string;
  detail_asset_ids: string[];
  config_url: string;
}

export interface ArchiveEntry {
  id: string;
  year: number;
  title: string;
  one_liner: string;
  story: string;
  affinity: { moods: Mood[]; values: string[] };
  illustration_hint: string;
}

export interface Corpus {
  version: string;
  generated_at: string;
  visuals: VisualAsset[];
  catalog: CatalogCar[];
  archive: ArchiveEntry[];
}
