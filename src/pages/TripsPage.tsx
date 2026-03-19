import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { usePage } from '@/shared/hooks/usePage'
import { PageSeo } from '@/shared/components/seo/PageSeo'
import { queryKeys } from '@/shared/lib/queryKeys'
import { agendaService } from '@/features/agenda/agenda.service'
import { AgendaCard } from '@/features/agenda/components/AgendaCard'
import { PageHero } from '@/shared/components/layout/PageHero'
import { BaseSkeleton } from '@/shared/components/ui/BaseSkeleton'
import { ErrorState } from '@/shared/components/ui/ErrorState'
import { EmptyState } from '@/shared/components/ui/EmptyState'
import { BasePagination } from '@/shared/components/ui/BasePagination'

const PER_PAGE = 6

export function TripsPage() {
  const { data: page } = usePage('reizen', 30 * 60 * 1000)

  const { data: trips, isPending, isError, refetch } = useQuery({
    queryKey: queryKeys.trips(),
    queryFn: agendaService.getAll,
    staleTime: 5 * 60 * 1000,
  })

  const [upcomingPage, setUpcomingPage] = useState(1)
  const [pastPage, setPastPage] = useState(1)

  const upcoming = (trips ?? []).filter((t) => new Date(t.date_from) >= new Date())
  const allPast = (trips ?? [])
    .filter((t) => new Date(t.date_from) < new Date())
    .sort((a, b) => new Date(b.date_from).getTime() - new Date(a.date_from).getTime())

  const upcomingTotalPages = Math.ceil(upcoming.length / PER_PAGE)
  const pastTotalPages = Math.ceil(allPast.length / PER_PAGE)

  const upcomingPaged = upcoming.slice((upcomingPage - 1) * PER_PAGE, upcomingPage * PER_PAGE)
  const pastPaged = allPast.slice((pastPage - 1) * PER_PAGE, pastPage * PER_PAGE)

  function handleUpcomingPage(p: number) {
    setUpcomingPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handlePastPage(p: number) {
    setPastPage(p)
    document.getElementById('past-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <PageSeo
        title={page?.title?.rendered ?? 'Reizen'}
        description={(page?.acf as Record<string, string> | undefined)?.hero_description}
      />
      <PageHero
        eyebrow={(page?.acf as Record<string, string> | undefined)?.hero_eyebrow ?? 'Ski met ons mee'}
        title={page?.title?.rendered ?? 'Aankomende reizen'}
        description={(page?.acf as Record<string, string> | undefined)?.hero_description}
      />

      <div className="container mx-auto px-4 py-16">
        {isPending ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => <BaseSkeleton key={i} className="h-96" />)}
          </div>
        ) : isError ? (
          <ErrorState description="Reizen konden niet worden geladen." retry={refetch} />
        ) : (
          <>
            {/* Upcoming trips */}
            <section aria-labelledby="upcoming-title">
              <h2 id="upcoming-title" className="sr-only">Aankomende reizen</h2>
              {!upcoming.length ? (
                <EmptyState
                  title="Geen reizen gepland"
                  description="Er zijn momenteel geen aankomende reizen. Houd de website in de gaten voor nieuwe reizen."
                />
              ) : (
                <>
                  <ul role="list" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {upcomingPaged.map((trip) => (
                      <li key={trip.id}><AgendaCard trip={trip} /></li>
                    ))}
                  </ul>
                  <BasePagination currentPage={upcomingPage} totalPages={upcomingTotalPages} onPageChange={handleUpcomingPage} />
                </>
              )}
            </section>

            {/* Past trips */}
            {allPast.length > 0 && (
              <section className="mt-16" aria-labelledby="past-title">
                <h2 id="past-title" className="text-muted mb-6 text-xl font-semibold">Eerdere reizen</h2>
                <ul role="list" className="grid gap-6 opacity-60 sm:grid-cols-2 lg:grid-cols-3">
                  {pastPaged.map((trip) => (
                    <li key={trip.id}><AgendaCard trip={trip} /></li>
                  ))}
                </ul>
                <BasePagination currentPage={pastPage} totalPages={pastTotalPages} onPageChange={handlePastPage} />
              </section>
            )}
          </>
        )}
      </div>
    </>
  )
}
