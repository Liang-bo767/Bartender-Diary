import { useState } from 'react'
import type { LLMSettings } from '../types'

interface Props {
  settings: LLMSettings
  onSave: (settings: LLMSettings) => void
  onClose: () => void
}

export default function SettingsPanel({ settings, onSave, onClose }: Props) {
  const [local, setLocal] = useState<LLMSettings>({ ...settings })

  const update = <K extends keyof LLMSettings>(key: K, value: LLMSettings[K]): void => {
    setLocal((prev) => ({ ...prev, [key]: value }))
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#16161f] border border-[#2a2a38] rounded-2xl p-6 w-[400px] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#e8e8f0] font-medium">Settings</h2>
          <button
            onClick={onClose}
            className="text-[#4a4a5e] hover:text-[#e8e8f0] transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Provider toggle */}
        <div className="mb-5">
          <label className="text-[#6a6a80] text-[10px] uppercase tracking-widest mb-2 block">
            LLM Provider
          </label>
          <div className="flex gap-2">
            {(['claude', 'ollama'] as const).map((p) => (
              <button
                key={p}
                onClick={() => update('provider', p)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  local.provider === p
                    ? 'bg-[#c9a96e] text-[#0f0f14]'
                    : 'bg-[#1e1e2d] text-[#6a6a80] hover:text-[#e8e8f0]'
                }`}
              >
                {p === 'claude' ? 'Claude API' : 'Ollama (local)'}
              </button>
            ))}
          </div>
        </div>

        {/* Claude settings */}
        {local.provider === 'claude' && (
          <div className="mb-5">
            <label className="text-[#6a6a80] text-[10px] uppercase tracking-widest mb-2 block">
              Anthropic API Key
            </label>
            <input
              type="password"
              value={local.claudeApiKey}
              onChange={(e) => update('claudeApiKey', e.target.value)}
              placeholder="sk-ant-..."
              className="w-full bg-[#1e1e2d] border border-[#2a2a38] focus:border-[#c9a96e] rounded-xl px-3 py-2.5 text-sm text-[#e8e8f0] outline-none transition-colors placeholder-[#3a3a4a]"
            />
            <p className="text-[#3a3a50] text-[10px] mt-2">
              Stored locally on your machine. Never sent anywhere else.
            </p>
          </div>
        )}

        {/* Ollama settings */}
        {local.provider === 'ollama' && (
          <>
            <div className="mb-4">
              <label className="text-[#6a6a80] text-[10px] uppercase tracking-widest mb-2 block">
                Model
              </label>
              <input
                type="text"
                value={local.ollamaModel}
                onChange={(e) => update('ollamaModel', e.target.value)}
                placeholder="llama3"
                className="w-full bg-[#1e1e2d] border border-[#2a2a38] focus:border-[#c9a96e] rounded-xl px-3 py-2.5 text-sm text-[#e8e8f0] outline-none transition-colors placeholder-[#3a3a4a]"
              />
              <p className="text-[#3a3a50] text-[10px] mt-2">
                Any model you have pulled, e.g. llama3, mistral, gemma3
              </p>
            </div>
            <div className="mb-5">
              <label className="text-[#6a6a80] text-[10px] uppercase tracking-widest mb-2 block">
                Base URL
              </label>
              <input
                type="text"
                value={local.ollamaBaseUrl}
                onChange={(e) => update('ollamaBaseUrl', e.target.value)}
                placeholder="http://localhost:11434"
                className="w-full bg-[#1e1e2d] border border-[#2a2a38] focus:border-[#c9a96e] rounded-xl px-3 py-2.5 text-sm text-[#e8e8f0] outline-none transition-colors placeholder-[#3a3a4a]"
              />
            </div>
          </>
        )}

        {/* Save */}
        <button
          onClick={() => onSave(local)}
          className="w-full bg-[#c9a96e] hover:bg-[#d4b57a] text-[#0f0f14] rounded-xl py-2.5 text-sm font-medium transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  )
}
