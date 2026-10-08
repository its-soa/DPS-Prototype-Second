import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

/** The page's single h1. Focusable so route changes can move the screen reader here. */
export function PageTitle({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <h1 id={id} tabIndex={-1} className={cn('text-3xl sm:text-4xl', className)}>
      {children}
    </h1>
  )
}

export function Card({ children, className, as: Tag = 'section', ...rest }: { children: ReactNode; className?: string; as?: 'section' | 'article' | 'div'; 'aria-labelledby'?: string }) {
  return (
    <Tag className={cn('rounded-2xl border border-slate-200 bg-white p-6 shadow-soft', className)} {...rest}>
      {children}
    </Tag>
  )
}
