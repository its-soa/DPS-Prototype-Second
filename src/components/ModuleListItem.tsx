import { motion } from 'framer-motion'
import { FileText, Headphones, ListChecks, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { moduleLabel, modulePath, typeLabel } from '../lib/content'
import { cn } from '../lib/cn'
import type { Module, ModuleStatus, ModuleType } from '../types'
import { StatusBadge } from './StatusBadge'

const icons: Record<ModuleType, LucideIcon> = { reading: FileText, audio: Headphones, quiz: ListChecks }

interface Props {
  module: Module
  index: number
  status: ModuleStatus
  /** The module the learner is on right now (shown as "You are here"). */
  isCurrent?: boolean
  /** Briefly glow to confirm this is where Lena resumed. */
  highlight?: boolean
  /** Just unlocked by completing the previous step. */
  justUnlocked?: boolean
  /** Narrow layout for the course sidebar: badge under the title, no summary. */
  compact?: boolean
}

export function ModuleListItem({ module: m, index, status, isCurrent, highlight, justUnlocked, compact }: Props) {
  const Icon = icons[m.type]
  const locked = status === 'locked'
  const showUnlocked = status === 'unlocked' || justUnlocked

  return (
    <motion.li
      layout="position"
      initial={false}
      animate={
        highlight
          ? { boxShadow: ['0 0 0 0px rgba(23,128,138,0)', '0 0 0 6px rgba(23,128,138,.35)', '0 0 0 0px rgba(23,128,138,0)'] }
          : justUnlocked
            ? { backgroundColor: ['#ffffff', '#d4ecea', '#ffffff'] }
            : {}
      }
      transition={{ duration: 1.6, ease: 'easeInOut', repeat: highlight ? 1 : 0 }}
      className={cn(
        'relative flex items-start gap-3 rounded-2xl border-2 bg-white p-4',
        isCurrent ? 'border-brand-600' : 'border-slate-200',
        locked && 'bg-slate-50',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 text-base font-bold',
          status === 'completed' ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-slate-400 bg-white text-slate-800',
        )}
      >
        {index}
      </span>

      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-bold text-slate-700">
          <span className="inline-flex items-center gap-1.5">
            <Icon aria-hidden="true" className="h-4 w-4" />
            {typeLabel[m.type]}
          </span>
          <span>{m.estimatedMinutes} min</span>
          {isCurrent && <span className="rounded bg-brand-700 px-2 py-0.5 text-xs uppercase tracking-wide text-white">You are here</span>}
        </p>

        <h3 className="mt-1 text-lg">
          {locked ? (
            <span className="text-slate-800">
              <span className="font-bold">{moduleLabel(m)}</span>
              {m.type !== 'quiz' && <span className="font-normal">: {m.title}</span>}
            </span>
          ) : (
            <Link
              to={modulePath(m)}
              className="after:absolute after:inset-0 after:rounded-2xl hover:underline"
              aria-describedby={undefined}
            >
              {moduleLabel(m)}
              {m.type !== 'quiz' && <span className="font-normal">: {m.title}</span>}
            </Link>
          )}
        </h3>

        {!compact && !locked && <p className="mt-1 text-slate-700">{m.summary}</p>}
        {!compact && locked && <p className="mt-1 text-slate-700">Opens when you complete the step before it.</p>}
        {compact && (
          <div className="mt-2">
            <StatusBadge kind={status === 'unlocked' || justUnlocked ? 'unlocked' : status} label={showUnlocked && status !== 'completed' ? 'Unlocked' : undefined} />
          </div>
        )}
      </div>

      <div className={cn('shrink-0 pt-1', compact && 'hidden')}>
        <StatusBadge kind={status === 'unlocked' || justUnlocked ? 'unlocked' : status} label={showUnlocked && status !== 'completed' ? 'Unlocked' : undefined} />
      </div>
    </motion.li>
  )
}
