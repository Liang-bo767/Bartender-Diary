export interface DiaryEntry {
  date: string
  content: string
  updatedAt: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface LLMSettings {
  provider: 'claude' | 'ollama'
  claudeApiKey: string
  ollamaModel: string
  ollamaBaseUrl: string
}

export const DEFAULT_SETTINGS: LLMSettings = {
  provider: 'ollama',
  claudeApiKey: '',
  ollamaModel: 'llama3',
  ollamaBaseUrl: 'http://localhost:11434'
}

// Extend the global Window interface for the preload-exposed API
declare global {
  interface Window {
    api: {
      diary: {
        load: (date: string) => Promise<DiaryEntry | null>
        save: (date: string, content: string) => Promise<void>
      }
      settings: {
        load: () => Promise<LLMSettings | null>
        save: (settings: LLMSettings) => Promise<void>
      }
    }
  }
}
