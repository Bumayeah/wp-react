import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { agendaService } from '@/features/agenda/agenda.service'
import { AgendaCard } from '@/features/agenda/components/AgendaCard'
import { AppSection } from '@/shared/components/layout/AppSection'
import { ROUTES } from '@/routes'
import { SectionHeader } from '@/shared/components/ui/SectionHeader'
import { BaseSkeleton } from '@/shared/components/ui/BaseSkeleton'
import { ErrorState } from '@/shared/components/ui/ErrorState'
import { EmptyState } from '@/shared/components/ui/EmptyState'
import { BaseButton } from '@/shared/components/ui/BaseButton'

interface AgendaPreviewProps {
  eyebrow: string
  title: string
}

export function AgendaPreview({ eyebrow, title }: AgendaPreviewProps) {
  const { data: trips, isPending, isError, refetch } = useQuery({
    queryKey: queryKeys.trips(),
    queryFn: agendaService.getAll,
    staleTime: 5 * 60 * 1000,
  })

  const upcomingTrips = (trips ?? []).filter((t) => new Date(t.date_from) >= new Date())

  return (
    <AppSection bg="white" aria-labelledby="agenda-preview-title">
      <div className="flex items-end justify-between mb-10">
        <SectionHeader eyebrow={eyebrow} headingId="agenda-preview-title" title={title} />
        <Link
          to={ROUTES.trips}
          className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors"
        >
          Alle reizen
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

      {isPending ? (
        <div className="grid gap-8 sm:grid-cols-2">
          {Array.from({ length: 2 }, (_, i) => <BaseSkeleton key={i} className="h-96" />)}
        </div>
      ) : isError ? (
        <ErrorState description="Reizen konden niet worden geladen." retry={refetch} />
      ) : !upcomingTrips.length ? (
        <EmptyState
          title="Geen reizen gepland"
          description="Er zijn momenteel geen aankomende reizen. Houd onze website in de gaten voor nieuwe reizen."
        />
      ) : (
        <div className="grid gap-8 sm:grid-cols-2">
          {upcomingTrips.slice(0, 2).map((trip) => (
            <AgendaCard key={trip.id} trip={trip} variant="featured" />
          ))}
        </div>
      )}

      {/* Mobile: show all link */}
      <div className="mt-8 flex justify-center sm:hidden">
        <BaseButton to={ROUTES.trips} variant="secondary">Alle reizen bekijken</BaseButton>
      </div>
    </AppSection>
  )
}
