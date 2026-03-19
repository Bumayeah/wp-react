import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface BaseDialogProps {
  open: boolean
  title?: string
  closeLabel?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  onClose: () => void
  children?: React.ReactNode
  header?: React.ReactNode
}

const widthMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
}

export function BaseDialog({ open, title, closeLabel, maxWidth = 'lg', onClose, children, header }: BaseDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (open) dialogRef.current?.showModal()
    else dialogRef.current?.close()
  }, [open])

  function onDialogClick(e: React.MouseEvent<HTMLDialogElement>) {
    const rect = dialogRef.current?.getBoundingClientRect()
    if (!rect) return
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={`rounded-2xl shadow-2xl p-0 bg-white dark:bg-dark text-dark dark:text-white w-full mx-auto max-h-[90vh] overflow-y-auto backdrop:bg-black/60 backdrop:backdrop-blur-sm open:animate-[dialog-in_0.2s_ease-out] [&:not([open])]:hidden ${widthMap[maxWidth]}`}
      aria-label={title}
      onClose={onClose}
      onCancel={(e) => { e.preventDefault(); onClose() }}
      onClick={onDialogClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="min-w-0 flex-1">
            {header ?? (title && <h2 className="text-xl font-semibold">{title}</h2>)}
          </div>
          <button
            type="button"
            aria-label={closeLabel ?? 'Sluiten'}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-muted hover:text-dark dark:hover:text-white shrink-0 ml-4"
            onClick={onClose}
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
}
