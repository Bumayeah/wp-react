import { useState } from 'react'
import { useParams, useMatch, useNavigate, Outlet } from 'react-router-dom'
import { ROUTES } from '@/routes'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { agendaService } from '@/features/agenda/agenda.service'
import { getAvailabilityStatus } from '@/features/agenda/agenda.schema'
import { userService } from '@/features/user/user.service'
import type { Registration } from '@/features/user/user.service'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { useFormatting } from '@/shared/hooks/useFormatting'
import { PageHero } from '@/shared/components/layout/PageHero'
import { BaseCard } from '@/shared/components/ui/BaseCard'
import { BaseButton } from '@/shared/components/ui/BaseButton'
import { BaseDialog } from '@/shared/components/ui/BaseDialog'
import { BaseSkeleton } from '@/shared/components/ui/BaseSkeleton'
import { ErrorState } from '@/shared/components/ui/ErrorState'
import { SanitizedHtml } from '@/shared/components/ui/SanitizedHtml'
import { PhotoGrid } from '@/shared/components/ui/PhotoGrid'
import { AvailabilityBadge } from '@/features/agenda/components/AvailabilityBadge'
import { MapPin, Calendar, Quote, CheckCircle2 } from 'lucide-react'
import { PageSeo } from '@/shared/components/seo/PageSeo'

export function TripDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const auth = useAuthStore()
  const ui = useUiStore()
  const queryClient = useQueryClient()
  const { formatDateRange, formatCurrency } = useFormatting()
  const [isCancelling, setIsCancelling] = useState(false)

  // Check if we're on the /aanmelden sub-route
  const isOnRegistration = !!useMatch(ROUTES.tripRegister(slug ?? ''))

  const { data: trip, isPending, isError } = useQuery({
    queryKey: queryKeys.trip(slug ?? ''),
    queryFn: () => agendaService.getBySlug(slug!),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  })

  const { data: registrations } = useQuery({
    queryKey: queryKeys.myRegistrations(),
    queryFn: userService.getRegistrations,
    enabled: auth.isLoggedIn,
    staleTime: 5 * 60 * 1000,
  })

  const isPast = trip ? new Date(trip.date_from) < new Date() : false
  const status = trip ? getAvailabilityStatus(trip) : ('full' as const)

  const registrationDeadline = trip
    ? new Date(trip.registration_deadline ?? trip.date_from)
    : null
  const isRegistrationOpen = registrationDeadline ? new Date() < registrationDeadline : false

  const myRegistration =
    registrations?.find((r) => r.trip_id === trip?.id && r.status !== 'cancelled') ?? null

  async function cancelRegistration() {
    if (!myRegistration) return
    const registrationId = myRegistration.id
    setIsCancelling(true)
    try {
      await userService.cancelRegistration(registrationId)
      queryClient.setQueryData<Registration[]>(queryKeys.myRegistrations(), (old) =>
        old?.map((r) => (r.id === registrationId ? { ...r, status: 'cancelled' as const } : r)) ?? [],
      )
      if (trip) {
        await agendaService.patchSpots(trip.id, trip.spots_available + 1)
      }
      await queryClient.invalidateQueries({ queryKey: queryKeys.myRegistrations() })
      await queryClient.invalidateQueries({ queryKey: queryKeys.trips() })
    } finally {
      setIsCancelling(false)
    }
  }

  const deadlineFmt = registrationDeadline
    ? new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long' }).format(registrationDeadline)
    : ''

  const statusBarClass = status === 'available' ? 'bg-success' : status === 'limited' ? 'bg-warning' : 'bg-muted'

  return (
    <>
      {trip && (
        <PageSeo
          title={trip.title}
          description={trip.description}
          image={trip.image}
          type="article"
        />
      )}
      {/* Registration dialog (child route) */}
      {trip && (
        <BaseDialog
          open={isOnRegistration}
          maxWidth="2xl"
          onClose={() => navigate(ROUTES.tripDetail(slug!))}
          header={
            <div>
              <p className="text-accent-500 mb-0.5 text-xs font-semibold tracking-widest uppercase">Aanmelden</p>
              <p className="font-bold leading-snug">{trip.title}</p>
              <p className="text-muted mt-0.5 text-xs">
                {trip.location} · {formatDateRange(trip.date_from, trip.date_to)} · {formatCurrency(trip.price)}
              </p>
            </div>
          }
        >
          <Outlet />
        </BaseDialog>
      )}

      {/* Loading */}
      {isPending && (
        <div className="container mx-auto px-4 py-16 space-y-6">
          <BaseSkeleton className="h-12 w-2/3" />
          <BaseSkeleton className="h-6 w-1/3" />
          <BaseSkeleton className="h-64 w-full" />
        </div>
      )}

      {/* Error */}
      {!isPending && isError && (
        <div className="container mx-auto px-4 py-16">
          <ErrorState title="Reis niet gevonden" description="Deze reis bestaat niet of is niet meer beschikbaar.">
            <BaseButton to={ROUTES.trips} variant="secondary" className="mt-4">← Terug naar reizen</BaseButton>
          </ErrorState>
        </div>
      )}

      {/* Content */}
      {!isPending && !isError && trip && (
        <>
          <PageHero title={trip.title} imageSrc={trip.image} backTo={ROUTES.trips} backLabel="Alle reizen">
            <div className="flex flex-wrap items-center gap-4 text-white/70">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                {trip.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                {formatDateRange(trip.date_from, trip.date_to)}
              </span>
              <span className="font-semibold text-white text-lg">{formatCurrency(trip.price)}</span>
            </div>
          </PageHero>

          <div className="container mx-auto px-4 py-12">
            <div className="grid gap-10 lg:grid-cols-3">

              {/* Main info */}
              <div className="lg:col-span-2 space-y-8">
                <section aria-labelledby="description-title">
                  <h2 id="description-title" className="text-2xl font-semibold mb-4">Over deze reis</h2>
                  <p className="text-muted leading-relaxed">{trip.description}</p>
                </section>

                {trip.acf?.program && (
                  <section aria-labelledby="program-title">
                    <h2 id="program-title" className="text-2xl font-semibold mb-4">Programma</h2>
                    <SanitizedHtml html={trip.acf.program} className="prose prose-sm max-w-none text-muted" />
                  </section>
                )}

                {trip.acf?.included && (
                  <section aria-labelledby="included-title">
                    <h2 id="included-title" className="text-2xl font-semibold mb-4">Wat is inbegrepen?</h2>
                    <SanitizedHtml html={trip.acf.included} className="prose prose-sm max-w-none text-muted" />
                  </section>
                )}

                {isPast && (trip.acf?.gallery?.length ?? 0) > 0 && (
                  <section aria-labelledby="gallery-title">
                    <h2 id="gallery-title" className="text-2xl font-semibold mb-4">Foto's</h2>
                    <PhotoGrid photos={trip.acf?.gallery ?? []} />
                  </section>
                )}

                {isPast && (trip.acf?.testimonials?.length ?? 0) > 0 && (
                  <section aria-labelledby="reviews-title">
                    <h2 id="reviews-title" className="text-2xl font-semibold mb-6">Wat deelnemers zeiden</h2>
                    <ul role="list" className="space-y-4">
                      {(trip.acf?.testimonials ?? []).map((item: any) => (
                        <li key={item.name}>
                          <blockquote className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6">
                            <Quote className="w-6 h-6 text-primary-500/30 mb-3" aria-hidden="true" />
                            <p className="text-muted leading-relaxed mb-3">"{item.quote}"</p>
                            <footer className="text-sm font-semibold">{item.name}</footer>
                          </blockquote>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              {/* Sidebar */}
              <aside aria-label="Aanmelding" className="lg:sticky lg:top-28 h-fit">
                <BaseCard variant="elevated" className="space-y-5">
                  {isPast ? (
                    <div className="text-sm text-muted bg-gray-50 dark:bg-white/5 rounded-xl p-4">
                      Deze reis heeft plaatsgevonden en is niet meer beschikbaar voor aanmelding.
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-muted mb-1">Prijs per persoon</p>
                        <p className="text-3xl font-bold text-primary-500">{formatCurrency(trip.price)}</p>
                      </div>

                      <div>
                        <div
                          role="progressbar"
                          aria-valuenow={trip.spots_total - trip.spots_available}
                          aria-valuemin={0}
                          aria-valuemax={trip.spots_total}
                          aria-label={`${trip.spots_total - trip.spots_available} van ${trip.spots_total} plekken bezet`}
                          className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10 mb-2"
                        >
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${statusBarClass}`}
                            style={{ width: `${((trip.spots_total - trip.spots_available) / trip.spots_total) * 100}%` }}
                          />
                        </div>
                        <p className="text-sm text-muted" aria-hidden="true">
                          {trip.spots_total - trip.spots_available} van {trip.spots_total} plekken bezet
                        </p>
                      </div>

                      <AvailabilityBadge status={status} spotsAvailable={trip.spots_available} spotsTotal={trip.spots_total} />

                      {!auth.isLoggedIn ? (
                        <>
                          <p className="text-sm text-muted">Je moet ingelogd zijn om je aan te melden voor deze reis.</p>
                          <div className="flex flex-col gap-2">
                            <BaseButton
                              className="w-full justify-center"
                              onClick={() => ui.openAuthModal({ view: 'login', redirectTo: ROUTES.tripRegister(trip.slug) })}
                            >
                              Inloggen →
                            </BaseButton>
                            <BaseButton variant="secondary" className="w-full justify-center" onClick={() => ui.openAuthModal({ view: 'register' })}>
                              Account aanmaken
                            </BaseButton>
                          </div>
                        </>
                      ) : myRegistration ? (
                        <>
                          <div className={`rounded-xl p-3 text-sm flex items-center gap-2 ${myRegistration.status === 'waitlist' ? 'bg-accent-500/10 text-accent-500' : 'bg-success/10 text-success'}`}>
                            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                            {myRegistration.status === 'waitlist' ? 'Je staat op de wachtlijst.' : 'Je bent aangemeld voor deze reis.'}
                          </div>
                          {isRegistrationOpen ? (
                            <div className="space-y-1">
                              <BaseButton
                                variant="ghost"
                                className="w-full justify-center text-error! hover:bg-red-50! dark:hover:bg-red-950/20!"
                                disabled={isCancelling}
                                onClick={cancelRegistration}
                              >
                                {isCancelling ? 'Bezig…' : 'Afmelden'}
                              </BaseButton>
                              <p className="text-xs text-center text-muted">Afmelden is mogelijk tot {deadlineFmt}</p>
                            </div>
                          ) : (
                            <p className="text-xs text-muted text-center">Afmelden is niet meer mogelijk.</p>
                          )}
                        </>
                      ) : (
                        <>
                          {isRegistrationOpen ? (
                            <>
                              {(status === 'available' || status === 'limited') && (
                                <BaseButton to={ROUTES.tripRegister(trip.slug)} className="w-full justify-center">
                                  Aanmelden →
                                </BaseButton>
                              )}
                              {status === 'waitlist' && (
                                <div className="space-y-2">
                                  <p className="text-sm text-muted">Je kunt je aanmelden voor de wachtlijst. We nemen contact op als er een plek vrijkomt.</p>
                                  <BaseButton to={ROUTES.tripRegister(trip.slug)} variant="secondary" className="w-full justify-center">
                                    Op wachtlijst →
                                  </BaseButton>
                                </div>
                              )}
                              {status === 'full' && (
                                <div className="space-y-2">
                                  <p className="text-sm text-muted">Er zijn geen plekken meer beschikbaar en de wachtlijst is gesloten.</p>
                                  <BaseButton to={ROUTES.trips} variant="ghost" className="w-full justify-center">Bekijk andere reizen</BaseButton>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-sm text-muted bg-gray-50 dark:bg-white/5 rounded-xl p-4">
                              De aanmeldingstermijn voor deze reis is gesloten.
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </BaseCard>
              </aside>
            </div>
          </div>
        </>
      )}
    </>
  )
}
