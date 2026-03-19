interface BaseBadgeProps {
  variant?: 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'muted'
  size?: 'sm' | 'md'
  children?: React.ReactNode
  className?: string
}

export function BaseBadge({ variant, size, children, className = '' }: BaseBadgeProps) {
  const sizeCls = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
  const colorCls =
    !variant || variant === 'primary'
      ? 'bg-primary-500/10 text-primary-500'
      : variant === 'accent'
        ? 'bg-accent-500/10 text-accent-500'
        : variant === 'success'
          ? 'bg-success/10 text-success'
          : variant === 'warning'
            ? 'bg-warning/10 text-warning'
            : variant === 'error'
              ? 'bg-error/10 text-error'
              : 'bg-muted/10 text-muted'

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeCls} ${colorCls} ${className}`}>
      {children}
    </span>
  )
}
