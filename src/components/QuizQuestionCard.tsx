import { CheckCircle2, Info } from 'lucide-react'
import { forwardRef } from 'react'
import { cn } from '../lib/cn'
import type { Question } from '../types'
import { MultipleChoiceOption } from './MultipleChoiceOption'
import { OpenEndedField } from './OpenEndedField'

interface Props {
  question: Question
  number: number
  total: number
  answer: string
  onAnswer: (value: string) => void
}

export const QuizQuestionCard = forwardRef<HTMLHeadingElement, Props>(function QuizQuestionCard(
  { question, number, total, answer, onAnswer },
  headingRef,
) {
  const isMcq = question.type === 'multiple-choice'
  const selected = question.options?.find((o) => o.id === answer)
  const correct = isMcq && answer === question.correctAnswer

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
      <h2 ref={headingRef} tabIndex={-1} className="text-sm font-bold uppercase tracking-wide text-slate-700">
        Question {number} of {total}
        <span className="sr-only">, {isMcq ? 'multiple choice' : 'written answer'}</span>
      </h2>

      {isMcq ? (
        <fieldset className="mt-3">
          <legend className="text-2xl font-bold">{question.prompt}</legend>
          <p className="mt-2 text-slate-700">{question.hint}</p>
          <div className="mt-5 grid gap-3">
            {question.options?.map((o, i) => (
              <MultipleChoiceOption
                key={o.id}
                name={question.id}
                optionId={o.id}
                letter={String.fromCharCode(65 + i)}
                label={o.label}
                selected={answer === o.id}
                onSelect={() => onAnswer(o.id)}
              />
            ))}
          </div>

          {selected && (
            <p
              className={cn(
                'mt-5 flex items-start gap-3 rounded-xl border-2 p-4 text-lg font-bold',
                correct ? 'border-emerald-500 bg-emerald-50 text-emerald-950' : 'border-amber-500 bg-amber-50 text-amber-950',
              )}
            >
              {correct ? <CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0" /> : <Info aria-hidden="true" className="mt-1 h-5 w-5 shrink-0" />}
              <span>
                <span className="sr-only">Feedback: </span>
                {correct ? question.feedbackCorrect : question.feedbackIncorrect}
              </span>
            </p>
          )}
        </fieldset>
      ) : (
        <div className="mt-3">
          <p id={`${question.id}-prompt`} className="text-2xl font-bold">
            {question.prompt}
          </p>
          <p className="mb-4 mt-2 text-slate-700">{question.hint}</p>
          <OpenEndedField id={`${question.id}-answer`} labelledBy={`${question.id}-prompt`} value={answer} onChange={onAnswer} />
        </div>
      )}
    </div>
  )
})
