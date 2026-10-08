import type { QuestionResult, Quiz, QuizAttempt } from '../types'

export function gradeQuiz(quiz: Quiz, answers: Record<string, string>): QuizAttempt {
  const results: QuestionResult[] = quiz.questions.map((q) => {
    const learnerAnswer = answers[q.id] ?? ''
    if (q.type === 'multiple-choice') {
      const correct = learnerAnswer === q.correctAnswer
      return {
        questionId: q.id,
        type: q.type,
        learnerAnswer,
        correct: learnerAnswer ? correct : false,
        feedback: correct ? (q.feedbackCorrect ?? '') : (q.feedbackIncorrect ?? ''),
        trainerReviewStatus: 'not-applicable',
      }
    }
    return {
      questionId: q.id,
      type: q.type,
      learnerAnswer,
      correct: null,
      feedback: 'Trainer feedback pending',
      trainerReviewStatus: 'pending',
    }
  })
  const mcq = results.filter((r) => r.type === 'multiple-choice')
  const mcqCorrect = mcq.filter((r) => r.correct).length
  const percent = mcq.length ? Math.round((mcqCorrect / mcq.length) * 100) : 100
  return {
    id: `${quiz.courseId}-attempt-${Date.now()}`,
    courseId: quiz.courseId,
    submittedAt: new Date().toISOString(),
    mcqCorrect,
    mcqTotal: mcq.length,
    percent,
    passed: percent >= quiz.passMark,
    results,
  }
}
