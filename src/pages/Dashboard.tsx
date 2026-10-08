import { learner } from '../data/learner'
import { CourseCard } from '../components/CourseCard'
import { LinkButton } from '../components/Button'
import { PageTitle } from '../components/PageTitle'
import { ProgressSummary } from '../components/ProgressSummary'
import { ResumeCard } from '../components/ResumeCard'
import { getCourse, sortedCourses } from '../lib/content'
import { courseProgress, frontierModule, getRecommendedCourse, getResumeTarget } from '../lib/progress'
import { useProgress } from '../state/ProgressContext'

export default function Dashboard() {
  const { progress } = useProgress()
  const target = getResumeTarget(progress)
  const recommended = getRecommendedCourse(progress)
  const startModule = recommended ? (frontierModule(progress, recommended.id) ?? null) : null
  const hasSaved = !!target

  return (
    <div className="grid gap-8">
      <header>
        <PageTitle>{hasSaved ? `Welcome back, ${learner.firstName}` : `Welcome, ${learner.firstName}`}</PageTitle>
        <p className="mt-2 text-xl text-slate-800">One place. One sequence. Fewer interruptions.</p>
      </header>

      <ResumeCard progress={progress} target={target} startCourseId={recommended?.id} startModule={startModule} />

      <div className="grid gap-6 md:grid-cols-2">
        <section aria-labelledby="today-title" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 id="today-title" className="text-xl">
            Today’s recommended course
          </h2>
          {recommended ? (
            <>
              <p className="mt-3 text-2xl font-bold text-brand-900">{recommended.title}</p>
              <p className="mt-2 text-slate-800">{recommended.description}</p>
              <p className="mt-3 font-bold">
                {courseProgress(progress, recommended.id).left} steps left · {recommended.estimatedDuration}
              </p>
              <div className="mt-4">
                <LinkButton to={`/courses/${recommended.id}`} variant="secondary">
                  See the course path<span className="sr-only">: {recommended.title}</span>
                </LinkButton>
              </div>
            </>
          ) : (
            <p className="mt-3 text-lg">You have finished everything in your sequence. Well done.</p>
          )}
        </section>
        <ProgressSummary progress={progress} />
      </div>

      <section aria-labelledby="sequence-title">
        <h2 id="sequence-title" className="text-2xl">
          Your course sequence
        </h2>
        <p className="mt-1 text-slate-800">Required courses come first, in order. Optional courses are available whenever you like.</p>
        <ol className="mt-4 grid gap-5 lg:grid-cols-2">
          {sortedCourses.map((c, i) => (
            <li key={c.id}>
              <CourseCard course={getCourse(c.id)!} progress={progress} position={i + 1} recommended={c.id === recommended?.id} headingLevel={3} />
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
