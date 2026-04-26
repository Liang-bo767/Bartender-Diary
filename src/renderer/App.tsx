import { useState, useEffect } from 'react'
import DiaryEditor from './components/DiaryEditor'
import BartenderChat from './components/BartenderChat'
import SettingsPanel from './components/SettingsPanel'
import { loadEntry, loadSettings, saveSettings, todayDate } from './lib/storage'
import type { ChatMessage, LLMSettings } from './types'
import { DEFAULT_SETTINGS } from './types'

export default function App() {
  const date = todayDate()
  const [entry, setEntry] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [settings, setSettings] = useState<LLMSettings>(DEFAULT_SETTINGS)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    loadEntry(date).then(setEntry)
    loadSettings().then((s) => {
      if (s) setSettings(s)
    })
  }, [date])

  const handleSaveSettings = async (s: LLMSettings): Promise<void> => {
    setSettings(s)
    await saveSettings(s)
    setShowSettings(false)
  }

  return (
    <div className="flex h-screen bg-[#0f0f14] text-[#e8e8f0] overflow-hidden select-none">
      {/* Left: Bartender chat */}
      <div className="w-[340px] flex-shrink-0 border-r border-[#1e1e2d] flex flex-col">
        <BartenderChat
          entry={entry}
          messages={messages}
          setMessages={setMessages}
          settings={settings}
          onOpenSettings={() => setShowSettings(true)}
        />
      </div>

      {/* Right: Diary editor */}
      <div className="flex-1 flex flex-col min-w-0 select-text">
        <DiaryEditor date={date} content={entry} onChange={setEntry} />
      </div>

      {/* Settings modal */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
