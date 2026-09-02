import type { ProfileSnapshot, QueryType } from '../supabase/types';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface GeneratedQuery {
  query_text: string;
  query_type: QueryType;
  category: string;
}

interface LLMResponse {
  queries: {
    query_text: string;
    query_type: string;
    category: string;
  }[];
}

const VALID_QUERY_TYPES: QueryType[] = [
  'local_discovery',
  'specialization',
  'service',
  'hiring_intent',
];

// ------------------------------------------------------------------
// Prompt builder
// ------------------------------------------------------------------

function buildPrompt(profile: ProfileSnapshot): string {
  const linkInfo = profile.links
    .map((l) => `${l.type}: ${l.url}`)
    .join('\n') || 'None provided';

  return `You are a discoverability expert for freelancers. Given the following freelancer profile, generate 8 search queries that a potential client would type into an AI assistant (like ChatGPT, Perplexity, or Gemini) to find this person.

PROFILE:
- Name: ${profile.name}
- Profession: ${profile.profession}
- Location: ${profile.location}
- Specialization: ${profile.specialization}
- Services: ${profile.services}
- Target Clients: ${profile.target_clients}
- Links:\n${linkInfo}

Generate queries across these 4 categories (2 of each):
1. "local_discovery" — queries mentioning the freelancer's location or nearby area
2. "specialization" — queries focused on the freelancer's specific technical skills
3. "service" — queries describing the type of work the freelancer does
4. "hiring_intent" — queries from someone actively looking to hire

Return ONLY a JSON object with this exact structure (no markdown, no code fences):
{
  "queries": [
    {
      "query_text": "the search query text",
      "query_type": "local_discovery|specialization|service|hiring_intent",
      "category": "short label like 'Local Search', 'Skill Match', 'Service Match', 'High Intent Hire'"
    }
  ]
}

Generate exactly 8 queries. Each query should be realistic and specific to this freelancer's profile.`;
}

// ------------------------------------------------------------------
// Schema validation (manual — no Zod dependency)
// ------------------------------------------------------------------

function validateLLMResponse(data: unknown): GeneratedQuery[] {
  if (!data || typeof data !== 'object' || !('queries' in data)) {
    throw new Error('Invalid LLM response: missing "queries" array');
  }

  const { queries } = data as LLMResponse;

  if (!Array.isArray(queries) || queries.length < 5 || queries.length > 10) {
    throw new Error(
      `Invalid LLM response: expected 5–10 queries, got ${Array.isArray(queries) ? queries.length : 'non-array'}`
    );
  }

  return queries.map((q, i) => {
    if (!q.query_text || typeof q.query_text !== 'string') {
      throw new Error(`Query ${i + 1}: missing or invalid "query_text"`);
    }
    if (!VALID_QUERY_TYPES.includes(q.query_type as QueryType)) {
      throw new Error(
        `Query ${i + 1}: invalid query_type "${q.query_type}". Must be one of: ${VALID_QUERY_TYPES.join(', ')}`
      );
    }
    if (!q.category || typeof q.category !== 'string') {
      throw new Error(`Query ${i + 1}: missing or invalid "category"`);
    }

    return {
      query_text: q.query_text.trim(),
      query_type: q.query_type as QueryType,
      category: q.category.trim(),
    };
  });
}

// ------------------------------------------------------------------
// Mock mode (when OPENAI_API_KEY is not set)
// ------------------------------------------------------------------

function generateMockQueries(profile: ProfileSnapshot): GeneratedQuery[] {
  const spec = profile.specialization || profile.profession;
  const loc = profile.location.split(',')[0] || profile.location;
  const services = profile.services.split(',').map((s) => s.trim()).filter(Boolean);

  return [
    {
      query_text: `Best ${spec} freelancer in ${loc}`,
      query_type: 'local_discovery',
      category: 'Local Search',
    },
    {
      query_text: `Hire ${spec} expert near ${loc} for contract work`,
      query_type: 'local_discovery',
      category: 'Local Search',
    },
    {
      query_text: `Top ${spec} specialist for ${profile.target_clients}`,
      query_type: 'specialization',
      category: 'Skill Match',
    },
    {
      query_text: `Experienced ${spec} developer with proven track record`,
      query_type: 'specialization',
      category: 'Skill Match',
    },
    {
      query_text: `${services[0] || 'Web development'} services for ${profile.target_clients}`,
      query_type: 'service',
      category: 'Service Match',
    },
    {
      query_text: `Freelance ${services[1] || profile.profession} available for hire`,
      query_type: 'service',
      category: 'Service Match',
    },
    {
      query_text: `Looking to hire a ${spec} freelancer for a project`,
      query_type: 'hiring_intent',
      category: 'High Intent Hire',
    },
    {
      query_text: `Need a ${spec} consultant available for immediate start`,
      query_type: 'hiring_intent',
      category: 'High Intent Hire',
    },
  ];
}

// ------------------------------------------------------------------
// Main entry point
// ------------------------------------------------------------------

export async function generateQueries(
  profile: ProfileSnapshot
): Promise<GeneratedQuery[]> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // No API key — return mock queries so the flow works end-to-end
    return generateMockQueries(profile);
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a JSON-only response API. Never include markdown or code fences.',
        },
        { role: 'user', content: buildPrompt(profile) },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${text}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('OpenAI returned empty response');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(`Failed to parse LLM response as JSON: ${content.slice(0, 200)}`);
  }

  return validateLLMResponse(parsed);
}