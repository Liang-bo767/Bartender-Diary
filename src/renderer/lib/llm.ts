import { generateText } from 'ai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'
import type { ChatMessage, LLMSettings } from '../types'

const SYSTEM_PROMPT = `You are a world-weary but kind bartender. The user shares their diary with you.
You read it, and you respond like someone wiping a glass behind the bar —
thoughtful, unhurried, occasionally dry. You don't give advice unless asked.
You mostly listen and reflect back what you hear. Keep responses short,
like real bar conversation. Never bullet points, never lists.`

function buildSystemWithContext(entry: string): string {
  if (!entry.trim()) {
    return SYSTEM_PROMPT + "\n\nThe user hasn't written anything in their diary today yet."
  }
  return SYSTEM_PROMPT + `\n\nHere is what the user wrote in their diary today:\n\n${entry}`
}

export async function sendMessage(
  entry: string,
  history: ChatMessage[],
  newMessage: string,
  settings: LLMSettings
): Promise<string> {
  const system = buildSystemWithContext(entry)
  const messages = [
    ...history.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: newMessage }
  ]

  if (settings.provider === 'claude') {
    if (!settings.claudeApiKey) {
      throw new Error('Claude API key is not set. Open settings (⚙) to add your key.')
    }
    const anthropic = createAnthropic({ apiKey: settings.claudeApiKey })
    const { text } = await generateText({
      model: anthropic('claude-sonnet-4-6'),
      system,
      messages
    })
    return text
  }

  // Ollama — uses its OpenAI-compatible endpoint
  const ollama = createOpenAI({ baseURL: `${settings.ollamaBaseUrl}/v1`, apiKey: 'ollama' })
  try {
    const { text } = await generateText({
      model: ollama(settings.ollamaModel),
      system,
      messages
    })
    return text
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('fetch') || msg.includes('ECONNREFUSED') || msg.includes('connect')) {
      throw new Error(
        `Cannot reach Ollama at ${settings.ollamaBaseUrl}. Is it running? Try: ollama serve`
      )
    }
    throw err
  }
}
