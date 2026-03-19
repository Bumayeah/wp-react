import { BaseButton } from './BaseButton'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
  cta?: { label: string; to: string }
}

export function EmptyState({ title, description, cta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center" aria-hidden="true">
        <Inbox className="w-8 h-8 text-muted" aria-hidden="true" />
      </div>
      <div>
        <p className="text-lg font-semibold dark:text-white">{title}</p>
        {description && <p className="text-muted text-sm mt-1">{description}</p>}
      </div>
      {cta && (
        <BaseButton to={cta.to} variant="secondary" size="sm">{cta.label}</BaseButton>
      )}
    </div>
  )
}
