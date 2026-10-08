import { Volume2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAnnounce } from '../state/Announcer'
import { Button } from './Button'

interface Props {
  id: string
  labelledBy: string
  value: string
  onChange: (value: string) => void
}

export function OpenEndedField({ id, labelledBy, value, onChange }: Props) {
  const { announce } = useAnnounce()
  const [status, setStatus] = useState('')
  const hasSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => () => {
    if (hasSpeech) window.speechSynthesis.cancel()
  }, [hasSpeech])

  const hear = () => {
    const text = value.trim()
    if (!text) {
      const msg = 'There is nothing to read yet. Type your answer first, then choose Hear my answer.'
      setStatus(msg)
      announce(msg)
      return
    }
    if (hasSpeech) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(`Your answer: ${text}`)
      utterance.onend = () => setStatus('Finished reading your answer.')
      window.speechSynthesis.speak(utterance)
      setStatus('Reading your answer aloud.')
      announce('Reading your answer aloud.')
    } else {
      // Speech isn't available in this browser: simulate it with a visible, announced message.
      const msg = `Speech is not available in this browser. Your answer reads: ${text}`
      setStatus(msg)
      announce(msg)
    }
  }

  return (
    <div>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className="w-full rounded-xl border-2 border-slate-400 bg-white p-4 text-lg"
        aria-labelledby={labelledBy}
        aria-describedby={`${id}-help`}
      />
      <p id={`${id}-help`} className="mt-1 text-sm text-slate-700">
        Saved automatically as you type. A trainer will review this answer.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <Button variant="secondary" onClick={hear}>
          <Volume2 aria-hidden="true" className="h-5 w-5" />
          Hear my answer
        </Button>
        {/* Visible copy of the status; the announcer handles speech output. */}
        <p className="font-bold text-slate-800">{status}</p>
      </div>
    </div>
  )
}
