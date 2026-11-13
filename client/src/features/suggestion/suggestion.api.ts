import { FindSuggestionsPayload } from '@/features/suggestion/suggestion.query';
import { Suggestion } from '@/features/suggestion/suggestion.types';
import { api } from '@/lib/api';

const SEARCH_TIMEOUT_MS = 100_000;

export const suggestionApi = {
  async findSuggestions(payload: FindSuggestionsPayload, clientIp?: string): Promise<Suggestion> {
    return await api.post<Suggestion>("/suggestions", payload, {
      timeoutMs: SEARCH_TIMEOUT_MS,
      headers: clientIp ? { "x-forwarded-for": clientIp } : undefined
    });
  }
}