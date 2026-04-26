import { useEffect, useRef } from 'react'
import { saveEntry } from '../lib/storage'

interface Props {
  date: string
  content: string
  onChange: (content: string) => void
}

export default function DiaryEditor({ date, content, onChange }: Props) {
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savedRef = useRef(true)

  const handleChange = (value: string): void => {
    onChange(value)
    savedRef.current = false
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveEntry(date, value)
      savedRef.current = true
    }, 1000)
  }

  // Flush unsaved changes on unmount
  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current)
        if (!savedRef.current) {
          saveEntry(date, content)
        }
      }
    }
  }, [date, content])

  const formattedDate = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="flex flex-col h-full px-10 py-8">
      <div className="mb-6 flex-shrink-0">
        <p className="text-[#c9a96e] text-xs font-medium tracking-widest uppercase">
          {formattedDate}
        </p>
        <div className="mt-3 h-px bg-[#2a2a38]" />
      </div>

      <textarea
        className="flex-1 w-full bg-transparent text-[#d8d8e8] text-[15px] leading-7 resize-none outline-none placeholder-[#2e2e40] font-serif"
        placeholder="What's on your mind today..."
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        spellCheck
        autoFocus
      />
    </div>
  )
}
