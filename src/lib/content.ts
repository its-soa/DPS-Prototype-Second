import { courses } from '../data/courses'
import { modules } from '../data/modules'
import { quizzes } from '../data/quizzes'
import type { Course, Module, ModuleType, Quiz } from '../types'

export const sortedCourses: Course[] = [...courses].sort((a, b) => {
  if (a.required !== b.required) return a.required ? -1 : 1
  return a.order - b.order
})

export const getCourse = (id?: string) => courses.find((c) => c.id === id)
export const getModule = (id?: string | null) => modules.find((m) => m.id === id)
export const getQuiz = (courseId?: string): Quiz | undefined => quizzes.find((q) => q.courseId === courseId)

export const getCourseModules = (courseId: string): Module[] =>
  modules.filter((m) => m.courseId === courseId).sort((a, b) => a.order - b.order)

export const getLearningModules = (courseId: string) => getCourseModules(courseId).filter((m) => m.type !== 'quiz')

export const getQuizModule = (courseId: string) => getCourseModules(courseId).find((m) => m.type === 'quiz')

export const totalModules = modules.length

export const typeLabel: Record<ModuleType, string> = {
  reading: 'PDF / Reading',
  audio: 'Audio / MP3',
  quiz: 'Quiz',
}

/** "Audio Module 2", "Reading Module 1", "Course quiz". */
export function moduleLabel(m: Module): string {
  if (m.type === 'quiz') return 'Course quiz'
  return `${m.type === 'audio' ? 'Audio' : 'Reading'} Module ${m.order}`
}

export const modulePath = (m: Module) =>
  m.type === 'quiz' ? `/courses/${m.courseId}/quiz` : `/courses/${m.courseId}/modules/${m.id}`
