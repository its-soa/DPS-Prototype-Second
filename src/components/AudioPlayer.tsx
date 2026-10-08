import { Pause, Play, RotateCcw, RotateCw } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { formatClock, spokenDuration } from '../lib/format'
import { useAnnounce } from '../state/Announcer'
import { Button } from './Button'

interface Props {
  title: string
  durationSeconds: number
  initialPosition: number
  onSavePosition: (seconds: number) => void
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2]

/**
 * Mock audio: playback is simulated with a timer so the prototype needs no audio files.
 * Every control is a native button, range or select, so it works with keyboard and screen readers.
 */
export function AudioPlayer({ title, durationSeconds, initialPosition, onSavePosition }: Props) {
  const { announce } = useAnnounce()
  const [position, setPosition] = useState(Math.min(initialPosition, durationSeconds))
  const [playing, setPlaying] = useState(false)
  const [rate, setRate] = useState(1)
  const positionRef = useRef(position)
  const saveRef = useRef(onSavePosition)
  saveRef.current = onSavePosition

  useEffect(() => {
    positionRef.current = position
  }, [position])

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setPosition((p) => Math.min(durationSeconds, p + 0.25 * rate))
    }, 250)
    return () => window.clearInterval(timer)
  }, [playing, rate, durationSeconds])

  // Autosave every five seconds of playback, on finish, and when leaving the page.
  const fiveSecondMark = Math.floor(position / 5)
  useEffect(() => {
    if (playing) saveRef.current(positionRef.current)
  }, [fiveSecondMark, playing])

  useEffect(() => {
    if (playing && position >= durationSeconds) {
      setPlaying(false)
      saveRef.current(durationSeconds)
      announce('Audio lesson finished. You can open the transcript or mark this module as complete.')
    }
  }, [position, playing, durationSeconds, announce])

  useEffect(() => () => saveRef.current(positionRef.current), [])

  const seekTo = useCallback(
    (seconds: number, message?: string) => {
      const next = Math.max(0, Math.min(durationSeconds, seconds))
      setPosition(next)
      saveRef.current(next)
      if (message) announce(`${message} ${spokenDuration(next)} in.`)
    },
    [announce, durationSeconds],
  )

  const toggle = () => {
    if (playing) {
      setPlaying(false)
      saveRef.current(positionRef.current)
      announce(`Audio paused at ${spokenDuration(positionRef.current)}.`)
    } else {
      if (positionRef.current >= durationSeconds) setPosition(0)
      setPlaying(true)
      announce(`Playing audio lesson: ${title}.`)
    }
  }

  return (
    <section aria-label="Audio lesson player" className="rounded-2xl border-2 border-slate-300 bg-white p-6 shadow-soft">
      <p className="text-sm font-bold text-slate-700">Demo audio: playback is simulated in this prototype.</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button size="lg" onClick={toggle} aria-label={playing ? 'Pause audio lesson' : 'Play audio lesson'}>
          {playing ? <Pause aria-hidden="true" className="h-6 w-6" /> : <Play aria-hidden="true" className="h-6 w-6" />}
          {playing ? 'Pause' : 'Play'}
        </Button>
        <Button variant="secondary" onClick={() => seekTo(positionRef.current - 10, 'Skipped back ten seconds. Now')} aria-label="Skip back ten seconds">
          <RotateCcw aria-hidden="true" className="h-5 w-5" />
          <span aria-hidden="true">10s</span>
        </Button>
        <Button variant="secondary" onClick={() => seekTo(positionRef.current + 10, 'Skipped forward ten seconds. Now')} aria-label="Skip forward ten seconds">
          <span aria-hidden="true">10s</span>
          <RotateCw aria-hidden="true" className="h-5 w-5" />
        </Button>

        <label className="ml-auto flex items-center gap-2 font-bold">
          Playback speed
          <select
            value={rate}
            onChange={(e) => {
              const next = Number(e.target.value)
              setRate(next)
              announce(`Playback speed ${next} times.`)
            }}
            className="min-h-12 rounded-xl border-2 border-slate-400 bg-white px-3 font-bold"
          >
            {SPEEDS.map((s) => (
              <option key={s} value={s}>
                {s}x
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5">
        <label htmlFor="audio-progress" className="sr-only">
          Audio progress
        </label>
        <input
          id="audio-progress"
          type="range"
          min={0}
          max={durationSeconds}
          step={1}
          value={Math.floor(position)}
          aria-valuetext={`${spokenDuration(position)} of ${spokenDuration(durationSeconds)}`}
          onChange={(e) => {
            const next = Number(e.target.value)
            setPosition(next)
            saveRef.current(next)
          }}
          className="h-3 w-full cursor-pointer accent-brand-700"
        />
        <p className="mt-1 flex justify-between text-sm font-bold text-slate-800">
          <span>{formatClock(position)} played</span>
          <span>{formatClock(durationSeconds)} total</span>
        </p>
      </div>
    </section>
  )
}
