import { BaseButton } from './BaseButton'
import { AlertTriangle } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  description?: string
  retry?: () => void
  children?: React.ReactNode
}

export function ErrorState({ title, description, retry, children }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center" aria-hidden="true">
        <AlertTriangle className="w-8 h-8 text-error" aria-hidden="true" />
      </div>
      <div>
        <p className="text-lg font-semibold dark:text-white">{title ?? 'Er ging iets mis'}</p>
        <p className="text-muted text-sm mt-1">{description ?? 'Er is een fout opgetreden. Probeer het opnieuw.'}</p>
      </div>
      {retry && (
        <BaseButton variant="secondary" size="sm" onClick={retry}>Probeer opnieuw</BaseButton>
      )}
      {children}
    </div>
  )
}
