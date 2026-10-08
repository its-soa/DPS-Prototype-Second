import { ArrowLeft, ArrowRight, Send } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, LinkButton } from '../components/Button'
import { PageTitle } from '../components/PageTitle'
import { QuizQuestionCard } from '../components/QuizQuestionCard'
import { getCourse, getQuiz, getQuizModule, moduleLabel, modulePath, getLearningModules } from '../lib/content'
import { gradeQuiz } from '../lib/grading'
import { frontierModule, isCourseUnlocked, isQuizUnlocked, nextCourseAfter } from '../lib/progress'
import { plural } from '../lib/format'
import { useAnnounce } from '../state/Announcer'
import { useProgress } from '../state/ProgressContext'
import type { Course, Quiz, QuizDraft } from '../types'
import NotFound from './NotFound'

export default function QuizPage() {
  const { courseId } = useParams()
  const course = getCourse(courseId)
  const quiz = getQuiz(courseId)
  const { progress } = useProgress()

  if (!course || !quiz) return <NotFound message="That quiz isn’t available. Your progress is safe." />

  if (!isCourseUnlocked(progress, course) || !isQuizUnlocked(progress, course.id)) {
    const frontier = frontierModule(progress, course.id)
    const done = getLearningModules(course.id).filter((m) => progress.completedModuleIds.includes(m.id)).length
    const total = getLearningModules(course.id).length
    return (
      <div className="grid max-w-prose gap-4">
        <PageTitle>The quiz opens after the lessons</PageTitle>
        <p className="text-lg">
          You have completed {done} of {plural(total, 'lesson')}. Finish the remaining lessons and the quiz will unlock automatically.
        </p>
        <div>
          <LinkButton to={frontier && isCourseUnlocked(progress, course) ? modulePath(frontier) : `/courses/${course.id}`}>
            {frontier && isCourseUnlocked(progress, course) ? `Continue: ${moduleLabel(frontier)}` : 'See the course path'}
          </LinkButton>
        </div>
      </div>
    )
  }

  return <QuizView course={course} quiz={quiz} />
}

const EMPTY: QuizDraft = { step: 'intro', answers: {} }

function QuizView({ course, quiz }: { course: Course; quiz: Quiz }) {
  const { progress, setAnswer, setQuizStep, submitQuiz } = useProgress()
  const { announce } = useAnnounce()
  const navigate = useNavigate()
  const draft = progress.quizDrafts[course.id] ?? EMPTY
  const { step, answers } = draft
  const total = quiz.questions.length
  const quizModule = getQuizModule(course.id)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const previousStep = useRef(step)

  // Moving between steps keeps the screen reader oriented by focusing the new step's heading.
  useEffect(() => {
    if (previousStep.current !== step) {
      previousStep.current = step
      headingRef.current?.focus()
    }
  }, [step])

  const go = (next: QuizDraft['step']) => setQuizStep(course.id, next)
  const answered = quiz.questions.filter((q) => (answers[q.id] ?? '').trim()).length

  const handleAnswer = (questionId: string, value: string) => {
    setAnswer(course.id, questionId, value)
    const q = quiz.questions.find((x) => x.id === questionId)
    if (q?.type === 'multiple-choice') {
      const i = q.options!.findIndex((o) => o.id === value)
      const letter = String.fromCharCode(65 + i)
      announce(`Option ${letter} selected. ${value === q.correctAnswer ? q.feedbackCorrect : q.feedbackIncorrect}`)
    }
  }

  const submit = () => {
    const attempt = gradeQuiz(quiz, answers)
    const nextCourse = nextCourseAfter(progress, course.id)
    submitQuiz(attempt)
    announce(
      `Quiz submitted. Course completed. You answered ${attempt.mcqCorrect} of ${attempt.mcqTotal} multiple choice questions correctly. ` +
        `Your written answers are awaiting trainer feedback. ` +
        (nextCourse ? `Next course unlocked: ${nextCourse.title}.` : 'You have completed every course.'),
    )
    navigate(`/results/${course.id}`)
  }

  const header = (
    <header>
      <p className="font-bold text-slate-700">{course.title}</p>
      <PageTitle className="mt-1">Course quiz</PageTitle>
    </header>
  )

  if (step === 'intro') {
    const hasStarted = answered > 0
    return (
      <div className="grid max-w-3xl gap-6">
        {header}
        <section aria-labelledby="quiz-intro" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
          <h2 id="quiz-intro" className="text-2xl" ref={headingRef} tabIndex={-1}>
            Before you begin
          </h2>
          <ul className="mt-4 grid list-disc gap-2 pl-6 text-lg">
            <li>{plural(total, 'question')}: {quiz.questions.filter((q) => q.type === 'multiple-choice').length} multiple choice and {quiz.questions.filter((q) => q.type === 'open-ended').length} written.</li>
            <li>For multiple choice, you hear whether your answer is right as soon as you choose it. You can change your answer.</li>
            <li>For written answers, use “Hear my answer” to have your response read back before you move on.</li>
            <li>Your trainer reviews written answers, so those results arrive later.</li>
            <li>Your answers are saved automatically. You can leave and return at any time.</li>
          </ul>
          <div className="mt-6">
            <Button size="lg" onClick={() => go(0)}>
              {hasStarted ? 'Continue quiz' : 'Start quiz'}
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </Button>
            {hasStarted && <p className="mt-3 font-bold">You have answered {answered} of {total} so far.</p>}
          </div>
        </section>
      </div>
    )
  }

  if (step === 'review') {
    const unanswered = total - answered
    return (
      <div className="grid max-w-3xl gap-6">
        {header}
        <section aria-labelledby="review-title" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
          <h2 id="review-title" ref={headingRef} tabIndex={-1} className="text-2xl">
            Review your answers
          </h2>
          <p className="mt-2 text-lg">
            {unanswered === 0
              ? 'Every question has an answer. Change any of them, or submit when you are ready.'
              : `${plural(unanswered, 'question')} still ${unanswered === 1 ? 'has' : 'have'} no answer. You can go back to answer, or submit as it is.`}
          </p>
          <ol className="mt-5 grid gap-3">
            {quiz.questions.map((q, i) => {
              const a = answers[q.id] ?? ''
              const text = q.type === 'multiple-choice' ? (q.options?.find((o) => o.id === a)?.label ?? '') : a
              return (
                <li key={q.id} className="rounded-xl border-2 border-slate-200 p-4">
                  <p className="font-bold">
                    Question {i + 1} ({q.type === 'multiple-choice' ? 'multiple choice' : 'written'}): {q.prompt}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap">
                    <span className="font-bold">Your answer: </span>
                    {text.trim() ? text : 'Not answered yet'}
                  </p>
                  <div className="mt-3">
                    <Button variant="secondary" onClick={() => go(i)}>
                      Change answer<span className="sr-only"> for question {i + 1}</span>
                    </Button>
                  </div>
                </li>
              )
            })}
          </ol>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button variant="secondary" size="lg" onClick={() => go(total - 1)}>
              <ArrowLeft aria-hidden="true" className="h-5 w-5" />
              Back to last question
            </Button>
            <Button size="lg" onClick={submit}>
              <Send aria-hidden="true" className="h-5 w-5" />
              Submit quiz
            </Button>
          </div>
        </section>
      </div>
    )
  }

  const q = quiz.questions[step]
  return (
    <div className="grid max-w-3xl gap-6">
      {header}
      <QuizQuestionCard
        ref={headingRef}
        key={q.id}
        question={q}
        number={step + 1}
        total={total}
        answer={answers[q.id] ?? ''}
        onAnswer={(v) => handleAnswer(q.id, v)}
      />
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="secondary" size="lg" onClick={() => go(step === 0 ? 'intro' : step - 1)}>
          <ArrowLeft aria-hidden="true" className="h-5 w-5" />
          {step === 0 ? 'Back to instructions' : 'Previous question'}
        </Button>
        <Button size="lg" onClick={() => go(step === total - 1 ? 'review' : step + 1)}>
          {step === total - 1 ? 'Review answers' : 'Next question'}
          <ArrowRight aria-hidden="true" className="h-5 w-5" />
        </Button>
        <p className="font-bold text-slate-800" aria-hidden={!quizModule}>
          Saved automatically
        </p>
      </div>
    </div>
  )
}
