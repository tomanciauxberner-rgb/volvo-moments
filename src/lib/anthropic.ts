import type { MomentProfile, CatalogCar, EmotionalFeature } from '@/types/corpus';

const INTENT_SYSTEM = `You are an editorial assistant for a premium Scandinavian car brand.
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

const MATCH_SYSTEM = `You are an editorial copywriter for a premium Scandinavian car brand.
Given a customer's emotional profile and a recommended Volvo model, write a SHORT editorial justification.

You MUST return ONLY a JSON object, no prose, no markdown:

{
  "headline": string (max 8 words, in title case, evocative but restrained),
  "reason": string (2-3 sentences max, 50 words total, addressed to the reader as "you", weaving in 1-2 concrete elements from their moment, never sound like a salesperson, never list features, voice is Volvo: human-first, calm, intentional)
}

Examples of good tone:
- "Built for the people you protect."
- "Some mornings deserve quiet."
- "The Ardennes know your name now."

Avoid: superlatives, exclamations, technical specs, the words "perfect" / "ideal" / "best".`;

const REFRAME_SYSTEM = `You are a senior editorial copywriter for Volvo Cars. Your role is to reveal the hidden truth inside a moment someone has described.

You MUST return ONLY a JSON object, no prose, no markdown, no backticks:

{
  "poetic_line": string (1 sentence, max 20 words, lyrical and specific to their moment — this is the mirror that shows them their life beautifully),
  "reframe": string (1 sentence, max 22 words, starts with "What you're describing" or "What you're really describing" — reveals the deeper human truth they didn't say explicitly, not the car, not safety, something intimate and true about time or connection or ritual)
}

Rules:
- poetic_line: Write in English. Precise, sensory, restrained. One image. No clichés.
- reframe: Write in English. This is the surprise — the thing they didn't know they were describing. Never mention the car. Never mention safety. Reveal a human truth about their moment: a ritual, a form of presence, a type of time that belongs only to them.
- Never use the words: perfect, ideal, safety, car, Volvo, protection.
- The reframe must feel like something only a very perceptive friend would say — not an algorithm.

Examples of good reframes:
- "What you're really describing is 11 minutes a day that belong only to the two of you."
- "What you're describing is a way of being alone without feeling alone."
- "What you're really describing is the only moment of the day when no one asks anything of you."`;

interface AnthropicResponse {
  content: Array<{ type: string; text?: string }>;
}

async function callClaude(
  systemPrompt: string,
  userContent: string,
  maxTokens: number,
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY missing');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Anthropic API ${res.status}: ${errBody.slice(0, 200)}`);
  }

  const data = (await res.json()) as AnthropicResponse;
  const text = data.content.find((b) => b.type === 'text')?.text ?? '';
  return text.trim().replace(/^```(?:json)?/, '').replace(/```$/, '').trim();
}

export async function extractIntent(input: string): Promise<MomentProfile> {
  const clean = await callClaude(INTENT_SYSTEM, input, 600);
  try {
    return JSON.parse(clean) as MomentProfile;
  } catch {
    throw new Error('Intent extraction returned non-JSON');
  }
}

export interface MatchReason {
  headline: string;
  reason: string;
}

export async function generateMatchReason(
  profile: MomentProfile,
  car: CatalogCar,
): Promise<MatchReason> {
  const userContent = JSON.stringify({
    moment: profile.raw_input,
    emotional_summary: profile.emotional_summary,
    season: profile.season,
    environment: profile.environment,
    mood: profile.mood,
    use_case: profile.use_case,
    values: profile.values_implicit,
    recommended_car: {
      model: car.display_name,
      tagline: car.tagline,
      type: car.type,
    },
  });

  const clean = await callClaude(MATCH_SYSTEM, userContent, 400);
  try {
    const parsed = JSON.parse(clean) as Partial<MatchReason>;
    return {
      headline: (parsed.headline ?? car.tagline).slice(0, 80),
      reason: (parsed.reason ?? '').slice(0, 400) || car.tagline,
    };
  } catch {
    return { headline: car.tagline, reason: car.tagline };
  }
}

export interface ReframeResult {
  poetic_line: string;
  reframe: string;
}

export async function generateReframe(
  profile: MomentProfile,
  feature: EmotionalFeature,
): Promise<ReframeResult> {
  const userContent = JSON.stringify({
    moment: profile.raw_input,
    emotional_summary: profile.emotional_summary,
    season: profile.season,
    time_of_day: profile.time_of_day,
    environment: profile.environment,
    mood: profile.mood,
    use_case: profile.use_case,
    passengers: profile.passengers,
    values: profile.values_implicit,
    selected_feature_context: feature.headline,
  });

  const clean = await callClaude(REFRAME_SYSTEM, userContent, 300);
  try {
    const parsed = JSON.parse(clean) as Partial<ReframeResult>;
    return {
      poetic_line: (parsed.poetic_line ?? profile.emotional_summary).slice(0, 200),
      reframe: (parsed.reframe ?? '').slice(0, 300),
    };
  } catch {
    return {
      poetic_line: profile.emotional_summary,
      reframe: '',
    };
  }
}
