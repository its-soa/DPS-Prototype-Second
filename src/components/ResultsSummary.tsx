import { CheckCircle2, XCircle } from 'lucide-react'
import type { Question, QuizAttempt } from '../types'
import { StatusBadge } from './StatusBadge'

export function ResultsSummary({ attempt, questions }: { attempt: QuizAttempt; questions: Question[] }) {
  const mcq = attempt.results.filter((r) => r.type === 'multiple-choice')
  const open = attempt.results.filter((r) => r.type === 'open-ended')
  const byId = new Map(questions.map((q) => [q.id, q]))

  return (
    <div className="grid gap-6">
      <section aria-labelledby="mcq-results" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 id="mcq-results" className="text-2xl">
          Your multiple choice results
        </h2>
        <p className="mt-2 text-lg">
          <strong>
            {attempt.mcqCorrect} of {attempt.mcqTotal} correct
          </strong>{' '}
          ({attempt.percent}%). These results are final.
        </p>
        <ol className="mt-4 grid gap-3">
          {mcq.map((r, i) => {
            const q = byId.get(r.questionId)!
            const chosen = q.options?.find((o) => o.id === r.learnerAnswer)
            const right = q.options?.find((o) => o.id === q.correctAnswer)
            return (
              <li key={r.questionId} className="rounded-xl border-2 border-slate-200 p-4">
                <p className="flex items-start gap-2 text-lg font-bold">
                  {r.correct ? (
                    <CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-emerald-700" />
                  ) : (
                    <XCircle aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-amber-700" />
                  )}
                  <span>
                    Question {i + 1}: {r.correct ? 'Correct' : 'Not correct'}
                  </span>
                </p>
                <p className="mt-1">{q.prompt}</p>
                <p className="mt-2">
                  <span className="font-bold">Your answer: </span>
                  {chosen ? chosen.label : 'No answer given'}
                </p>
                {!r.correct && (
                  <p>
                    <span className="font-bold">Correct answer: </span>
                    {right?.label}
                  </p>
                )}
              </li>
            )
          })}
        </ol>
      </section>

      <section aria-labelledby="open-results" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="open-results" className="text-2xl">
            Your written answers
          </h2>
          <StatusBadge kind="pending" />
        </div>
        <p className="mt-2 text-lg">Your trainer will read these and share feedback. Nothing more is needed from you right now.</p>
        <ol className="mt-4 grid gap-3">
          {open.map((r, i) => {
            const q = byId.get(r.questionId)!
            return (
              <li key={r.questionId} className="rounded-xl border-2 border-slate-200 p-4">
                <p className="font-bold">
                  Written question {i + 1}: {q.prompt}
                </p>
                <p className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-3">
                  <span className="font-bold">Your answer: </span>
                  {r.learnerAnswer || 'No answer given'}
                </p>
                <p className="mt-2 font-bold text-amber-950">Trainer feedback pending</p>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
