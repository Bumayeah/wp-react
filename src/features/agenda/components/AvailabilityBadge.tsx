import type { AvailabilityStatus } from '../agenda.schema'
import { AVAILABILITY_COLOR } from '../agenda.schema'

interface AvailabilityBadgeProps {
  status: AvailabilityStatus
  spotsAvailable: number
  spotsTotal: number
}

const dotClass: Record<AvailabilityStatus, string> = {
  available: 'bg-success',
  limited: 'bg-warning',
  waitlist: 'bg-primary-500',
  full: 'bg-muted',
}

export function AvailabilityBadge({ status, spotsAvailable }: AvailabilityBadgeProps) {
  return (
    <span
      role="status"
      className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full ${AVAILABILITY_COLOR[status]}`}
    >
      <span className={`inline-block w-2 h-2 rounded-full ${dotClass[status]}`} aria-hidden="true" />
      {status === 'available' && `${spotsAvailable} plekken beschikbaar`}
      {status === 'limited' && `Nog maar ${spotsAvailable} plekken!`}
      {status === 'waitlist' && 'Vol — wachtlijst open'}
      {status === 'full' && 'Vol'}
    </span>
  )
}
