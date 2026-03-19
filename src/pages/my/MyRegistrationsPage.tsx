import { useState } from 'react'
import { MapPin, Calendar } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ROUTES } from '@/routes'
import { queryKeys } from '@/shared/lib/queryKeys'
import { userService } from '@/features/user/user.service'
import type { Registration } from '@/features/user/user.service'
import { useFormatting } from '@/shared/hooks/useFormatting'
import { BaseSkeleton } from '@/shared/components/ui/BaseSkeleton'
import { BaseButton } from '@/shared/components/ui/BaseButton'

const statusLabel: Record<string, string> = {
  confirmed: 'Bevestigd',
  waitlist: 'Wachtlijst',
  cancelled: 'Geannuleerd',
}

const statusClass: Record<string, string> = {
  confirmed: 'text-success bg-success/10',
  waitlist: 'text-accent-500 bg-accent-500/10',
  cancelled: 'text-muted bg-muted/10',
}

function weeksUntilTrip(dateFrom: string): number {
  return (new Date(dateFrom).getTime() - Date.now()) / (7 * 24 * 60 * 60 * 1000)
}

function cancellationLabel(item: Registration): string | null {
  if (item.status === 'cancelled') return null
  const weeks = weeksUntilTrip(item.date_from)
  if (weeks < 0) return null
  if (weeks < 2) return null
  if (weeks <= 6) return 'Afmelden (70% kosten)'
  return 'Afmelden'
}

function cancellationNote(item: Registration): string | null {
  if (item.status === 'cancelled') return null
  const weeks = weeksUntilTrip(item.date_from)
  if (weeks >= 0 && weeks < 2) return 'Afmelden niet meer mogelijk online — neem contact op.'
  return null
}

export function MyRegistrationsPage() {
  const { formatDateRange } = useFormatting()
  const queryClient = useQueryClient()
  const [cancellingId, setCancellingId] = useState<number | null>(null)

  const { data: registrations, isPending } = useQuery({
    queryKey: queryKeys.myRegistrations(),
    queryFn: userService.getRegistrations,
  })

  async function cancelRegistration(id: number) {
    setCancellingId(id)
    try {
      await userService.cancelRegistration(id)
      queryClient.setQueryData<Registration[]>(queryKeys.myRegistrations(), (old) =>
        old?.map((r) => (r.id === id ? { ...r, status: 'cancelled' as const } : r)) ?? [],
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.trips() })
    } catch {
      toast.error('Afmelden mislukt. Probeer het opnieuw of neem contact met ons op.')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Mijn inschrijvingen</h2>

      {isPending ? (
        <div className="space-y-3">
          <BaseSkeleton className="h-20 w-full rounded-xl" />
          <BaseSkeleton className="h-20 w-full rounded-xl" />
        </div>
      ) : !registrations?.length ? (
        <div className="text-center py-16">
          <p className="text-muted mb-4">Je hebt nog geen inschrijvingen.</p>
          <BaseButton to={ROUTES.trips}>Bekijk reizen →</BaseButton>
        </div>
      ) : (
        <ul role="list" className="space-y-4">
          {registrations.map((item) => {
            const label = cancellationLabel(item)
            const note = cancellationNote(item)
            const weeks = weeksUntilTrip(item.date_from)

            return (
              <li key={item.id} className="bg-white dark:bg-dark-secondary rounded-2xl shadow-sm p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="font-semibold text-lg">{item.trip_title}</h3>
                    <dl className="mt-2 space-y-1 text-sm text-muted">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <dt className="sr-only">Locatie</dt>
                        <dd>{item.location}</dd>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <dt className="sr-only">Datum</dt>
                        <dd>{formatDateRange(item.date_from, item.date_to)}</dd>
                      </div>
                    </dl>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 ${
                      statusClass[item.status] ?? 'text-muted bg-muted/10'
                    }`}
                  >
                    {statusLabel[item.status] ?? item.status}
                  </span>
                </div>

                {item.status !== 'cancelled' && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between gap-4 flex-wrap">
                    {note ? (
                      <p className="text-xs text-muted">{note}</p>
                    ) : label ? (
                      <>
                        <p className="text-xs text-muted">
                          {weeks <= 6 ? 'Annuleren kost 70% van de reissom.' : 'Kosteloos annuleren.'}
                        </p>
                        <button
                          type="button"
                          disabled={cancellingId === item.id}
                          className="text-xs text-red-500 hover:underline disabled:opacity-50 shrink-0"
                          onClick={() => cancelRegistration(item.id)}
                        >
                          {cancellingId === item.id ? 'Afmelden…' : label}
                        </button>
                      </>
                    ) : null}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
