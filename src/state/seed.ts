import type { Progress } from '../types'

export const emptyProgress = (): Progress => ({
  completedModuleIds: [],
  currentModuleId: null,
  currentCourseId: null,
  completedCourseIds: [],
  quizAttempts: {},
  quizDrafts: {},
  audioPositions: {},
  transcriptOpen: false,
  lastSavedAt: null,
})

/** Demo starting point: Lena finished Reading Module 1 yesterday and paused 47s into Audio Module 2. */
export function demoProgress(): Progress {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(17, 40, 0, 0)
  return {
    ...emptyProgress(),
    completedModuleIds: ['c1-m1'],
    currentModuleId: 'c1-m2',
    currentCourseId: 'c1',
    audioPositions: { 'c1-m2': 47 },
    lastSavedAt: yesterday.toISOString(),
  }
}
