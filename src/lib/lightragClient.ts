/**
 * LightRAG Client - Plug & Play integration for Ernest chatbot
 * 
 * Copy this file to your project and use it like:
 * 
 * import { askLightRAG, streamLightRAG } from './lightragClient';
 * 
 * // Simplest usage - just get the answer:
 * const answer = await askLightRAG("What is LightRAG?");
 * console.log(answer);
 * 
 * // Streaming with callback:
 * await streamLightRAG("What is LightRAG?", (textSoFar) => {
 *   chatElement.textContent = textSoFar; // Updates with full text so far
 * });
 */

// ============================================
// CONFIGURATION - Uses environment variables
// ============================================
const LIGHTRAG_CONFIG = {
  baseUrl: 'https://ernst-production.up.railway.app', // Temporarily hardcoded for testing
  apiKey: import.meta.env.VITE_LIGHTRAG_API_KEY || '',
  defaultMode: 'mix' as QueryMode,
};

type QueryMode = 'local' | 'global' | 'hybrid' | 'naive' | 'mix';

interface QueryOptions {
  mode?: QueryMode;
  includeReferences?: boolean;
  conversationHistory?: Array<{ role: string; content: string }>;
}

interface Reference {
  reference_id: string;
  file_path: string;
  content?: string[];
}

interface QueryResponse {
  response: string;
  references?: Reference[];
}

/**
 * SIMPLEST USAGE - Just ask and get the answer as a string
 * 
 * const answer = await askLightRAG("Hvad handler overenskomsten om?");
 * console.log(answer);
 */
export async function askLightRAG(query: string, options: QueryOptions = {}): Promise<string> {
  const result = await queryLightRAG(query, options);
  return result.response;
}

/**
 * Full query - returns response with optional references
 */
export async function queryLightRAG(
  query: string,
  options: QueryOptions = {}
): Promise<QueryResponse> {
  const { mode = LIGHTRAG_CONFIG.defaultMode, includeReferences = false, conversationHistory } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (LIGHTRAG_CONFIG.apiKey) {
    headers['X-API-Key'] = LIGHTRAG_CONFIG.apiKey;
  }

  const response = await fetch(`${LIGHTRAG_CONFIG.baseUrl}/query`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      mode,
      include_references: includeReferences,
      conversation_history: conversationHistory,
    }),
  });

  if (!response.ok) {
    throw new Error(`LightRAG query failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Streaming query - calls onUpdate with the FULL text so far (not just the new chunk)
 * This makes it easy to update your UI: just set element.textContent = text
 * 
 * await streamLightRAG("Spørgsmål", (fullTextSoFar) => {
 *   messageElement.textContent = fullTextSoFar;
 * });
 */
export async function streamLightRAG(
  query: string,
  onUpdate: (fullTextSoFar: string) => void,
  options: QueryOptions = {}
): Promise<QueryResponse> {
  const { mode = LIGHTRAG_CONFIG.defaultMode, includeReferences = false, conversationHistory } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (LIGHTRAG_CONFIG.apiKey) {
    headers['X-API-Key'] = LIGHTRAG_CONFIG.apiKey;
  }

  const response = await fetch(`${LIGHTRAG_CONFIG.baseUrl}/query/stream`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      mode,
      stream: true,
      include_references: includeReferences,
      conversation_history: conversationHistory,
    }),
  });

  if (!response.ok) {
    throw new Error(`LightRAG stream failed: ${response.status} ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  let fullResponse = '';
  let references: Reference[] | undefined;
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    
    // Keep the last incomplete line in the buffer
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;

      try {
        const data = JSON.parse(line);

        if (data.references) {
          references = data.references;
        }

        if (data.response) {
          fullResponse += data.response;
          onUpdate(fullResponse);  // Send full text, not just chunk
        }

        if (data.error) {
          throw new Error(data.error);
        }
      } catch (e) {
        if (e instanceof SyntaxError) continue;
        throw e;
      }
    }
  }

  // Process any remaining buffer
  if (buffer.trim()) {
    try {
      const data = JSON.parse(buffer);
      if (data.response) {
        fullResponse += data.response;
        onUpdate(fullResponse);
      }
    } catch {
      // Ignore incomplete JSON at the end
    }
  }

  return {
    response: fullResponse,
    references,
  };
}

/**
 * Configure the LightRAG client
 */
export function configureLightRAG(config: Partial<typeof LIGHTRAG_CONFIG>) {
  Object.assign(LIGHTRAG_CONFIG, config);
}

/**
 * Check if LightRAG server is healthy
 */
export async function checkLightRAGHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${LIGHTRAG_CONFIG.baseUrl}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

// Default export for convenience
export default {
  ask: askLightRAG,
  query: queryLightRAG,
  stream: streamLightRAG,
  configure: configureLightRAG,
  checkHealth: checkLightRAGHealth,
};
