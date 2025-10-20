import type { InputHTMLAttributes, ReactNode } from 'react'

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export type InputSize = 'lg' | 'md' | 'sm'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

export function Input({
  className,
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = true,
  ...rest
}: InputProps) {
  const sizes: Record<InputSize, { input: string; icon: string }> = {
    lg: { input: 'h-14 text-base px-12', icon: 'text-[18px]' },
    md: { input: 'h-11 text-sm px-12', icon: 'text-[16px]' },
    sm: { input: 'h-10 text-sm px-10', icon: 'text-[14px]' },
  }

  const paddingLeft = leftIcon ? (size === 'sm' ? 'pl-10' : 'pl-12') : ''
  const paddingRight = rightIcon ? (size === 'sm' ? 'pr-10' : 'pr-12') : ''

  return (
    <div className={cx('relative', fullWidth && 'w-full')}>
      {leftIcon && (
        <span className={cx('pointer-events-none absolute inset-y-0 left-5 flex items-center text-dark-text-muted', sizes[size].icon)}>
          {leftIcon}
        </span>
      )}

      <input
        className={cx(
          'w-full rounded-full border border-dark-border bg-dark-card text-dark-text-primary placeholder-dark-text-muted shadow-[0_0_0_1px_rgba(255,255,255,0.05)] outline-none transition',
          'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40',
          sizes[size].input,
          paddingLeft,
          paddingRight,
          className
        )}
        {...rest}
      />

      {rightIcon && (
        <span className={cx('pointer-events-none absolute inset-y-0 right-5 flex items-center text-dark-text-muted', sizes[size].icon)}>
          {rightIcon}
        </span>
      )}
    </div>
  )
}

export default Input
