import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface BasePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  ariaLabel?: string
}

export function BasePagination({ currentPage, totalPages, onPageChange, ariaLabel = 'Paginering' }: BasePaginationProps) {
  const pages = useMemo<(number | '…')[]>(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const result: (number | '…')[] = [1]
    if (currentPage > 3) result.push('…')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      result.push(i)
    }
    if (currentPage < totalPages - 2) result.push('…')
    result.push(totalPages)
    return result
  }, [currentPage, totalPages])

  if (totalPages <= 1) return null

  function go(page: number) {
    if (page < 1 || page > totalPages || page === currentPage) return
    onPageChange(page)
  }

  return (
    <nav aria-label={ariaLabel} className="flex items-center justify-center gap-1 mt-10">
      <button
        type="button"
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10"
        aria-label="Vorige pagina"
        onClick={() => go(currentPage - 1)}
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
      </button>

      {pages.map((page, i) =>
        page === '…' ? (
          <span key={i} className="w-9 h-9 flex items-center justify-center text-sm text-muted select-none">…</span>
        ) : (
          <button
            key={i}
            type="button"
            aria-current={page === currentPage ? 'page' : undefined}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              page === currentPage ? 'bg-primary-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-white/10'
            }`}
            onClick={() => go(page as number)}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10"
        aria-label="Volgende pagina"
        onClick={() => go(currentPage + 1)}
      >
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </nav>
  )
}
