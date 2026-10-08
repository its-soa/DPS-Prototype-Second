import { getCourseModules } from '../lib/content'
import { courseProgress, getModuleStatus } from '../lib/progress'
import type { Course, Progress } from '../types'
import { ModuleListItem } from './ModuleListItem'
import { ProgressBar } from './ProgressBar'

interface Props {
  course: Course
  progress: Progress
  currentModuleId: string
  highlightCurrent?: boolean
  justUnlockedId?: string | null
}

export function ModuleSidebar({ course, progress, currentModuleId, highlightCurrent, justUnlockedId }: Props) {
  const mods = getCourseModules(course.id)
  const { done, total, percent } = courseProgress(progress, course.id)
  return (
    <aside aria-labelledby="path-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <h2 id="path-title" className="text-xl">
        Your path in this course
      </h2>
      <p className="mt-1 text-sm font-bold text-slate-800">
        {done} of {total} steps complete
      </p>
      <ProgressBar percent={percent} label={`${course.title} progress`} className="mt-2" />
      <ol className="mt-4 grid gap-3">
        {mods.map((m, i) => (
          <ModuleListItem
            key={m.id}
            module={m}
            index={i + 1}
            compact
            status={getModuleStatus(progress, m)}
            isCurrent={m.id === currentModuleId}
            highlight={highlightCurrent && m.id === currentModuleId}
            justUnlocked={m.id === justUnlockedId}
          />
        ))}
      </ol>
    </aside>
  )
}
