import { motion } from 'framer-motion'
import { cn } from '../lib/cn'

interface Props {
  percent: number
  label: string
  className?: string
}

export function ProgressBar({ percent, label, className }: Props) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-valuetext={`${percent} percent`}
      className={cn('h-3 w-full overflow-hidden rounded-full bg-slate-200', className)}
    >
      <motion.div
        className="h-full rounded-full bg-brand-600"
        initial={false}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  )
}
