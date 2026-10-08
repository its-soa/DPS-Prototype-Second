import { Clock } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { Button, LinkButton } from '../components/Button'
import { ModuleListItem } from '../components/ModuleListItem'
import { PageTitle } from '../components/PageTitle'
import { ProgressBar } from '../components/ProgressBar'
import { StatusBadge, type BadgeKind } from '../components/StatusBadge'
import { getCourse, getCourseModules, moduleLabel, modulePath } from '../lib/content'
import { plural } from '../lib/format'
import { blockingCourse, courseProgress, getCourseNextModule, getCourseStatus, getModuleStatus, isCourseUnlocked } from '../lib/progress'
import { useProgress } from '../state/ProgressContext'
import NotFound from './NotFound'

export default function CourseOverview() {
  const { courseId } = useParams()
  const course = getCourse(courseId)
  const { progress } = useProgress()
  if (!course) return <NotFound message="That course isn’t in your list. Your progress is safe." />

  const mods = getCourseModules(course.id)
  const unlocked = isCourseUnlocked(progress, course)
  const status = unlocked ? getCourseStatus(progress, course.id) : 'locked'
  const { done, total, percent } = courseProgress(progress, course.id)
  const next = getCourseNextModule(progress, course.id)
  const blocker = blockingCourse(progress, course)
  const statusLabel = { 'not-started': 'Not started', 'in-progress': 'In progress', completed: 'Completed', locked: 'Locked' }[status]

  return (
    <div className="grid gap-8">
      <header>
        <p className="font-bold text-slate-700">{course.required ? 'Required course' : 'Optional course'}</p>
        <PageTitle className="mt-1">{course.title}</PageTitle>
        <p className="mt-3 max-w-prose text-xl text-slate-800">{course.description}</p>
        <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-bold">
          <StatusBadge kind={status as BadgeKind} label={`${course.required ? 'Required' : 'Optional'} • ${statusLabel}`} />
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden="true" className="h-4 w-4" />
            {course.estimatedDuration}
          </span>
          <span>{plural(total, 'step')}</span>
        </p>
        <div className="mt-4 max-w-xl">
          <div className="mb-1 flex justify-between text-sm font-bold">
            <span>{done} of {total} steps complete</span>
            <span>{percent}%</span>
          </div>
          <ProgressBar percent={percent} label={`${course.title} progress`} />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          {unlocked && next && status !== 'completed' && (
            <LinkButton to={modulePath(next)} size="lg" state={status === 'in-progress' ? { resumed: true } : undefined}>
              {status === 'in-progress' ? `Continue: ${moduleLabel(next)}` : `Start: ${moduleLabel(next)}`}
            </LinkButton>
          )}
          {unlocked && status === 'completed' && (
            <>
              <LinkButton to={`/results/${course.id}`} size="lg">View results</LinkButton>
              {mods[0] && <LinkButton to={modulePath(mods[0])} variant="secondary" size="lg">Review from the start</LinkButton>}
            </>
          )}
          {!unlocked && (
            <>
              <Button size="lg" aria-disabled="true" aria-describedby="locked-reason" onClick={(e) => e.preventDefault()}>
                Start course
              </Button>
              <p id="locked-reason" className="font-bold">
                This course opens after you complete {blocker?.title ?? 'the course before it'}.
              </p>
            </>
          )}
        </div>
      </header>

      <section aria-labelledby="path-title">
        <h2 id="path-title" className="text-2xl">Your path, step by step</h2>
        <p className="mt-1 text-slate-800">Each step opens when you finish the one before it. You can revisit completed steps at any time.</p>
        <ol className="mt-4 grid gap-3">
          {mods.map((m, i) => (
            <ModuleListItem key={m.id} module={m} index={i + 1} status={getModuleStatus(progress, m)} isCurrent={next?.id === m.id && status === 'in-progress'} />
          ))}
        </ol>
      </section>

      <section aria-labelledby="terms-title" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 id="terms-title" className="text-2xl">New vocabulary in this course</h2>
        <dl className="mt-4 grid gap-4 md:grid-cols-2">
          {course.terms.map((t) => (
            <div key={t.term}>
              <dt className="font-bold text-brand-900">{t.term}</dt>
              <dd className="text-slate-800">{t.definition}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
