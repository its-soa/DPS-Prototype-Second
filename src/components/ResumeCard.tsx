import { motion } from 'framer-motion'
import { Play, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { learner } from '../data/learner'
import { getCourse, moduleLabel, modulePath, typeLabel } from '../lib/content'
import { formatClock, formatTimestamp } from '../lib/format'
import { courseProgress } from '../lib/progress'
import { useAnnounce } from '../state/Announcer'
import type { Module, Progress } from '../types'
import { Button } from './Button'

interface Props {
  progress: Progress
  target: Module | null
  /** When there is nothing to resume: the course to start today. */
  startCourseId?: string | null
  startModule?: Module | null
}

export function ResumeCard({ progress, target, startCourseId, startModule }: Props) {
  const navigate = useNavigate()
  const { announce } = useAnnounce()

  const resuming = !!target
  const module = target ?? startModule ?? null
  const course = getCourse(target?.courseId ?? startCourseId ?? undefined)

  if (!course || !module) {
    return (
      <section aria-labelledby="resume-title" className="rounded-3xl border-2 border-emerald-500 bg-white p-8 shadow-soft">
        <h2 id="resume-title" className="text-2xl">
          You have completed every course
        </h2>
        <p className="mt-2 text-lg text-slate-800">Everything in your sequence is complete. You can return to any lesson at any time.</p>
      </section>
    )
  }

  const audioAt = progress.audioPositions[module.id]
  const left = courseProgress(progress, course.id).left

  const go = () => {
    if (resuming) {
      announce(`Welcome back, ${learner.firstName}. Resuming ${moduleLabel(module)} in ${course.title}.`)
      navigate(modulePath(module), { state: { resumed: true } })
    } else {
      announce(`Starting ${course.title}, ${moduleLabel(module)}.`)
      navigate(modulePath(module))
    }
  }

  return (
    <motion.section
      aria-labelledby="resume-title"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border-2 border-brand-700 bg-gradient-to-br from-brand-50 to-white p-6 shadow-soft sm:p-8"
    >
      <h2 id="resume-title" className="text-2xl">
        {resuming ? 'Continue where you left off' : "Start today's course"}
      </h2>

      <p className="mt-4 text-lg text-slate-800">
        <span className="font-bold">{resuming ? 'Resume: ' : 'Next: '}</span>
        {course.title} → {moduleLabel(module)}
      </p>
      <p className="mt-1 text-xl font-bold text-brand-900">{module.title}</p>

      <dl className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-3">
        <div>
          <dt className="text-sm font-bold text-slate-700">Step type</dt>
          <dd className="text-lg">
            {typeLabel[module.type]}
            {resuming && module.type === 'audio' && audioAt ? ` · paused at ${formatClock(audioAt)}` : ''}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-bold text-slate-700">Steps left in this course</dt>
          <dd className="text-lg">{left}</dd>
        </div>
        <div>
          <dt className="text-sm font-bold text-slate-700">Last activity</dt>
          <dd className="text-lg">
            {progress.lastSavedAt ? <time dateTime={progress.lastSavedAt}>{formatTimestamp(progress.lastSavedAt)}</time> : 'Nothing yet'}
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button size="lg" onClick={go}>
          <Play aria-hidden="true" className="h-5 w-5" />
          {resuming ? 'Resume learning' : "Start today's course"}
          <span className="sr-only">
            : {moduleLabel(module)}, {course.title}
          </span>
        </Button>
        {resuming && (
          <p className="inline-flex items-center gap-2 text-sm font-bold text-slate-800">
            <Save aria-hidden="true" className="h-4 w-4" />
            Your last location has been saved.
          </p>
        )}
      </div>
    </motion.section>
  )
}
