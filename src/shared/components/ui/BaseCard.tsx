interface BaseCardProps {
  variant?: 'default' | 'elevated' | 'accent'
  padding?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
  className?: string
}

export function BaseCard({ variant, padding, children, className = '' }: BaseCardProps) {
  const variantCls =
    !variant || variant === 'default'
      ? 'border border-gray-100 bg-gray-50 dark:border-white/8 dark:bg-dark-secondary'
      : variant === 'elevated'
        ? 'bg-white shadow-sm dark:bg-dark-secondary'
        : 'border border-primary-500/15 bg-primary-500/5'

  const paddingCls =
    !padding || padding === 'md' ? 'p-6' : padding === 'lg' ? 'p-8' : 'p-4'

  return (
    <div className={`rounded-2xl ${variantCls} ${paddingCls} ${className}`}>
      {children}
    </div>
  )
}
