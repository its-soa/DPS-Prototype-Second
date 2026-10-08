import { Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageTitle } from '../components/PageTitle'
import { ProgressBar } from '../components/ProgressBar'
import { ProgressSummary } from '../components/ProgressSummary'
import { StatusBadge, type BadgeKind } from '../components/StatusBadge'
import { getCourse, getModule, moduleLabel, modulePath, sortedCourses } from '../lib/content'
import { formatTimestamp } from '../lib/format'
import { courseProgress, getCourseStatus, getResumeTarget, groupProgress, isCourseUnlocked, moduleCounts } from '../lib/progress'
import { useProgress } from '../state/ProgressContext'

export default function ProgressPage() {
  const { progress } = useProgress()
  const counts = moduleCounts(progress)
  const resume = getResumeTarget(progress)
  const last = getModule(progress.currentModuleId)
  const lastCourse = getCourse(progress.currentCourseId ?? undefined)
  const groups = [
    { label: 'Required', ...groupProgress(progress, true) },
    { label: 'Optional', ...groupProgress(progress, false) },
  ]
  const statusText = { 'not-started': 'Not started', 'in-progress': 'In progress', completed: 'Completed', locked: 'Locked' }

  return (
    <div className="grid gap-8">
      <header>
        <PageTitle>Your progress</PageTitle>
        <p className="mt-2 text-xl text-slate-800">Everything you have done so far, in one place.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <ProgressSummary progress={progress} />

        <section aria-labelledby="where-title" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 id="where-title" className="text-xl">Where you are now</h2>
          {resume ? (
            <p className="mt-3 text-lg">
              <strong>Current course and module:</strong>
              <br />
              {getCourse(resume.courseId)?.title} → {moduleLabel(resume)}: {resume.title}
            </p>
          ) : (
            <p className="mt-3 text-lg">You’re between courses. Choose today’s course to continue.</p>
          )}
          <p className="mt-3 flex items-start gap-2 font-bold text-slate-800">
            <Save aria-hidden="true" className="mt-1 h-4 w-4 shrink-0" />
            <span>
              Your last location has been saved.{' '}
              {last && lastCourse ? (
                <>
                  {lastCourse.title} → {moduleLabel(last)}
                </>
              ) : null}
              {progress.lastSavedAt && (
                <>
                  <br />
                  Last saved: <time dateTime={progress.lastSavedAt}>{formatTimestamp(progress.lastSavedAt)}</time>
                </>
              )}
            </span>
          </p>
          {resume && (
            <p className="mt-4">
              <Link to={modulePath(resume)} state={{ resumed: true }} className="font-bold text-brand-800 underline">
                Resume learning<span className="sr-only">: {moduleLabel(resume)}</span>
              </Link>
            </p>
          )}
        </section>
      </div>

      <section aria-labelledby="steps-title">
        <h2 id="steps-title" className="text-2xl">Steps across all courses</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Completed', value: counts.completed },
            { label: 'In progress', value: counts.inProgress },
            { label: 'Not started', value: counts.notStarted },
          ].map((c) => (
            <div key={c.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <dt className="font-bold text-slate-700">{c.label}</dt>
              <dd className="text-4xl font-bold text-brand-800">{c.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="breakdown-title" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 id="breakdown-title" className="text-2xl">Required and optional</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[32rem] border-collapse text-left">
            <caption className="sr-only">Courses and steps completed, split by required and optional</caption>
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th scope="col" className="py-2 pr-4">Type</th>
                <th scope="col" className="py-2 pr-4">Courses completed</th>
                <th scope="col" className="py-2 pr-4">Steps completed</th>
                <th scope="col" className="py-2">Progress</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g.label} className="border-b border-slate-200">
                  <th scope="row" className="py-3 pr-4">{g.label}</th>
                  <td className="py-3 pr-4">{g.coursesCompleted} of {g.courses}</td>
                  <td className="py-3 pr-4">{g.modulesDone} of {g.modulesTotal}</td>
                  <td className="py-3">{g.percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="by-course-title">
        <h2 id="by-course-title" className="text-2xl">Course by course</h2>
        <ol className="mt-4 grid gap-3">
          {sortedCourses.map((c) => {
            const unlocked = isCourseUnlocked(progress, c)
            const status = unlocked ? getCourseStatus(progress, c.id) : 'locked'
            const { done, total, percent } = courseProgress(progress, c.id)
            return (
              <li key={c.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg">
                    <Link to={`/courses/${c.id}`} className="underline">{c.title}</Link>
                  </h3>
                  <StatusBadge kind={status as BadgeKind} label={`${c.required ? 'Required' : 'Optional'} • ${statusText[status]}`} />
                </div>
                <p className="mt-2 text-sm font-bold">{done} of {total} steps complete ({percent}%)</p>
                <ProgressBar percent={percent} label={`${c.title} progress`} className="mt-1" />
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
