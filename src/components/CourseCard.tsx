import { Layers } from 'lucide-react'
import type { Course } from '../types'
import { getCourseNextModule, courseProgress, getCourseStatus, isCourseUnlocked, blockingCourse } from '../lib/progress'
import { moduleLabel } from '../lib/content'
import { plural } from '../lib/format'
import type { Progress } from '../types'
import { LinkButton } from './Button'
import { ProgressBar } from './ProgressBar'
import { StatusBadge, type BadgeKind } from './StatusBadge'

interface Props {
  course: Course
  progress: Progress
  /** Position in the sequence shown to the learner (1-based). */
  position: number
  /** The one course that should feel primary right now. */
  recommended?: boolean
  headingLevel?: 2 | 3
}

const statusText = { 'not-started': 'Not started', 'in-progress': 'In progress', completed: 'Completed', locked: 'Locked' }

export function CourseCard({ course, progress, position, recommended, headingLevel = 2 }: Props) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3'
  const unlocked = isCourseUnlocked(progress, course)
  const status = unlocked ? getCourseStatus(progress, course.id) : 'locked'
  const { done, total, percent } = courseProgress(progress, course.id)
  const next = getCourseNextModule(progress, course.id)
  const blocker = blockingCourse(progress, course)
  const headingId = `course-${course.id}-title`

  let nextAction: string
  let cta: string
  if (!unlocked) {
    nextAction = `Opens after you complete ${blocker?.title ?? 'the course before it'}.`
    cta = 'View course'
  } else if (status === 'completed') {
    nextAction = 'Completed. You can return to this at any time.'
    cta = 'Review course'
  } else if (status === 'in-progress' && next) {
    nextAction = `Next step: ${moduleLabel(next)}.`
    cta = 'Continue course'
  } else {
    nextAction = 'Ready when you are. Start with the first module.'
    cta = 'Start course'
  }

  return (
    <article
      aria-labelledby={headingId}
      className={
        recommended
          ? 'rounded-2xl border-2 border-brand-600 bg-white p-6 shadow-soft'
          : 'rounded-2xl border border-slate-200 bg-white p-6'
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="flex items-center gap-3 text-sm font-bold text-slate-700">
          <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-base text-brand-900">
            {position}
          </span>
          <span>
            <span className="sr-only">Course </span>
            {course.required ? `Step ${position} of the required sequence` : 'Optional extra'}
          </span>
        </p>
        <StatusBadge
          kind={status as BadgeKind}
          label={`${course.required ? 'Required' : 'Optional'} • ${statusText[status]}`}
        />
      </div>

      <Heading id={headingId} className="mt-3 text-2xl">
        {course.title}
      </Heading>
      <p className="mt-2 text-slate-700">{course.description}</p>

      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-bold text-slate-800">
        <span className="inline-flex items-center gap-1.5">
          <Layers aria-hidden="true" className="h-4 w-4" />
          {plural(total, 'module')} including the quiz
        </span>
        <span>{course.estimatedDuration}</span>
      </p>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-sm font-bold text-slate-800">
          <span>
            {done} of {total} steps complete
          </span>
          <span>{percent}%</span>
        </div>
        <ProgressBar percent={percent} label={`${course.title} progress`} />
      </div>

      <p className="mt-4 font-bold text-slate-800">{nextAction}</p>

      <div className="mt-4">
        <LinkButton to={`/courses/${course.id}`} variant={recommended && unlocked && status !== 'completed' ? 'primary' : 'secondary'}>
          {cta}
          <span className="sr-only">: {course.title}</span>
        </LinkButton>
      </div>
    </article>
  )
}
