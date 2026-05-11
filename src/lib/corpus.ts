import corpusData from '../../data/corpus.json';
import type { Corpus, VisualAsset, CatalogCar } from '@/types/corpus';

export const corpus: Corpus = corpusData as Corpus;

export function getVisualById(id: string): VisualAsset | undefined {
  return corpus.visuals.find((v) => v.id === id);
}

export function getCarByModel(model: string): CatalogCar | undefined {
  return corpus.catalog.find((c) => c.model === model);
}

export function getHeroAssetForCar(car: CatalogCar): VisualAsset | undefined {
  return getVisualById(car.hero_asset_id);
}
