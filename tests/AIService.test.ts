// AGENTS.md §10: Comprehensive Testing Strategy
// Mocks for all REST endpoints to test cascades and error handling.

import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { AIService, ApiKeys } from '../src/services/AIService';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

const FAKE_API_KEYS: ApiKeys = {
  cerebras: 'fake-cerebras-key',
  gemini: 'fake-gemini-key',
  deepseek: 'fake-deepseek-key',
  openrouter: 'fake-openrouter-key',
  mistral: 'fake-mistral-key',
  together: 'fake-together-key',
  groq: 'fake-groq-key',
};

const handlers = [
  // Cerebras (OpenAI Compatible)
  http.post('https://api.cerebras.ai/v1/chat/completions', async ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (auth === `Bearer ${FAKE_API_KEYS.cerebras}`) {
      return HttpResponse.json({ choices: [{ message: { content: 'Response from Cerebras' } }] });
    }
    return new HttpResponse('Unauthorized', { status: 401 });
  }),

  // Gemini (Native REST)
  http.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent', async ({ request }) => {
    const url = new URL(request.url);
    if (url.searchParams.get('key') === FAKE_API_KEYS.gemini) {
      return HttpResponse.json({ candidates: [{ content: { parts: [{ text: 'Response from Gemini' }] } }] });
    }
    return new HttpResponse('Unauthorized', { status: 401 });
  }),

  // DeepSeek (OpenAI Compatible)
  http.post('https://api.deepseek.com/v1/chat/completions', async ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (auth === `Bearer ${FAKE_API_KEYS.deepseek}`) {
      return HttpResponse.json({ choices: [{ message: { content: 'Response from DeepSeek' } }] });
    }
    return new HttpResponse('Unauthorized', { status: 401 });
  }),

  // All other providers for fallback tests
  http.post('https://openrouter.ai/api/v1/chat/completions', () => new HttpResponse(null, { status: 500 })),
  http.post('https://api.mistral.ai/v1/chat/completions', () => new HttpResponse(null, { status: 500 })),
  http.post('https://api.together.xyz/v1/chat/completions', () => new HttpResponse(null, { status: 500 })),
  http.post('https://api.groq.com/openai/v1/chat/completions', () => new HttpResponse(null, { status: 500 })),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('AIService', () => {
  it('should return a response from the primary provider (Cerebras) if it succeeds', async () => {
    const aiService = new AIService(FAKE_API_KEYS);
    const response = await aiService.chat([{ role: 'user', content: 'hello' }]);
    expect(response.provider).toBe('cerebras');
    expect(response.content).toBe('Response from Cerebras');
  });

  it('should fall back to the secondary provider (Gemini) if the primary fails', async () => {
    server.use(
      http.post('https://api.cerebras.ai/v1/chat/completions', () => new HttpResponse(null, { status: 500 }))
    );
    const aiService = new AIService(FAKE_API_KEYS);
    const response = await aiService.chat([{ role: 'user', content: 'hello' }]);
    expect(response.provider).toBe('gemini');
    expect(response.content).toBe('Response from Gemini');
  });

  it('should fall back through the cascade until a provider succeeds', async () => {
    server.use(
      http.post('https://api.cerebras.ai/v1/chat/completions', () => new HttpResponse(null, { status: 500 })),
      http.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent', () => new HttpResponse(null, { status: 500 }))
    );
    const aiService = new AIService(FAKE_API_KEYS);
    const response = await aiService.chat([{ role: 'user', content: 'hello' }]);
    expect(response.provider).toBe('deepseek');
    expect(response.content).toBe('Response from DeepSeek');
  });

  it('should throw an error if all providers fail', async () => {
    server.use(
      http.post('https://api.cerebras.ai/v1/chat/completions', () => new HttpResponse(null, { status: 500 })),
      http.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent', () => new HttpResponse(null, { status: 500 })),
      http.post('https://api.deepseek.com/v1/chat/completions', () => new HttpResponse(null, { status: 500 }))
    );
    const aiService = new AIService(FAKE_API_KEYS);
    await expect(aiService.chat([{ role: 'user', content: 'hello' }])).rejects.toThrow(
      'All AI providers failed. Please check your API keys, network connection, and provider status.'
    );
  });

  it('should skip providers with missing API keys', async () => {
    const incompleteKeys: ApiKeys = { ...FAKE_API_KEYS, cerebras: '' };
    const aiService = new AIService(incompleteKeys);
    const response = await aiService.chat([{ role: 'user', content: 'hello' }]);
    expect(response.provider).toBe('gemini');
  });

  it('should retry on 429 error and then succeed', async () => {
    let requestCount = 0;
    server.use(
      http.post('https://api.cerebras.ai/v1/chat/completions', () => {
        requestCount++;
        if (requestCount === 1) {
          return new HttpResponse('Rate limit exceeded', { status: 429 });
        }
        return HttpResponse.json({ choices: [{ message: { content: 'Success on retry' } }] });
      })
    );

    const aiService = new AIService(FAKE_API_KEYS);
    const response = await aiService.chat([{ role: 'user', content: 'hello' }]);
    expect(response.content).toBe('Success on retry');
    expect(requestCount).toBe(2);
  });

  it('should fail fast on client errors like 401 Unauthorized', async () => {
    server.use(
      http.post('https://api.cerebras.ai/v1/chat/completions', () => new HttpResponse('Unauthorized', { status: 401 }))
    );
    const aiService = new AIService(FAKE_API_KEYS);
    // It should not throw here, but rather fall back to the next provider.
    const response = await aiService.chat([{ role: 'user', content: 'hello' }]);
    expect(response.provider).toBe('gemini');
  });
});
