export type ModuleType = 'reading' | 'audio' | 'quiz'
export type ModuleStatus = 'completed' | 'in-progress' | 'unlocked' | 'locked'
export type CourseStatus = 'not-started' | 'in-progress' | 'completed'

export interface TextSection {
  heading: string
  paragraphs: string[]
}

export interface Term {
  term: string
  definition: string
}

export interface Learner {
  id: string
  name: string
  firstName: string
  screenReaderPreference: string
}

/** Static course content. `status` is derived from Progress at runtime. */
export interface Course {
  id: string
  title: string
  description: string
  required: boolean
  order: number
  estimatedDuration: string
  terms: Term[]
}

/** Static module content. `status` / `locked` are derived from Progress at runtime. */
export interface Module {
  id: string
  courseId: string
  title: string
  type: ModuleType
  order: number
  estimatedMinutes: number
  summary: string
  content?: TextSection[]
  transcript?: TextSection[]
  audioSeconds?: number
}

export type QuestionType = 'multiple-choice' | 'open-ended'

export interface QuestionOption {
  id: string
  label: string
}

export interface Question {
  id: string
  type: QuestionType
  prompt: string
  hint?: string
  options?: QuestionOption[]
  correctAnswer?: string
  feedbackCorrect?: string
  feedbackIncorrect?: string
}

export interface Quiz {
  id: string
  courseId: string
  passMark: number
  questions: Question[]
}

export type TrainerReviewStatus = 'pending' | 'not-applicable'

export interface QuestionResult {
  questionId: string
  type: QuestionType
  learnerAnswer: string
  correct: boolean | null
  feedback: string
  trainerReviewStatus: TrainerReviewStatus
}

export interface QuizAttempt {
  id: string
  courseId: string
  submittedAt: string
  mcqCorrect: number
  mcqTotal: number
  percent: number
  passed: boolean
  results: QuestionResult[]
}

export type QuizStep = 'intro' | 'review' | number

export interface QuizDraft {
  step: QuizStep
  answers: Record<string, string>
}

export interface Progress {
  completedModuleIds: string[]
  /** Last visited module. Together with currentCourseId this is the "saved location". */
  currentModuleId: string | null
  currentCourseId: string | null
  completedCourseIds: string[]
  quizAttempts: Record<string, QuizAttempt[]>
  quizDrafts: Record<string, QuizDraft>
  audioPositions: Record<string, number>
  transcriptOpen: boolean
  lastSavedAt: string | null
}
