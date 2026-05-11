import type { MomentProfile, VisualAsset, CatalogCar } from '@/types/corpus';

interface MatchPayload {
  car: CatalogCar;
  score: number;
  factors: string[];
  hero_asset: VisualAsset | null;
  reason: { headline: string; reason: string };
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

  const { profile, match, alternatives } = data;
  const heroPath = match.hero_asset?.local_path ?? '/assets/cars/ex30_exterior_01.webp';

  return (
    <main className="min-h-screen bg-white">
      <section
        className="relative w-full h-[60vh] md:h-[75vh] bg-cover bg-center"
        style={{ backgroundImage: `url('${heroPath}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 h-full flex flex-col justify-end pb-12 md:pb-16">
          <p className="text-white/85 text-[11px] uppercase tracking-[0.4em]">
            Your moment, your Volvo
          </p>
          <h1 className="mt-4 text-white text-4xl md:text-6xl font-light leading-[1.05]">
            Volvo {match.car.display_name}
          </h1>
          <p className="mt-3 text-white/90 text-lg md:text-xl font-light italic max-w-2xl">
            {match.reason.headline}
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <p className="text-[11px] uppercase tracking-[0.4em] text-volvo-mute">
          Why this car for you
        </p>
        <p className="mt-6 text-xl md:text-2xl font-light leading-relaxed text-volvo-ink">
          {match.reason.reason}
        </p>

        <div className="mt-12 pt-12 border-t border-volvo-line">
          <p className="text-[11px] uppercase tracking-[0.4em] text-volvo-mute">
            The moment you described
          </p>
          <p className="mt-4 text-lg font-light text-volvo-ink/80">
            “{profile.raw_input}”
          </p>
          <p className="mt-3 text-sm italic text-volvo-mute">
            {profile.emotional_summary}
          </p>
        </div>

        <div className="mt-12 pt-12 border-t border-volvo-line grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6 text-sm">
          <Field label="Season" value={profile.season} />
          <Field label="Time" value={profile.time_of_day} />
          <Field label="Environment" value={profile.environment} />
          <Field label="Mood" value={profile.mood.join(', ')} />
        </div>

        <div className="mt-16 flex flex-wrap gap-3">
          <a
            href={match.car.config_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-volvo-ink text-white rounded-full px-6 py-3 text-[15px] hover:opacity-90 transition-opacity"
          >
            Configure your {match.car.display_name}
          </a>
          <a
            href="/"
            className="border border-volvo-ink rounded-full px-6 py-3 text-[15px] hover:bg-volvo-ink hover:text-white transition-colors"
          >
            Try another moment
          </a>
        </div>

        {alternatives.length > 0 && (
          <div className="mt-16 pt-12 border-t border-volvo-line">
            <p className="text-[11px] uppercase tracking-[0.4em] text-volvo-mute">
              Also considered
            </p>
            <ul className="mt-4 space-y-1 text-sm text-volvo-mute">
              {alternatives.map((a) => (
                <li key={a.model}>
                  Volvo {a.display_name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <footer className="text-center text-[10px] text-volvo-mute tracking-wide py-8 px-4">
        Editorial demo. © Volvo Car Corporation. Not affiliated with Volvo Cars.
      </footer>
    </main>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-volvo-mute">{label}</div>
      <div className="mt-1 text-volvo-ink capitalize">{value}</div>
    </div>
  );
}
