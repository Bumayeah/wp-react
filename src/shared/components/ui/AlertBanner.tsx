interface AlertBannerProps {
  variant?: 'success' | 'error' | 'warning' | 'info'
  size?: 'sm' | 'lg'
  children?: React.ReactNode
  className?: string
  role?: string
}

export function AlertBanner({ variant, size, children, className = '', role }: AlertBannerProps) {
  const sizeCls =
    size === 'lg'
      ? 'rounded-2xl p-8 text-center'
      : size === 'sm'
        ? 'flex items-center gap-2 rounded-xl p-3'
        : 'rounded-xl p-4'

  const colorCls =
    !variant || variant === 'error'
      ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400'
      : variant === 'success'
        ? 'border-success/20 bg-success/10 text-success'
        : variant === 'warning'
          ? 'border-warning/20 bg-warning/10 text-warning'
          : 'border-primary-500/20 bg-primary-500/10 text-primary-500'

  return (
    <div role={role} className={`border text-sm ${sizeCls} ${colorCls} ${className}`}>
      {children}
    </div>
  )
}
