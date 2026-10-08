import { CheckCircle2, CircleDashed, CircleDot, Clock, Lock, LockOpen, type LucideIcon } from 'lucide-react'
import { cn } from '../lib/cn'

export type BadgeKind = 'completed' | 'in-progress' | 'unlocked' | 'locked' | 'not-started' | 'pending'

const styles: Record<BadgeKind, { icon: LucideIcon; label: string; classes: string }> = {
  completed: { icon: CheckCircle2, label: 'Completed', classes: 'border-emerald-400 bg-emerald-50 text-emerald-950' },
  'in-progress': { icon: CircleDot, label: 'In progress', classes: 'border-indigo-400 bg-indigo-50 text-indigo-950' },
  unlocked: { icon: LockOpen, label: 'Unlocked', classes: 'border-brand-500 bg-brand-50 text-brand-900' },
  locked: { icon: Lock, label: 'Locked', classes: 'border-slate-400 bg-slate-100 text-slate-900' },
  'not-started': { icon: CircleDashed, label: 'Not started', classes: 'border-slate-400 bg-white text-slate-900' },
  pending: { icon: Clock, label: 'Awaiting trainer feedback', classes: 'border-amber-500 bg-amber-50 text-amber-950' },
}

/** Status is always conveyed as text and an icon, never colour alone. */
export function StatusBadge({ kind, label, className }: { kind: BadgeKind; label?: string; className?: string }) {
  const { icon: Icon, label: defaultLabel, classes } = styles[kind]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-bold', classes, className)}>
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
      {label ?? defaultLabel}
    </span>
  )
}
