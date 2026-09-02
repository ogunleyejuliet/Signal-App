import type { ProfileSnapshot } from '../supabase/types';
import type { ClassificationResult, VisibilityStatus } from '../providers/types';

// ------------------------------------------------------------------
// Build the classification prompt
// ------------------------------------------------------------------

function buildClassificationPrompt(
  query: string,
  responseText: string,
  snapshot: ProfileSnapshot,
): { system: string; user: string } {
  const namesToSearch = buildNameVariants(snapshot.name);

  const system = `You are an expert at analyzing AI-generated responses to determine whether a specific freelancer is mentioned or recommended.

You MUST return a JSON object with exactly this shape:
{
  "status": "recommended" | "mentioned" | "not_found" | "could_not_check",
  "position": number | null,
  "other_professionals": string[],
  "reasoning": "short explanation"
}

Classification rules:
- "recommended": The freelancer is explicitly recommended, listed in a top-3 position, or presented as a strong match for the query.
- "mentioned": The freelancer appears in the response but not as a primary recommendation (position 4+, or mentioned in passing).
- "not_found": The AI provider returned a valid response about the topic, but the freelancer does not appear anywhere in it.
- "could_not_check": The provider failed, returned an error, returned an empty response, or the response cannot be evaluated (e.g. "I don't have enough information").

IMPORTANT: Never classify a provider failure as "not_found". If the response is an error message, empty, or clearly indicates a failure, use "could_not_check".

Position rules:
- If the response contains a numbered or ranked list and the freelancer appears, set position to their 1-based index.
- If the freelancer appears but not in a ranked list, set position to null.
- If status is "not_found" or "could_not_check", set position to null.

Other professionals:
- Extract names of other professionals or freelancers mentioned in the response (if any).
- Return as a flat array of name strings.
- If no other professionals are mentioned, return an empty array.`;

  const user = `Original query: "${query}"

Freelancer name variants to search for: ${namesToSearch.join(', ')}

AI Provider response:
"""
${responseText}
"""

Analyze this response and classify the freelancer's visibility.`;

  return { system, user };
}

// ------------------------------------------------------------------
// Build name variants for fuzzy matching
// ------------------------------------------------------------------

function buildNameVariants(name: string): string[] {
  const variants = new Set<string>();
  variants.add(name);

  // First name only
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) {
    variants.add(parts[0]);
    // Last name only
    variants.add(parts[parts.length - 1]);
    // First + Last (already the full name)
    // Initials variant: "A. Vance" style
    if (parts.length === 2) {
      variants.add(`${parts[0][0]}. ${parts[1]}`);
    }
  }

  // Lowercase variants
  for (const v of Array.from(variants)) {
    variants.add(v.toLowerCase());
  }

  return Array.from(variants);
}

// ------------------------------------------------------------------
// Classify visibility using OpenAI
// ------------------------------------------------------------------

export async function classifyVisibility(
  query: string,
  responseText: string,
  snapshot: ProfileSnapshot,
): Promise<ClassificationResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  // No API key → classify based on simple text matching
  if (!apiKey) {
    return classifyWithTextMatch(responseText, snapshot);
  }

  const { system, user } = buildClassificationPrompt(query, responseText, snapshot);

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.0,
        max_tokens: 512,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[classify-visibility] OpenAI error:', res.status, text);
      return fallbackClassification('could_not_check', `Provider returned ${res.status}`);
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content?.trim();
    if (!raw) {
      return fallbackClassification('could_not_check', 'Empty provider response');
    }

    const parsed = parseClassificationResponse(raw);
    if (!parsed) {
      return fallbackClassification('could_not_check', 'Failed to parse classification');
    }

    return parsed;
  } catch (err) {
    console.error('[classify-visibility] Network error:', err);
    return fallbackClassification('could_not_check', 'Provider request failed');
  }
}

// ------------------------------------------------------------------
// Parse the LLM classification response
// ------------------------------------------------------------------

function parseClassificationResponse(raw: string): ClassificationResult | null {
  // Strip markdown code fences if present
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  try {
    const obj = JSON.parse(cleaned);
    if (!obj || typeof obj !== 'object') return null;

    const validStatuses: VisibilityStatus[] = [
      'recommended', 'mentioned', 'not_found', 'could_not_check',
    ];
    if (!validStatuses.includes(obj.status)) return null;

    return {
      status: obj.status,
      position: typeof obj.position === 'number' ? obj.position : null,
      other_professionals: Array.isArray(obj.other_professionals)
        ? obj.other_professionals.filter((n: unknown) => typeof n === 'string')
        : [],
      reasoning: typeof obj.reasoning === 'string' ? obj.reasoning : '',
    };
  } catch {
    return null;
  }
}

// ------------------------------------------------------------------
// Fallback: text-match classification (no LLM / LLM failed)
// ------------------------------------------------------------------

function classifyWithTextMatch(
  responseText: string,
  snapshot: ProfileSnapshot,
): ClassificationResult {
  const names = buildNameVariants(snapshot.name);
  const lower = responseText.toLowerCase();

  for (const name of names) {
    if (lower.includes(name.toLowerCase())) {
      return {
        status: 'mentioned',
        position: null,
        other_professionals: [],
        reasoning: `Name "${name}" found in response (text-match fallback, no LLM)`,
      };
    }
  }

  return {
    status: 'not_found',
    position: null,
    other_professionals: [],
    reasoning: 'No name match found in response (text-match fallback, no LLM)',
  };
}

// ------------------------------------------------------------------
// Helper for failed classifications
// ------------------------------------------------------------------

function fallbackClassification(
  status: 'could_not_check' | 'not_found',
  reasoning: string,
): ClassificationResult {
  return {
    status,
    position: null,
    other_professionals: [],
    reasoning,
  };
}