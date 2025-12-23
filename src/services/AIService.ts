// Compliant with AGENTS.md §2 & §3: Frontend-Only, Multi-Provider REST Architecture
// Best Practices: No SDKs, REST-only, Exponential Backoff, Provider Cascade.

export interface ApiKeys {
  cerebras: string;
  gemini: string;
  deepseek: string;
  openrouter: string;
  mistral: string;
  together: string;
  groq: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

type Provider = keyof ApiKeys;

const PROVIDER_CONFIG = {
  // Primary - AGENTS.md §3
  cerebras: {
    baseURL: 'https://api.cerebras.ai/v1',
    endpoint: '/chat/completions',
    model: 'llama-3.1-70b-chat',
    type: 'openai-compatible',
  },
  // Mandatory Backup - AGENTS.md §3
  gemini: {
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    endpoint: '/models/gemini-2.5-flash-lite:generateContent',
    type: 'gemini-native',
  },
  // High-Rate-Limit Free Providers (Resilience Cascade) - AGENTS.md §3
  deepseek: {
    baseURL: 'https://api.deepseek.com/v1',
    endpoint: '/chat/completions',
    model: 'deepseek-r1-0528',
    type: 'openai-compatible',
  },
  openrouter: {
    baseURL: 'https://openrouter.ai/api/v1',
    endpoint: '/chat/completions',
    model: 'deepseek/deepseek-r1',
    type: 'openai-compatible',
  },
  mistral: {
    baseURL: 'https://api.mistral.ai/v1',
    endpoint: '/chat/completions',
    model: 'mistral-large-3',
    type: 'openai-compatible',
  },
  together: {
    baseURL: 'https://api.together.xyz/v1',
    endpoint: '/chat/completions',
    model: 'meta-llama/Llama-3.1-70b-instruct',
    type: 'openai-compatible',
  },
  groq: {
    baseURL: 'https://api.groq.com/openai/v1',
    endpoint: '/chat/completions',
    model: 'llama-3.1-70b-versatile',
    type: 'openai-compatible',
  },
};

// As per AGENTS.md §3
const PROVIDER_CASCADE_ORDER: Provider[] = [
  'cerebras',
  'gemini',
  'deepseek',
  'openrouter',
  'mistral',
  'together',
  'groq',
];

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 2000;

export class AIService {
  private apiKeys: ApiKeys;

  constructor(apiKeys: ApiKeys) {
    this.apiKeys = apiKeys;
  }

  public async chat(messages: ChatMessage[]): Promise<{ content: string, provider: Provider }> {
    for (const provider of PROVIDER_CASCADE_ORDER) {
      const apiKey = this.apiKeys[provider];
      if (!apiKey) {
        console.warn(`[AIService] Skipping ${provider}: API key not provided.`);
        continue;
      }

      try {
        const response = await this.tryProviderWithBackoff(provider, messages, apiKey);
        if (response) {
            const content = this.parseResponse(provider, response);
            return { content, provider };
        }
      } catch (error) {
        console.error(`[AIService] Provider ${provider} failed permanently:`, error);
      }
    }

    throw new Error('All AI providers failed. Please check your API keys, network connection, and provider status.');
  }

  private async tryProviderWithBackoff(provider: Provider, messages: ChatMessage[], apiKey: string): Promise<any> {
    let lastError: any;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        return await this.makeApiCall(provider, messages, apiKey);
      } catch (error: any) {
        lastError = error;
        // Retry only on rate limit (429) or server errors (5xx) - AGENTS.md §9
        if (error.status === 429 || error.status >= 500) {
          const delay = INITIAL_BACKOFF_MS * Math.pow(2, attempt) + Math.random() * 1000;
          console.warn(`[AIService] Provider ${provider} returned status ${error.status}. Retrying in ${delay.toFixed(0)}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // Do not retry for client-side errors like 400, 401, 403. Fail fast.
          throw error;
        }
      }
    }
    throw lastError;
  }

  private async makeApiCall(provider: Provider, messages: ChatMessage[], apiKey: string): Promise<any> {
    const config = PROVIDER_CONFIG[provider];
    const url = `${config.baseURL}${config.endpoint}${config.type === 'gemini-native' ? `?key=${apiKey}` : ''}`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    let body: any;

    if (config.type === 'openai-compatible') {
      headers['Authorization'] = `Bearer ${apiKey}`;
      body = {
          model: config.model,
          messages,
          max_tokens: 32768,
          temperature: 0.7,
      };
    } else if (config.type === 'gemini-native') {
      const geminiMessages = messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : m.role,
          parts: [{ text: m.content }],
      }));
      body = {
          contents: geminiMessages,
          generationConfig: {
              maxOutputTokens: 32768,
              temperature: 0.7,
          },
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error: any = new Error(`API call to ${provider} failed with status ${response.status}: ${errorText}`);
      error.status = response.status;
      throw error;
    }

    return response.json();
  }

  private parseResponse(provider: Provider, response: any): string {
    const config = PROVIDER_CONFIG[provider];
    try {
      if (config.type === 'openai-compatible') {
        return response.choices[0]?.message?.content || '';
      }
      if (config.type === 'gemini-native') {
        return response.candidates[0]?.content?.parts[0]?.text || '';
      }
    } catch (e) {
      console.error(`[AIService] Failed to parse response from ${provider}:`, response);
      throw new Error(`Could not parse a valid response from ${provider}.`);
    }
    return '';
  }
}
