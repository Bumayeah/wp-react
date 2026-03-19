import { Link } from 'react-router-dom'

interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  as?: 'button' | 'a'
  href?: string
  to?: string
  children?: React.ReactNode
  className?: string
}

function variantClass(variant?: string) {
  if (!variant || variant === 'primary')
    return 'bg-primary-500 hover:bg-primary-600 focus-visible:outline-primary-500 text-white'
  if (variant === 'secondary')
    return 'dark:bg-dark-secondary text-dark border-dark/20 focus-visible:outline-primary-500 border bg-white hover:bg-gray-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10'
  if (variant === 'ghost')
    return 'text-primary-500 hover:bg-primary-500/10 focus-visible:outline-primary-500 bg-transparent'
  return 'bg-error text-white hover:bg-red-700 focus-visible:outline-red-500'
}

function sizeClass(size?: string) {
  if (size === 'sm') return 'px-4 py-1.5 text-sm'
  if (size === 'lg') return 'px-8 py-3.5 text-base'
  return 'px-6 py-2.5 text-sm'
}

const base = 'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-97'

export function BaseButton({
  variant,
  size,
  loading,
  as,
  href,
  to,
  children,
  className = '',
  disabled,
  type = 'button',
  ...rest
}: BaseButtonProps) {
  const cls = `${base} ${sizeClass(size)} ${variantClass(variant)} ${className}`

  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    )
  }

  if (as === 'a') {
    return (
      <a href={href} className={cls} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`${cls} disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100`}
      {...rest}
    >
      {loading && (
        <span
          className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  )
}
