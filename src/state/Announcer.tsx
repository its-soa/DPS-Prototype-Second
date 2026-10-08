import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { loadShowAnnouncements, saveShowAnnouncements } from './storage'

type Politeness = 'polite' | 'assertive'

interface AnnouncerApi {
  announce: (message: string, politeness?: Politeness) => void
  lastMessage: string
  showOnScreen: boolean
  setShowOnScreen: (on: boolean) => void
}

const Ctx = createContext<AnnouncerApi | null>(null)

/**
 * One polite and one assertive live region live for the whole session. Messages are cleared and re-set
 * on a short delay so repeating the same sentence is still announced.
 */
export function AnnouncerProvider({ children }: { children: ReactNode }) {
  const [polite, setPolite] = useState('')
  const [assertive, setAssertive] = useState('')
  const [lastMessage, setLastMessage] = useState('')
  const [showOnScreen, setShow] = useState(loadShowAnnouncements)
  const toggle = useRef(false)

  const announce = useCallback((message: string, politeness: Politeness = 'polite') => {
    const set = politeness === 'assertive' ? setAssertive : setPolite
    set('')
    setLastMessage(message)
    window.setTimeout(() => {
      toggle.current = !toggle.current
      set(toggle.current ? message : `${message} `)
    }, 60)
  }, [])

  const setShowOnScreen = useCallback((on: boolean) => {
    setShow(on)
    saveShowAnnouncements(on)
  }, [])

  const api = useMemo(() => ({ announce, lastMessage, showOnScreen, setShowOnScreen }), [announce, lastMessage, showOnScreen, setShowOnScreen])

  return (
    <Ctx.Provider value={api}>
      {children}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{polite}</div>
      <div className="sr-only" role="alert" aria-live="assertive" aria-atomic="true">{assertive}</div>
    </Ctx.Provider>
  )
}

export function useAnnounce() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAnnounce must be used inside AnnouncerProvider')
  return ctx
}
