import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'ghost'

export function Button({
  className = '',
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-violet disabled:opacity-60 disabled:pointer-events-none'

  const variants: Record<Variant, string> = {
    primary:
      'bg-ink-900 text-paper-50 shadow-soft hover:bg-ink-800 active:bg-ink-900',
    ghost:
      'bg-transparent text-ink-900 hover:bg-paper-200 active:bg-paper-200/70',
  }

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}


