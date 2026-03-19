import { useQueryClient } from '@tanstack/react-query'
import { MapPin, Calendar, ImageOff } from 'lucide-react'
import type { AgendaItem } from '../agenda.schema'
import { getAvailabilityStatus, AVAILABILITY_LABEL, AVAILABILITY_COLOR } from '../agenda.schema'
import { useFormatting } from '@/shared/hooks/useFormatting'
import { BaseArrowLink } from '@/shared/components/ui/BaseArrowLink'
import { ROUTES } from '@/routes'

interface AgendaCardProps {
  trip: AgendaItem
  variant?: 'default' | 'featured'
}

export function AgendaCard({ trip, variant }: AgendaCardProps) {
  const queryClient = useQueryClient()
  const { formatDateRange, formatCurrency } = useFormatting()

  const isPast = new Date(trip.date_from) < new Date()
  const status = getAvailabilityStatus(trip)

  function onMouseEnter() {
    if (!queryClient.getQueryData(['agenda', trip.slug])) {
      queryClient.setQueryData(['agenda', trip.slug], trip)
    }
  }

  return (
    <article
      className={`group dark:bg-dark-secondary relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isPast || status === 'full' ? 'opacity-80' : ''}`}
      onMouseEnter={onMouseEnter}
    >
      {/* Image */}
      <div className={`relative overflow-hidden bg-gray-100 dark:bg-white/5 ${variant === 'featured' ? 'aspect-video' : 'aspect-4/3'}`}>
        {trip.image ? (
          <img
            src={trip.image}
            alt={trip.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="text-muted flex h-full w-full items-center justify-center">
            <ImageOff className="h-12 w-12" aria-hidden="true" />
          </div>
        )}

        {/* Badge overlay */}
        <div className="absolute top-3 right-3">
          {isPast ? (
            <span role="status" className="bg-muted/10 text-muted rounded-full px-2.5 py-1 text-xs font-semibold">
              Afgelopen
            </span>
          ) : (
            <span role="status" className={`rounded-full px-2.5 py-1 text-xs font-semibold ${AVAILABILITY_COLOR[status]}`}>
              {AVAILABILITY_LABEL[status]}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`flex flex-1 flex-col gap-2 ${variant === 'featured' ? 'p-7' : 'p-5'}`}>
        <p className="text-muted text-sm">
          {formatDateRange(trip.date_from, trip.date_to)} · {trip.location}
        </p>
        <h3 className={`leading-snug font-semibold ${variant === 'featured' ? 'text-xl' : 'text-lg'}`}>
          {trip.title}
        </h3>

        {variant === 'featured' && trip.description ? (
          <p className="text-muted line-clamp-3 text-sm leading-relaxed">{trip.description}</p>
        ) : (
          <>
            <div className="text-muted flex items-center gap-1.5 text-sm">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{trip.location}</span>
            </div>
            <div className="text-muted flex items-center gap-1.5 text-sm">
              <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{formatDateRange(trip.date_from, trip.date_to)}</span>
            </div>
          </>
        )}

        <div className={`mt-auto flex items-center justify-between ${variant === 'featured' ? 'pt-5' : 'pt-3'}`}>
          {!isPast ? (
            <span className={`text-primary-500 font-bold ${variant === 'featured' ? 'text-2xl' : 'text-lg'}`}>
              {formatCurrency(trip.price)}
            </span>
          ) : (
            <span className="text-muted text-sm">{formatDateRange(trip.date_from, trip.date_to)}</span>
          )}
          <BaseArrowLink to={ROUTES.tripDetail(trip.slug)}>
            {isPast ? 'Terugblik' : 'Meer info'}
          </BaseArrowLink>
        </div>
      </div>
    </article>
  )
}
