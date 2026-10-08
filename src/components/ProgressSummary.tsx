import { overallProgress } from '../lib/progress'
import type { Progress } from '../types'
import { ProgressBar } from './ProgressBar'
import { courses } from '../data/courses'

export function ProgressSummary({ progress, headingLevel = 2 }: { progress: Progress; headingLevel?: 2 | 3 }) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3'
  const { done, total, percent } = overallProgress(progress)
  const coursesDone = progress.completedCourseIds.length
  return (
    <section aria-labelledby="overall-progress-title" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <Heading id="overall-progress-title" className="text-xl">
        Overall progress
      </Heading>
      <p className="mt-3 text-5xl font-bold text-brand-800">
        {percent}
        <span className="text-2xl">% complete</span>
      </p>
      <ProgressBar percent={percent} label="Overall progress across all courses" className="mt-3" />
      <p className="mt-3 text-slate-800">
        {done} of {total} steps complete. {coursesDone} of {courses.length} courses completed.
      </p>
    </section>
  )
}
