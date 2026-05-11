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

export interface MomentProfile {
  raw_input: string;
  season: Season;
  time_of_day: TimeOfDay;
  environment: Environment;
  mood: Mood[];
  use_case: UseCase[];
  passengers: { adults: number; children: number; pets: boolean };
  values_implicit: string[];
  budget_signal: 'entry' | 'mid' | 'premium' | 'unknown';
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
  match_moods: Mood[];
  match_use_cases: UseCase[];
}

export interface PriceBE {
  from: number;
  label: string;
  motorisation: string;
}

export interface CatalogCar {
  model: CarModel;
  type: CarType;
  display_name: string;
  tagline: string;
  price_be: PriceBE;
  emotional_features: EmotionalFeature[];
  affinity: {
    seasons: Season[];
    environments: Environment[];
    moods: Mood[];
    use_cases: UseCase[];
    min_passengers: number;
    max_passengers: number;
    budget_tier: 'entry' | 'mid' | 'premium';
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
