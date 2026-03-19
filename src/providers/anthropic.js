/**
 * Anthropic LLM Provider
 * https://docs.anthropic.com/en/api/messages
 */

import { BaseLLMProvider } from './base.js';

const BASE_URL = 'https://api.anthropic.com/v1';
const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
const API_VERSION = '2023-06-01';

export class AnthropicProvider extends BaseLLMProvider {
  constructor(apiKey) {
    super('anthropic', apiKey, BASE_URL, DEFAULT_MODEL);
  }

  getEnvVarName() {
    return 'ANTHROPIC_API_KEY';
  }

  _buildHeaders() {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'anthropic-version': API_VERSION
    };
  }

  async _chat(messages, options = {}) {
    const model = options.model || this.defaultModel;
    const temperature = options.temperature ?? 0.7;
    const maxTokens = options.max_tokens || 4096;

    // Anthropic uses a different format: separate system from messages
    const systemMessage = messages.find(m => m.role === 'system');
    const chatMessages = messages.filter(m => m.role !== 'system');

    const body = {
      model,
      max_tokens: maxTokens,
      temperature,
      messages: chatMessages,
    };

    if (systemMessage) {
      body.system = systemMessage.content;
    }

    if (options.tools) {
      body.tools = options.tools;
    }

    const data = await this._makeRequest(`${this.baseUrl}/messages`, body);

    // Normalize Anthropic response to common format
    const textContent = data.content?.find(c => c.type === 'text');

    return {
      content: textContent?.text || '',
      role: data.role || 'assistant',
      usage: data.usage ? {
        prompt_tokens: data.usage.input_tokens,
        completion_tokens: data.usage.output_tokens,
        total_tokens: (data.usage.input_tokens || 0) + (data.usage.output_tokens || 0)
      } : null,
      model: data.model || model,
      raw: data
    };
  }
}

export default function createAnthropicProvider(apiKey) {
  return new AnthropicProvider(apiKey || process.env.ANTHROPIC_API_KEY);
}
