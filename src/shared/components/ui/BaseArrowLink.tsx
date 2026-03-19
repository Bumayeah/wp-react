import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface BaseArrowLinkProps {
  to: string
  children?: React.ReactNode
  className?: string
}

export function BaseArrowLink({ to, children, className = '' }: BaseArrowLinkProps) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-1 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600 after:absolute after:inset-0 ${className}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  )
}
