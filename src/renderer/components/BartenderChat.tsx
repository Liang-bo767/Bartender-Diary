import { useState, useRef, useEffect } from 'react'
import { sendMessage } from '../lib/llm'
import type { ChatMessage, LLMSettings } from '../types'

interface Props {
  entry: string
  messages: ChatMessage[]
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
  settings: LLMSettings
  onOpenSettings: () => void
}

export default function BartenderChat({
  entry,
  messages,
  setMessages,
  settings,
  onOpenSettings
}: Props) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
  }, [input])

  const send = async (): Promise<void> => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    }

    // Capture history before state update (setMessages is async)
    const historySnapshot = messages

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const reply = await sendMessage(entry, historySnapshot, text, settings)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: reply, timestamp: new Date().toISOString() }
      ])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a38] flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🍸</span>
          <div>
            <p className="text-[#e8e8f0] text-sm font-medium leading-none">The Bartender</p>
            <p className="text-[#4a4a5e] text-[10px] mt-0.5 capitalize">{settings.provider}</p>
          </div>
        </div>
        <button
          onClick={onOpenSettings}
          className="text-[#4a4a5e] hover:text-[#c9a96e] transition-colors text-lg leading-none p-1"
          title="Settings"
        >
          ⚙
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-[#2e2e40] text-sm text-center mt-10 leading-relaxed italic">
            Write something in your diary,
            <br />
            then say hello.
          </p>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#26203a] text-[#d8d8e8] rounded-br-sm'
                  : 'bg-[#1a1a28] text-[#c8c8d8] rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#1a1a28] rounded-2xl rounded-bl-sm px-4 py-3">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#4a4a5e] rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-[#4a4a5e] rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-[#4a4a5e] rounded-full animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-300 text-xs bg-red-950/40 border border-red-900/40 rounded-xl p-3 leading-relaxed">
            {error}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-3 pb-3 flex-shrink-0">
        <div className="flex items-end gap-2 bg-[#1a1a28] rounded-xl border border-[#2a2a38] focus-within:border-[#3a3a50] transition-colors px-3 py-2.5">
          <textarea
            ref={textareaRef}
            rows={1}
            className="flex-1 bg-transparent text-[#d8d8e8] text-sm resize-none outline-none placeholder-[#2e2e40] leading-relaxed"
            placeholder="Say something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#c9a96e] disabled:bg-[#2a2a38] text-[#0f0f14] disabled:text-[#3a3a4a] flex items-center justify-center transition-colors hover:bg-[#d4b57a] disabled:cursor-not-allowed text-base"
          >
            ↑
          </button>
        </div>
        <p className="text-[#2a2a38] text-[10px] mt-1.5 text-center">
          Enter to send · Shift+Enter for newline
        </p>
      </div>
    </div>
  )
}
