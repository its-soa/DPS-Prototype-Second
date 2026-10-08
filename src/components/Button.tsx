import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', extra?: string) {
  return cn(
    'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 px-5 font-bold transition-colors',
    'disabled:cursor-not-allowed aria-disabled:cursor-not-allowed',
    size === 'lg' && 'min-h-14 px-7 text-lg',
    variant === 'primary' &&
      'border-brand-700 bg-brand-700 text-white hover:bg-brand-800 aria-disabled:border-slate-300 aria-disabled:bg-slate-200 aria-disabled:text-slate-700 aria-disabled:hover:bg-slate-200',
    variant === 'secondary' &&
      'border-brand-700 bg-white text-brand-800 hover:bg-brand-50 aria-disabled:border-slate-300 aria-disabled:text-slate-700 aria-disabled:hover:bg-white',
    variant === 'ghost' && 'border-transparent bg-transparent text-brand-800 hover:bg-brand-50',
    extra,
  )
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, className, type = 'button', ...rest },
  ref,
) {
  return <button ref={ref} type={type} className={buttonClasses(variant, size, className)} {...rest} />
})

interface LinkButtonProps extends LinkProps {
  variant?: Variant
  size?: Size
}

export function LinkButton({ variant, size, className, ...rest }: LinkButtonProps) {
  return <Link className={buttonClasses(variant, size, className)} {...rest} />
}
