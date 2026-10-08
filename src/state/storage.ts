import type { Progress } from '../types'
import { demoProgress } from './seed'

const KEY = 'pathwise:v1:progress'
const ANNOUNCE_KEY = 'pathwise:v1:show-announcements'

export function loadProgress(): Progress {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Progress
      if (parsed && Array.isArray(parsed.completedModuleIds) && Array.isArray(parsed.completedCourseIds)) {
        return parsed
      }
    }
  } catch {
    /* storage unavailable or corrupt: fall through to the demo state */
  }
  return demoProgress()
}

export function saveProgress(p: Progress) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    /* the prototype keeps working in memory if storage is blocked */
  }
}

export function loadShowAnnouncements(): boolean {
  try {
    return window.localStorage.getItem(ANNOUNCE_KEY) === '1'
  } catch {
    return false
  }
}

export function saveShowAnnouncements(on: boolean) {
  try {
    window.localStorage.setItem(ANNOUNCE_KEY, on ? '1' : '0')
  } catch {
    /* ignore */
  }
}
