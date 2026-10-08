import { CourseCard } from '../components/CourseCard'
import { PageTitle } from '../components/PageTitle'
import { sortedCourses } from '../lib/content'
import { getRecommendedCourse } from '../lib/progress'
import { useProgress } from '../state/ProgressContext'

export default function Courses() {
  const { progress } = useProgress()
  const recommended = getRecommendedCourse(progress)
  const required = sortedCourses.filter((c) => c.required)
  const optional = sortedCourses.filter((c) => !c.required)

  return (
    <div className="grid gap-8">
      <header>
        <PageTitle>All courses</PageTitle>
        <p className="mt-2 max-w-prose text-xl text-slate-800">
          Your trainer’s recommended order, from first to last. Completed courses stay open so you can return to them at any time.
        </p>
      </header>

      <section aria-labelledby="required-title">
        <h2 id="required-title" className="text-2xl">Required courses</h2>
        <ol className="mt-4 grid gap-5 lg:grid-cols-2">
          {required.map((c, i) => (
            <li key={c.id}>
              <CourseCard course={c} progress={progress} position={i + 1} recommended={c.id === recommended?.id} headingLevel={3} />
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="optional-title">
        <h2 id="optional-title" className="text-2xl">Optional courses</h2>
        <ol className="mt-4 grid gap-5 lg:grid-cols-2">
          {optional.map((c, i) => (
            <li key={c.id}>
              <CourseCard course={c} progress={progress} position={required.length + i + 1} recommended={c.id === recommended?.id} headingLevel={3} />
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
