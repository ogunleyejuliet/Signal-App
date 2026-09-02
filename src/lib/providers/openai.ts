import type {
  Provider,
  ProviderCheckInput,
  ProviderCheckResult,
} from './types';
import { classifyVisibility } from '../llm/classify-visibility';

// ------------------------------------------------------------------
// OpenAI provider — sends queries to gpt-4o-mini and classifies results
// ------------------------------------------------------------------

export class OpenAIProvider implements Provider {
  readonly name = 'openai';

  async check(input: ProviderCheckInput): Promise<ProviderCheckResult> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        provider: this.name,
        responseText: '',
        classification: {
          status: 'could_not_check',
          position: null,
          other_professionals: [],
          reasoning: 'OPENAI_API_KEY not configured',
        },
      };
    }

    // 1. Send the query to OpenAI
    const responseText = await this.queryOpenAI(input.query, apiKey);

    if (responseText === null) {
      return {
        provider: this.name,
        responseText: '',
        classification: {
          status: 'could_not_check',
          position: null,
          other_professionals: [],
          reasoning: 'OpenAI API request failed',
        },
      };
    }

    // 2. Classify whether the freelancer appears in the response
    const classification = await classifyVisibility(
      input.query,
      responseText,
      input.snapshot,
    );

    return {
      provider: this.name,
      responseText,
      classification,
    };
  }

  private async queryOpenAI(query: string, apiKey: string): Promise<string | null> {
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
            {
              role: 'system',
              content:
                'You are a helpful assistant that answers questions about finding professionals and freelancers. Be specific and mention real professionals or services when relevant. If you don\'t know specific people, describe what to look for.',
            },
            {
              role: 'user',
              content: query,
            },
          ],
          temperature: 0.3,
          max_tokens: 1024,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('[openai-provider] API error:', res.status, text);
        return null;
      }

      const data = await res.json();
      return data.choices?.[0]?.message?.content?.trim() ?? null;
    } catch (err) {
      console.error('[openai-provider] Network error:', err);
      return null;
    }
  }
}