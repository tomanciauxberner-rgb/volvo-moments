export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ text?: string }>;
}) {
  const { text } = await searchParams;
  const moment = text ? decodeURIComponent(text) : '';

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] uppercase tracking-[0.4em] text-volvo-mute">
        Coming in session 2
      </p>
      <h1 className="mt-6 text-2xl md:text-4xl font-light max-w-2xl leading-tight">
        “{moment || 'no moment provided'}”
      </h1>
      <p className="mt-8 text-sm text-volvo-mute max-w-md">
        Next session wires this text to Claude API for intent extraction,
        then to the orchestration engine.
      </p>
      <a
        href="/"
        className="mt-10 text-sm underline underline-offset-4 text-volvo-mute hover:text-volvo-ink"
      >
        ← back
      </a>
    </main>
  );
}
