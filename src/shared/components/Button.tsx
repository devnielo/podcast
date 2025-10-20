import type { ButtonHTMLAttributes, ReactNode } from 'react'

// Simple utility to join class names without adding a dependency
function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'lg' | 'md' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  loading?: boolean
}

export function Button({
  className,
  variant = 'primary',
  size = 'lg',
  leftIcon,
  rightIcon,
  loading = false,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading

  const base = cx(
    'inline-flex select-none items-center justify-center whitespace-nowrap rounded-pill font-semibold transition',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
    'disabled:opacity-60 disabled:cursor-not-allowed'
  )

  const sizes: Record<ButtonSize, string> = {
    lg: 'h-14 px-7 text-base',
    md: 'h-11 px-5 text-sm',
    sm: 'h-10 px-4 text-sm',
  }

  const variants: Record<ButtonVariant, string> = {
    primary: cx(
      'bg-brand-500 text-white shadow-[0_05px_10px_rgba(230,54,54,0.35)]',
      'hover:bg-brand-400 hover:shadow-[0_08px_15px_rgba(230,54,54,0.45)]',
      'active:scale-[0.98]'
    ),
    secondary: cx(
      'bg-dark-card text-dark-text-primary border border-dark-border',
      'hover:bg-dark-hover hover:border-white/10 hover:text-white',
      'active:scale-[0.98]'
    ),
    ghost: cx(
      'bg-transparent text-dark-text-primary/85',
      'hover:bg-white/10',
      'active:scale-[0.98]'
    ),
  }

  return (
    <button
      className={cx(base, sizes[size], variants[variant], 'will-change-transform', 'hover:scale-[1.015]', className)}
      disabled={isDisabled}
      {...rest}
    >
      {leftIcon && (
        <span className={cx('mr-2 grid place-items-center', size === 'lg' ? 'text-[18px]' : 'text-[16px]')}>{leftIcon}</span>
      )}

      {/* Content / Loading */}
      <span className={cx('relative flex items-center', loading && 'text-transparent')}>
        {children}
      </span>

      {loading && (
        <span
          aria-hidden
          className="absolute inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/70 border-t-transparent"
        />
      )}

      {rightIcon && (
        <span className={cx('ml-2 grid place-items-center', size === 'lg' ? 'text-[18px]' : 'text-[16px]')}>{rightIcon}</span>
      )}
    </button>
  )
}

export default Button
