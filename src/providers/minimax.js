/**
 * Minimax LLM Provider - Minimax M2.7 API
 * https://platform.minimax.io/docs/api-reference/text-openai-api
 */

import { BaseLLMProvider } from './base.js';

const BASE_URL = 'https://api.minimax.io/v1';
const DEFAULT_MODEL = 'M2.7';

export class MinimaxProvider extends BaseLLMProvider {
  constructor(apiKey) {
    super('minimax', apiKey, BASE_URL, DEFAULT_MODEL);
  }

  getEnvVarName() {
    return 'MINIMAX_API_KEY';
  }

  async _chat(messages, options = {}) {
    const model = options.model || this.defaultModel;
    const temperature = options.temperature ?? 0.7;
    const maxTokens = options.max_tokens || 4096;

    const body = {
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    };

    if (options.tools) {
      body.tools = options.tools;
    }

    const data = await this._makeRequest(`${this.baseUrl}/chat/completions`, body);

    return {
      content: data.choices?.[0]?.message?.content || '',
      role: data.choices?.[0]?.message?.role || 'assistant',
      usage: data.usage || null,
      model: data.model || model,
      raw: data
    };
  }
}

export default function createMinimaxProvider(apiKey) {
  return new MinimaxProvider(apiKey || process.env.MINIMAX_API_KEY);
}
