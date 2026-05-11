import type { MomentProfile } from '@/types/corpus';

function safeParse(s: string | undefined): MomentProfile | null {
  if (!s) return null;
  try {
    return JSON.parse(decodeURIComponent(s)) as MomentProfile;
  } catch {
    return null;
  }
}

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p } = await searchParams;
  const profile = safeParse(p);

  if (!profile) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-volvo-mute">No profile.</p>
        <a href="/" className="mt-6 underline underline-offset-4">← back</a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-20 md:py-28">
        <p className="text-[11px] uppercase tracking-[0.4em] text-volvo-mute">Your moment</p>

        <h1 className="mt-6 text-2xl md:text-4xl font-light leading-tight">
          “{profile.raw_input}”
        </h1>

        <p className="mt-10 text-lg md:text-xl font-light italic text-volvo-ink/80 max-w-2xl">
          {profile.emotional_summary}
        </p>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6 text-sm">
          <Field label="Season" value={profile.season} />
          <Field label="Time" value={profile.time_of_day} />
          <Field label="Environment" value={profile.environment} />
          <Field label="Mood" value={profile.mood.join(', ')} />
          <Field label="Use case" value={profile.use_case.join(', ')} />
          <Field
            label="Passengers"
            value={`${profile.passengers.adults} adult${profile.passengers.adults > 1 ? 's' : ''}, ${profile.passengers.children} child${profile.passengers.children !== 1 ? 'ren' : ''}${profile.passengers.pets ? ', pet' : ''}`}
          />
          <Field label="Values" value={profile.values_implicit.join(', ') || '—'} />
          <Field label="Budget signal" value={profile.budget_signal} />
        </div>

        <div className="mt-20 text-sm text-volvo-mute">
          <p>Session 3 will match this profile to a Volvo from the catalog.</p>
          <a href="/" className="mt-4 inline-block underline underline-offset-4 hover:text-volvo-ink">
            ← back
          </a>
        </div>
      </div>

      <footer className="text-center text-[10px] text-volvo-mute tracking-wide py-8">
        Editorial demo. © Volvo Car Corporation. Not affiliated with Volvo Cars.
      </footer>
    </main>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-volvo-mute">{label}</div>
      <div className="mt-1 text-volvo-ink">{value}</div>
    </div>
  );
}
