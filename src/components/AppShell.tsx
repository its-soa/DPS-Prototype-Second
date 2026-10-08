import { motion } from 'framer-motion'
import { Compass } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { learner } from '../data/learner'
import { cn } from '../lib/cn'
import { useAnnounce } from '../state/Announcer'
import { useProgress } from '../state/ProgressContext'
import { Button } from './Button'

const nav = [
  { to: '/', label: "Today's course", end: true },
  { to: '/progress', label: 'Progress', end: false },
  { to: '/courses', label: 'All courses', end: false },
]

export function AppShell() {
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)
  const { lastMessage, showOnScreen } = useAnnounce()

  // After navigating, move focus to the page's h1 so screen reader users land on the new content.
  useEffect(() => {
    const heading = document.querySelector<HTMLElement>('main h1')
    document.title = heading?.textContent ? `${heading.textContent} · Pathwise` : 'Pathwise'
    if (previousPath.current === pathname) return
    previousPath.current = pathname
    window.scrollTo(0, 0)
    heading?.focus()
  }, [pathname])

  return (
    <div className={cn('flex min-h-screen flex-col', showOnScreen && lastMessage && 'pb-16')}>
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-white px-4 py-3 font-bold text-brand-800 focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
        onClick={(e) => {
          e.preventDefault()
          document.querySelector<HTMLElement>('main h1')?.focus()
        }}
      >
        Skip to main content
      </a>

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-brand-800">
            <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-xl bg-brand-700 text-white">
              <Compass className="h-5 w-5" />
            </span>
            Pathwise
            <span className="sr-only"> home</span>
          </Link>
          <nav aria-label="Main">
            <ul className="flex flex-wrap items-center gap-1">
              {nav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'inline-flex min-h-12 items-center rounded-xl px-4 font-bold text-slate-800 hover:bg-brand-50',
                        isActive && 'bg-brand-100 text-brand-900 underline decoration-2 underline-offset-8',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-sm font-bold text-slate-700">
            <span className="sr-only">Signed in as </span>
            {learner.name}
          </p>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>

      <Footer />

      {showOnScreen && lastMessage && (
        // Demo aid for sighted audiences: mirrors what the live region announces. Hidden from assistive tech to avoid double speech.
        <div aria-hidden="true" className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-amber-400 bg-ink px-4 py-3 text-center text-white">
          <span className="mr-2 rounded bg-amber-300 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-ink">Screen reader hears</span>
          {lastMessage}
        </div>
      )}
    </div>
  )
}

function Footer() {
  const { resetDemo } = useProgress()
  const { announce, showOnScreen, setShowOnScreen } = useAnnounce()
  const navigate = useNavigate()

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-slate-700 sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>
          <strong className="text-ink">Pathwise</strong> for Discovering Hands. One place. One sequence. Fewer interruptions.
          <br />
          Prototype with sample course content. Progress is saved in this browser only.
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Demo controls">
          <Button
            variant="secondary"
            aria-pressed={showOnScreen}
            onClick={() => {
              setShowOnScreen(!showOnScreen)
              announce(showOnScreen ? 'On-screen announcements hidden.' : 'On-screen announcements shown.')
            }}
          >
            Show announcements on screen
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              resetDemo('demo')
              announce("Demo reset. Lena is back at Audio Module 2 in Foundations of Breast Anatomy.")
              navigate('/')
            }}
          >
            Reset demo
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              resetDemo('fresh')
              announce('All progress cleared. Start today’s course to begin.')
              navigate('/')
            }}
          >
            Clear all progress
          </Button>
        </div>
      </div>
    </footer>
  )
}
