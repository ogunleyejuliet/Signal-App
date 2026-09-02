import type { Provider } from './types';
import { OpenAIProvider } from './openai';

// ------------------------------------------------------------------
// Provider factory — returns the configured provider
// ------------------------------------------------------------------

let cachedProvider: Provider | null = null;

export function getProvider(): Provider {
  if (cachedProvider) return cachedProvider;

  // For MVP: always use OpenAI if the key is set
  if (process.env.OPENAI_API_KEY) {
    cachedProvider = new OpenAIProvider();
    return cachedProvider;
  }

  // Fallback: no provider configured — queries will return could_not_check
  cachedProvider = new OpenAIProvider();
  return cachedProvider;
}

export type { Provider, ProviderCheckInput, ProviderCheckResult } from './types';
export type { VisibilityStatus, ClassificationResult } from './types';