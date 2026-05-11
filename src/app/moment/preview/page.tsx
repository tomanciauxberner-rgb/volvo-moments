import type { MomentProfile, VisualAsset, CatalogCar, EmotionalFeature } from '@/types/corpus';
import type { MatchReason, ReframeResult } from '@/lib/anthropic';
import ReframeReveal from '@/components/ReframeReveal';

interface MatchPayload {
  car: CatalogCar;
  score: number;
  factors: string[];
  hero_asset: VisualAsset | null;
  reason: MatchReason;
}

interface Alternative {
  model: string;
  display_name: string;
  score: number;
}

interface PageData {
  profile: MomentProfile;
  match: MatchPayload;
  alternatives: Alternative[];
  reframe: ReframeResult | null;
  feature: EmotionalFeature | null;
}

function safeParse(s: string | undefined): PageData | null {
  if (!s) return null;
  try {
    return JSON.parse(decodeURIComponent(s)) as PageData;
  } catch {
    return null;
  }
}

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  const { d } = await searchParams;
  const data = safeParse(d);

  if (!data) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-volvo-mute">No moment to show.</p>
        <a href="/" className="mt-6 underline underline-offset-4">← back</a>
      </main>
    );
  }

  const { profile, match, alternatives, reframe, feature } = data;
  const heroPath = match.hero_asset?.local_path ?? '/assets/cars/ex30_exterior_01.webp';

  return (
    <main className="min-h-screen bg-white">
      <section
        className="relative w-full h-[60vh] md:h-[75vh] bg-cover bg-center"
        style={{ backgroundImage: `url('${heroPath}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 h-full flex flex-col justify-end pb-12 md:pb-16">
          <p className="text-white/75 text-[11px] uppercase tracking-[0.4em]">
            Your moment, your Volvo
          </p>
          <h1 className="mt-4 text-white text-4xl md:text-6xl font-light leading-[1.05]">
            Volvo {match.car.display_name}
          </h1>
          <p className="mt-2 text-white/60 text-sm font-light">
            {match.car.price_be?.label}
            {match.car.price_be?.motorisation && (
              <span className="ml-2 opacity-70">— {match.car.price_be.motorisation}</span>
            )}
          </p>
        </div>
      </section>

      <ReframeReveal
        poeticLine={reframe?.poetic_line ?? match.reason.headline}
        reframe={reframe?.reframe ?? ''}
        reason={match.reason.reason}
        feature={feature}
        car={match.car}
        profile={profile}
        alternatives={alternatives}
      />

      <footer className="text-center text-[10px] text-volvo-mute tracking-wide py-8 px-4">
        Editorial demo. © Volvo Car Corporation. Not affiliated with Volvo Cars.
      </footer>
    </main>
  );
}
