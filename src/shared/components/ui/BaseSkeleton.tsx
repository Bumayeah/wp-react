interface BaseSkeletonProps {
  className?: string
}

export function BaseSkeleton({ className = '' }: BaseSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Laden..."
      className={`animate-pulse rounded-2xl bg-gray-200 dark:bg-white/10 ${className}`}
    />
  )
}
