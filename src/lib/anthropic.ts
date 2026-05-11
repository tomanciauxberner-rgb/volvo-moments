import type { MomentProfile } from '@/types/corpus';

const SYSTEM_PROMPT = `You are an editorial assistant for a premium Scandinavian car brand.
Given a short phrase describing a moment of life, you extract a structured emotional and contextual profile in JSON.

You MUST return ONLY a JSON object, no prose, no markdown, no backticks. The JSON object must follow this exact schema:

{
  "raw_input": string,
  "season": "winter" | "spring" | "summer" | "autumn" | "any",
  "time_of_day": "dawn" | "morning" | "day" | "dusk" | "night" | "any",
  "environment": "urban" | "suburban" | "highway" | "forest" | "mountain" | "coastal" | "nordic" | "studio",
  "mood": array of 1-3 from ["calm","protective","adventurous","intimate","ceremonial","introspective","energetic"],
  "use_case": array of 1-2 from ["commute","family","weekend_escape","long_trip","urban_daily","cargo_hauling","solo"],
  "passengers": { "adults": number, "children": number, "pets": boolean },
  "values_implicit": array of 1-4 short lowercase tokens (e.g. "safety","sustainability","discretion","craft","time"),
  "budget_signal": "entry" | "mid" | "premium" | "unknown",
  "emotional_summary": one short English sentence in premium editorial tone, max 18 words
}

Rules:
- Infer season and time_of_day from context (e.g. "winter mornings" → winter + morning).
- If unspecified, use "any".
- Stay concise. No moralizing. No exclamation marks.
- emotional_summary must sound like Volvo brand voice: calm, restrained, human-first.`;

interface AnthropicResponse {
  content: Array<{ type: string; text?: string }>;
  stop_reason?: string;
}

export async function extractIntent(input: string): Promise<MomentProfile> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY missing');
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: input }],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Anthropic API ${res.status}: ${errBody.slice(0, 200)}`);
  }

  const data = (await res.json()) as AnthropicResponse;
  const text = data.content.find((b) => b.type === 'text')?.text ?? '';
  const clean = text.trim().replace(/^```(?:json)?/, '').replace(/```$/, '').trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(clean);
  } catch {
    throw new Error('Anthropic returned non-JSON');
  }

  return parsed as MomentProfile;
}
