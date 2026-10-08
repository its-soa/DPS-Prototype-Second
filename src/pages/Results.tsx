import { PartyPopper, RotateCcw } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, LinkButton } from '../components/Button'
import { PageTitle } from '../components/PageTitle'
import { ResultsSummary } from '../components/ResultsSummary'
import { StatusBadge } from '../components/StatusBadge'
import { getCourse, getQuiz } from '../lib/content'
import { latestAttempt, nextCourseAfter } from '../lib/progress'
import { useAnnounce } from '../state/Announcer'
import { useProgress } from '../state/ProgressContext'
import NotFound from './NotFound'

export default function Results() {
  const { courseId } = useParams()
  const course = getCourse(courseId)
  const quiz = getQuiz(courseId)
  const { progress, retakeQuiz } = useProgress()
  const { announce } = useAnnounce()
  const navigate = useNavigate()

  if (!course || !quiz) return <NotFound message="Those results aren’t available. Your progress is safe." />
  const attempt = latestAttempt(progress, course.id)

  if (!attempt) {
    return (
      <div className="grid max-w-prose gap-4">
        <PageTitle>No results yet</PageTitle>
        <p className="text-lg">You haven’t submitted the quiz for {course.title}. Your results will appear here once you do.</p>
        <div>
          <LinkButton to={`/courses/${course.id}/quiz`}>Go to the quiz</LinkButton>
        </div>
      </div>
    )
  }

  const nextCourse = nextCourseAfter(progress, course.id)

  return (
    <div className="grid gap-6">
      <header>
        <p className="font-bold text-slate-700">{course.title}</p>
        <PageTitle className="mt-1">Course completed</PageTitle>
        <p className="mt-3 flex flex-wrap items-center gap-3">
          <StatusBadge kind="completed" label="Course completed" />
          <StatusBadge kind="pending" />
        </p>
      </header>

      <section
        aria-labelledby="outcome-title"
        className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-6"
      >
        <h2 id="outcome-title" className="flex items-center gap-2 text-2xl text-emerald-950">
          <PartyPopper aria-hidden="true" className="h-6 w-6" />
          {attempt.passed ? 'Well done. You passed the multiple choice section.' : 'Your quiz is submitted.'}
        </h2>
        <p className="mt-2 text-lg text-emerald-950">
          {attempt.passed
            ? `You answered ${attempt.mcqCorrect} of ${attempt.mcqTotal} correctly. Your written answers are with your trainer.`
            : `You answered ${attempt.mcqCorrect} of ${attempt.mcqTotal} correctly, which is below the ${quiz.passMark}% pass mark. You can review the lessons and retake the quiz whenever you like. Your written answers are with your trainer.`}
        </p>
      </section>

      <ResultsSummary attempt={attempt} questions={quiz.questions} />

      <section aria-labelledby="next-title" className="rounded-2xl border-2 border-brand-700 bg-white p-6 shadow-soft">
        <h2 id="next-title" className="text-2xl">Next recommended step</h2>
        {nextCourse ? (
          <>
            <p className="mt-2 text-lg">
              <strong>Next course unlocked:</strong> {nextCourse.title}
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <LinkButton to={`/courses/${nextCourse.id}`} size="lg">
                Start next course<span className="sr-only">: {nextCourse.title}</span>
              </LinkButton>
            </div>
          </>
        ) : (
          <p className="mt-2 text-lg">You have completed every course in your sequence.</p>
        )}
        <div className="mt-4 flex flex-wrap gap-4">
          <Button
            variant="secondary"
            onClick={() => {
              retakeQuiz(course.id)
              announce('Quiz reset. Starting again from the instructions.')
              navigate(`/courses/${course.id}/quiz`)
            }}
          >
            <RotateCcw aria-hidden="true" className="h-5 w-5" />
            {attempt.passed ? 'Retake quiz' : 'Review and retake quiz'}
          </Button>
          <LinkButton to={`/courses/${course.id}`} variant="secondary">Review course lessons</LinkButton>
          <LinkButton to="/progress" variant="secondary">See my progress</LinkButton>
        </div>
      </section>
    </div>
  )
}
