import { z } from 'zod'

export const AgendaAcfSchema = z.object({
  program: z.string().optional(),
  included: z.string().optional(),
  level: z.string().optional(),
  gallery: z.array(z.object({ src: z.string(), alt: z.string() })).optional(),
  testimonials: z.array(z.object({ name: z.string(), quote: z.string() })).optional(),
})

export const AgendaItemSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  location: z.string(),
  date_from: z.string(),
  date_to: z.string(),
  registration_deadline: z.string().optional(),
  description: z.string(),
  spots_total: z.number(),
  spots_available: z.number(),
  price: z.number(),
  image: z.string(),
  acf: AgendaAcfSchema.optional(),
})

export type AgendaItem = z.infer<typeof AgendaItemSchema>

export type AvailabilityStatus = 'available' | 'limited' | 'waitlist' | 'full'

export function getAvailabilityStatus(trip: AgendaItem): AvailabilityStatus {
  if (trip.spots_available > 0) {
    const pct = trip.spots_available / trip.spots_total
    return pct >= 0.25 ? 'available' : 'limited'
  }
  // Mock API doesn't have waitlist_open — default to full when sold out
  return 'full'
}

export const AVAILABILITY_LABEL: Record<AvailabilityStatus, string> = {
  available: 'Beschikbaar',
  limited: 'Beperkt beschikbaar',
  waitlist: 'Wachtlijst',
  full: 'Vol',
}

export const AVAILABILITY_COLOR: Record<AvailabilityStatus, string> = {
  available: 'text-success bg-success/10',
  limited: 'text-warning bg-warning/10',
  waitlist: 'text-accent-500 bg-accent-500/10',
  full: 'text-muted bg-muted/10',
}
