import { courses } from '../data/courses'
import { modules } from '../data/modules'
import { getCourse, getCourseModules, getLearningModules, getModule, sortedCourses } from './content'
import type { Course, CourseStatus, Module, ModuleStatus, Progress, QuizAttempt } from '../types'

export const isModuleComplete = (p: Progress, moduleId: string) => p.completedModuleIds.includes(moduleId)
export const isCourseComplete = (p: Progress, courseId: string) => p.completedCourseIds.includes(courseId)

/** Required courses unlock in order. Optional courses are always open. */
export function isCourseUnlocked(p: Progress, course: Course): boolean {
  if (!course.required) return true
  return courses
    .filter((c) => c.required && c.order < course.order)
    .every((c) => isCourseComplete(p, c.id))
}

/** The earlier required course that still needs finishing, if this course is locked. */
export function blockingCourse(p: Progress, course: Course): Course | undefined {
  if (!course.required) return undefined
  return sortedCourses.find((c) => c.required && c.order < course.order && !isCourseComplete(p, c.id))
}

export function getModuleStatus(p: Progress, m: Module): ModuleStatus {
  if (isModuleComplete(p, m.id)) return 'completed'
  const course = getCourse(m.courseId)
  if (!course || !isCourseUnlocked(p, course)) return 'locked'
  const previous = getCourseModules(m.courseId).find((x) => x.order === m.order - 1)
  if (previous && !isModuleComplete(p, previous.id)) return 'locked'
  const hasDraft = m.type === 'quiz' && !!p.quizDrafts[m.courseId]
  if (p.currentModuleId === m.id || hasDraft) return 'in-progress'
  return 'unlocked'
}

export function courseProgress(p: Progress, courseId: string) {
  const mods = getCourseModules(courseId)
  const done = mods.filter((m) => isModuleComplete(p, m.id)).length
  return { done, total: mods.length, left: mods.length - done, percent: Math.round((done / mods.length) * 100) }
}

export function getCourseStatus(p: Progress, courseId: string): CourseStatus {
  if (isCourseComplete(p, courseId)) return 'completed'
  const mods = getCourseModules(courseId)
  const started =
    mods.some((m) => isModuleComplete(p, m.id)) || mods.some((m) => m.id === p.currentModuleId)
  return started ? 'in-progress' : 'not-started'
}

/** First module in the course that is not yet complete. */
export function frontierModule(p: Progress, courseId: string): Module | undefined {
  return getCourseModules(courseId).find((m) => !isModuleComplete(p, m.id))
}

/** True when every non-quiz module in the course is complete. */
export const isQuizUnlocked = (p: Progress, courseId: string) =>
  getLearningModules(courseId).every((m) => isModuleComplete(p, m.id))

/** Where "Resume learning" goes: the saved module, or the next open step if it was finished. */
export function getResumeTarget(p: Progress): Module | null {
  const current = getModule(p.currentModuleId)
  if (!current) return null
  if (!isModuleComplete(p, current.id)) return current
  return frontierModule(p, current.courseId) ?? null
}

/** The course Lena should work on today. */
export function getRecommendedCourse(p: Progress): Course | null {
  const resume = getResumeTarget(p)
  if (resume) {
    const c = getCourse(resume.courseId)
    if (c && !isCourseComplete(p, c.id)) return c
  }
  const open = sortedCourses.filter((c) => !isCourseComplete(p, c.id) && isCourseUnlocked(p, c))
  return open[0] ?? null
}

/** The step the course's primary button should open. */
export function getCourseNextModule(p: Progress, courseId: string): Module | undefined {
  const current = getModule(p.currentModuleId)
  if (current && current.courseId === courseId && !isModuleComplete(p, current.id)) return current
  return frontierModule(p, courseId)
}

export function latestAttempt(p: Progress, courseId: string): QuizAttempt | undefined {
  const attempts = p.quizAttempts[courseId] ?? []
  return attempts[attempts.length - 1]
}

export function overallProgress(p: Progress) {
  const done = modules.filter((m) => isModuleComplete(p, m.id)).length
  return { done, total: modules.length, percent: Math.round((done / modules.length) * 100) }
}

export function moduleCounts(p: Progress) {
  let completed = 0
  let inProgress = 0
  let notStarted = 0
  for (const m of modules) {
    const s = getModuleStatus(p, m)
    if (s === 'completed') completed++
    else if (s === 'in-progress') inProgress++
    else notStarted++
  }
  return { completed, inProgress, notStarted }
}

export function groupProgress(p: Progress, required: boolean) {
  const group = courses.filter((c) => c.required === required)
  const mods = modules.filter((m) => group.some((c) => c.id === m.courseId))
  const done = mods.filter((m) => isModuleComplete(p, m.id)).length
  return {
    courses: group.length,
    coursesCompleted: group.filter((c) => isCourseComplete(p, c.id)).length,
    modulesDone: done,
    modulesTotal: mods.length,
    percent: mods.length ? Math.round((done / mods.length) * 100) : 0,
  }
}

/** Next course to work on after `courseId`, assuming it is (or is about to be) complete. */
export function nextCourseAfter(p: Progress, courseId: string): Course | null {
  const next: Progress = p.completedCourseIds.includes(courseId)
    ? p
    : { ...p, completedCourseIds: [...p.completedCourseIds, courseId] }
  const open = sortedCourses.filter((c) => c.id !== courseId && !isCourseComplete(next, c.id) && isCourseUnlocked(next, c))
  return open[0] ?? null
}
