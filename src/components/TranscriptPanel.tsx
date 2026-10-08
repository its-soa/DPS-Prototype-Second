import { FileText } from 'lucide-react'
import { useRef } from 'react'
import type { TextSection } from '../types'
import { Button } from './Button'

interface Props {
  sections: TextSection[]
  open: boolean
  onToggle: (open: boolean) => void
}

export function TranscriptPanel({ sections, open, onToggle }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  return (
    <div className="mt-6">
      <Button
        variant="secondary"
        aria-expanded={open}
        aria-controls="transcript-panel"
        onClick={() => {
          const next = !open
          onToggle(next)
          // Move focus into the transcript when it opens so a screen reader starts reading it.
          if (next) window.setTimeout(() => headingRef.current?.focus(), 0)
        }}
      >
        <FileText aria-hidden="true" className="h-5 w-5" />
        {open ? 'Close transcript' : 'Open transcript'}
      </Button>

      <section
        id="transcript-panel"
        aria-labelledby="transcript-heading"
        hidden={!open}
        className="mt-4 rounded-2xl border-2 border-slate-300 bg-white p-6"
      >
        <h2 id="transcript-heading" ref={headingRef} tabIndex={-1} className="text-xl">
          Transcript
        </h2>
        {sections.map((s) => (
          <div key={s.heading} className="mt-4">
            <h3 className="text-lg">{s.heading}</h3>
            {s.paragraphs.map((p, i) => (
              <p key={i} className="mt-2 max-w-prose text-lg">
                {p}
              </p>
            ))}
          </div>
        ))}
      </section>
    </div>
  )
}
