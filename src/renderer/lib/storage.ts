import type { LLMSettings } from '../types'

export function todayDate(): string {
  return new Date().toISOString().split('T')[0]
}

export async function loadEntry(date: string): Promise<string> {
  const entry = await window.api.diary.load(date)
  return entry?.content ?? ''
}

export async function saveEntry(date: string, content: string): Promise<void> {
  await window.api.diary.save(date, content)
}

export async function loadSettings(): Promise<LLMSettings | null> {
  return window.api.settings.load()
}

export async function saveSettings(settings: LLMSettings): Promise<void> {
  await window.api.settings.save(settings)
}
