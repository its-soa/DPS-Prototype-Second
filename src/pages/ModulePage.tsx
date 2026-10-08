import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Clock, Save, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import { AudioPlayer } from '../components/AudioPlayer'
import { Button, LinkButton } from '../components/Button'
import { ModuleSidebar } from '../components/ModuleSidebar'
import { PageTitle } from '../components/PageTitle'
import { StatusBadge } from '../components/StatusBadge'
import { TranscriptPanel } from '../components/TranscriptPanel'
import { getCourse, getCourseModules, getModule, moduleLabel, modulePath, typeLabel } from '../lib/content'
import { frontierModule, getModuleStatus } from '../lib/progress'
import { useAnnounce } from '../state/Announcer'
import { useProgress } from '../state/ProgressContext'
import type { Course, Module } from '../types'
import { Link } from 'react-router-dom'
import NotFound from './NotFound'

export default function ModulePage() {
  const { courseId, moduleId } = useParams()
  const course = getCourse(courseId)
  const mod = getModule(moduleId)
  const { progress } = useProgress()

  if (!course || !mod || mod.courseId !== course.id) return <NotFound message="That step isn’t part of this course. Your progress is safe." />
  if (mod.type === 'quiz') return <Navigate to={`/courses/${course.id}/quiz`} replace />

  if (getModuleStatus(progress, mod) === 'locked') {
    const frontier = frontierModule(progress, course.id)
    const canGo = !!frontier && getModuleStatus(progress, frontier) !== 'locked'
    return (
      <div className="grid max-w-prose gap-4">
        <PageTitle>This step opens soon</PageTitle>
        <p className="text-lg">
          {moduleLabel(mod)} unlocks once you finish the step before it. Nothing is lost; you can pick up right where the path continues.
        </p>
        <div>
          <LinkButton to={canGo ? modulePath(frontier) : `/courses/${course.id}`}>
            {canGo ? `Go to ${moduleLabel(frontier)}` : 'See the course path'}
          </LinkButton>
        </div>
      </div>
    )
  }

  return <ModuleView course={course} mod={mod} />
}

function ModuleView({ course, mod }: { course: Course; mod: Module }) {
  const { progress, visitModule, completeModule, saveAudioPosition, setTranscriptOpen } = useProgress()
  const { announce } = useAnnounce()
  const location = useLocation()
  const resumed = !!(location.state as { resumed?: boolean } | null)?.resumed
  const [justUnlockedId, setJustUnlockedId] = useState<string | null>(null)

  useEffect(() => {
    visitModule(course.id, mod.id)
  }, [course.id, mod.id, visitModule])

  const mods = getCourseModules(course.id)
  const index = mods.findIndex((m) => m.id === mod.id)
  const next = mods[index + 1]
  const done = progress.completedModuleIds.includes(mod.id)
  const nextOpen = !!next && getModuleStatus(progress, next) !== 'locked'

  const handleComplete = () => {
    if (done) return
    completeModule(mod.id)
    if (next) {
      setJustUnlockedId(next.id)
      announce(
        next.type === 'quiz'
          ? 'Module completed. Next module unlocked: the course quiz.'
          : `Module completed. Next module unlocked: ${moduleLabel(next)}, ${next.title}.`,
      )
    } else {
      announce('Module completed.')
    }
  }

  return (
    <div className="grid gap-6">
      <header>
        <nav aria-label="Breadcrumb" className="text-sm font-bold text-slate-700">
          <Link to="/courses" className="underline">All courses</Link>
          <span aria-hidden="true"> / </span>
          <Link to={`/courses/${course.id}`} className="underline">{course.title}</Link>
        </nav>
        <PageTitle className="mt-2">
          {moduleLabel(mod)}: {mod.title}
        </PageTitle>
        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-bold">
          <span>{typeLabel[mod.type]}</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden="true" className="h-4 w-4" />
            About {mod.estimatedMinutes} minutes
          </span>
          <StatusBadge kind={done ? 'completed' : 'in-progress'} />
        </p>
        <motion.p
          initial={resumed ? { opacity: 0, y: 6 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: resumed ? 0.3 : 0, duration: 0.4 }}
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-brand-500 bg-brand-50 px-4 py-1.5 font-bold text-brand-900"
        >
          <Save aria-hidden="true" className="h-4 w-4" />
          Saved automatically. You’re in the right place.
        </motion.p>
      </header>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid gap-6">
          {mod.type === 'reading' && (
            <article aria-label="Lesson text" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
              <p className="text-xl text-slate-800">{mod.summary}</p>
              {mod.content?.map((s) => (
                <section key={s.heading} className="mt-6">
                  <h2 className="text-2xl">{s.heading}</h2>
                  {s.paragraphs.map((p, i) => (
                    <p key={i} className="mt-3 max-w-prose text-lg">
                      {p}
                    </p>
                  ))}
                </section>
              ))}
            </article>
          )}

          {mod.type === 'audio' && mod.audioSeconds && (
            <>
              <AudioPlayer
                title={mod.title}
                durationSeconds={mod.audioSeconds}
                initialPosition={progress.audioPositions[mod.id] ?? 0}
                onSavePosition={(s) => saveAudioPosition(mod.id, s)}
              />
              {resumed && progress.audioPositions[mod.id] ? (
                <p className="font-bold text-slate-800">Picked up where you paused. Press Play to continue.</p>
              ) : null}
              <TranscriptPanel
                sections={mod.transcript ?? []}
                open={progress.transcriptOpen}
                onToggle={(open) => {
                  setTranscriptOpen(open)
                  announce(open ? 'Transcript opened.' : 'Transcript closed.')
                }}
              />
            </>
          )}

          <section aria-labelledby="actions-title" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 id="actions-title" className="text-xl">When you’re ready</h2>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                variant={done ? 'secondary' : 'primary'}
                aria-disabled={done}
                onClick={handleComplete}
              >
                <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
                {done ? 'Completed' : 'Mark as complete'}
              </Button>

              {next && nextOpen ? (
                <LinkButton to={modulePath(next)} size="lg" variant={done ? 'primary' : 'secondary'}>
                  {next.type === 'quiz' ? 'Next: course quiz' : 'Next module'}
                  <ArrowRight aria-hidden="true" className="h-5 w-5" />
                </LinkButton>
              ) : next ? (
                <Button size="lg" variant="secondary" aria-disabled="true" aria-describedby="next-hint" onClick={(e) => e.preventDefault()}>
                  Next module
                  <ArrowRight aria-hidden="true" className="h-5 w-5" />
                </Button>
              ) : (
                <LinkButton to={`/courses/${course.id}`} size="lg" variant="secondary">Back to course path</LinkButton>
              )}
            </div>
            {!done && next && !nextOpen && (
              <p id="next-hint" className="mt-3 font-bold text-slate-800">
                Mark this module as complete to unlock the next step.
              </p>
            )}
            {done && <p className="mt-3 font-bold text-emerald-950">Module completed. You can return to this at any time.</p>}

            <AnimatePresence>
              {justUnlockedId && (
                <motion.p
                  key={justUnlockedId}
                  initial={{ opacity: 0, scale: 0.96, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border-2 border-brand-600 bg-brand-50 px-4 py-2 font-bold text-brand-900"
                >
                  <Sparkles aria-hidden="true" className="h-5 w-5" />
                  Next module unlocked
                </motion.p>
              )}
            </AnimatePresence>
          </section>
        </div>

        <ModuleSidebar course={course} progress={progress} currentModuleId={mod.id} highlightCurrent={resumed} justUnlockedId={justUnlockedId} />
      </div>
    </div>
  )
}
