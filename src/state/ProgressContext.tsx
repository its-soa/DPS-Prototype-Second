import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { getModule, getQuizModule } from '../lib/content'
import type { Progress, QuizAttempt, QuizStep } from '../types'
import { demoProgress, emptyProgress } from './seed'
import { loadProgress, saveProgress } from './storage'

type Action =
  | { type: 'visit'; courseId: string; moduleId: string }
  | { type: 'completeModule'; moduleId: string }
  | { type: 'audioPosition'; moduleId: string; seconds: number }
  | { type: 'transcript'; open: boolean }
  | { type: 'answer'; courseId: string; questionId: string; value: string }
  | { type: 'step'; courseId: string; step: QuizStep }
  | { type: 'submitQuiz'; attempt: QuizAttempt }
  | { type: 'retake'; courseId: string }
  | { type: 'reset'; next: Progress }

const now = () => new Date().toISOString()

function reducer(state: Progress, action: Action): Progress {
  switch (action.type) {
    case 'visit':
      return { ...state, currentCourseId: action.courseId, currentModuleId: action.moduleId, lastSavedAt: now() }
    case 'completeModule': {
      if (state.completedModuleIds.includes(action.moduleId)) return state
      const m = getModule(action.moduleId)
      return {
        ...state,
        completedModuleIds: [...state.completedModuleIds, action.moduleId],
        currentCourseId: m?.courseId ?? state.currentCourseId,
        currentModuleId: action.moduleId,
        lastSavedAt: now(),
      }
    }
    case 'audioPosition':
      return { ...state, audioPositions: { ...state.audioPositions, [action.moduleId]: action.seconds }, lastSavedAt: now() }
    case 'transcript':
      return { ...state, transcriptOpen: action.open }
    case 'answer': {
      const draft = state.quizDrafts[action.courseId] ?? { step: 'intro', answers: {} }
      return {
        ...state,
        quizDrafts: {
          ...state.quizDrafts,
          [action.courseId]: { ...draft, answers: { ...draft.answers, [action.questionId]: action.value } },
        },
        lastSavedAt: now(),
      }
    }
    case 'step': {
      const draft = state.quizDrafts[action.courseId] ?? { step: 'intro', answers: {} }
      const quizModule = getQuizModule(action.courseId)
      return {
        ...state,
        currentCourseId: action.courseId,
        currentModuleId: quizModule?.id ?? state.currentModuleId,
        quizDrafts: { ...state.quizDrafts, [action.courseId]: { ...draft, step: action.step } },
        lastSavedAt: now(),
      }
    }
    case 'submitQuiz': {
      const { courseId } = action.attempt
      const quizModule = getQuizModule(courseId)
      const drafts = { ...state.quizDrafts }
      delete drafts[courseId]
      return {
        ...state,
        quizAttempts: { ...state.quizAttempts, [courseId]: [...(state.quizAttempts[courseId] ?? []), action.attempt] },
        quizDrafts: drafts,
        completedCourseIds: state.completedCourseIds.includes(courseId)
          ? state.completedCourseIds
          : [...state.completedCourseIds, courseId],
        completedModuleIds:
          quizModule && !state.completedModuleIds.includes(quizModule.id)
            ? [...state.completedModuleIds, quizModule.id]
            : state.completedModuleIds,
        currentCourseId: courseId,
        currentModuleId: quizModule?.id ?? state.currentModuleId,
        lastSavedAt: now(),
      }
    }
    case 'retake': {
      const drafts = { ...state.quizDrafts, [action.courseId]: { step: 'intro' as const, answers: {} } }
      return { ...state, quizDrafts: drafts, lastSavedAt: now() }
    }
    case 'reset':
      return action.next
  }
}

interface ProgressApi {
  progress: Progress
  visitModule: (courseId: string, moduleId: string) => void
  completeModule: (moduleId: string) => void
  saveAudioPosition: (moduleId: string, seconds: number) => void
  setTranscriptOpen: (open: boolean) => void
  setAnswer: (courseId: string, questionId: string, value: string) => void
  setQuizStep: (courseId: string, step: QuizStep) => void
  submitQuiz: (attempt: QuizAttempt) => void
  retakeQuiz: (courseId: string) => void
  resetDemo: (kind: 'demo' | 'fresh') => void
}

const Ctx = createContext<ProgressApi | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, dispatch] = useReducer(reducer, undefined, loadProgress)

  useEffect(() => saveProgress(progress), [progress])

  const visitModule = useCallback((courseId: string, moduleId: string) => dispatch({ type: 'visit', courseId, moduleId }), [])
  const completeModule = useCallback((moduleId: string) => dispatch({ type: 'completeModule', moduleId }), [])
  const saveAudioPosition = useCallback((moduleId: string, seconds: number) => dispatch({ type: 'audioPosition', moduleId, seconds: Math.floor(seconds) }), [])
  const setTranscriptOpen = useCallback((open: boolean) => dispatch({ type: 'transcript', open }), [])
  const setAnswer = useCallback((courseId: string, questionId: string, value: string) => dispatch({ type: 'answer', courseId, questionId, value }), [])
  const setQuizStep = useCallback((courseId: string, step: QuizStep) => dispatch({ type: 'step', courseId, step }), [])
  const submitQuiz = useCallback((attempt: QuizAttempt) => dispatch({ type: 'submitQuiz', attempt }), [])
  const retakeQuiz = useCallback((courseId: string) => dispatch({ type: 'retake', courseId }), [])
  const resetDemo = useCallback(
    (kind: 'demo' | 'fresh') => dispatch({ type: 'reset', next: kind === 'demo' ? demoProgress() : emptyProgress() }),
    [],
  )

  const api = useMemo(
    () => ({ progress, visitModule, completeModule, saveAudioPosition, setTranscriptOpen, setAnswer, setQuizStep, submitQuiz, retakeQuiz, resetDemo }),
    [progress, visitModule, completeModule, saveAudioPosition, setTranscriptOpen, setAnswer, setQuizStep, submitQuiz, retakeQuiz, resetDemo],
  )

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useProgress() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider')
  return ctx
}
