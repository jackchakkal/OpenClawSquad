/**
 * Base LLM Provider - Interface comum para todos os providers
 */

export class BaseLLMProvider {
  constructor(name, apiKey, baseUrl, defaultModel) {
    this.name = name;
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.defaultModel = defaultModel;
    this.maxRetries = 3;
    this.retryDelays = [2000, 4000, 8000];
  }

  validateApiKey() {
    if (!this.apiKey) {
      throw new Error(
        `API key not configured for provider "${this.name}". ` +
        `Set the ${this.getEnvVarName()} environment variable.`
      );
    }
  }

  getEnvVarName() {
    return `${this.name.toUpperCase()}_API_KEY`;
  }

  async chat(messages, options = {}) {
    this.validateApiKey();
    return this._withRetry(() => this._chat(messages, options));
  }

  async _chat(_messages, _options) {
    throw new Error(`Provider "${this.name}" must implement _chat()`);
  }

  async _withRetry(fn) {
    let lastError;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // Don't retry on auth errors or bad requests
        if (error.status === 401 || error.status === 403 || error.status === 400) {
          throw error;
        }

        if (attempt < this.maxRetries) {
          const delay = this.retryDelays[attempt] || 8000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  _buildHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };
  }

  async _makeRequest(url, body) {
    const response = await fetch(url, {
      method: 'POST',
      headers: this._buildHeaders(),
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      const error = new Error(
        `${this.name} API error (${response.status}): ${errorBody}`
      );
      error.status = response.status;
      throw error;
    }

    return response.json();
  }
}
