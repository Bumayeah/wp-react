import { apiGet, apiPatch } from '@/shared/services/api'
import type { AgendaItem } from './agenda.schema'

export const agendaService = {
  getAll: () => apiGet<AgendaItem[]>('/swg/v1/agenda'),

  getBySlug: (slug: string) =>
    apiGet<AgendaItem[]>('/swg/v1/agenda', { slug }).then((items) => {
      const item = items[0]
      if (!item) throw new Error(`Trip not found: ${slug}`)
      return item
    }),

  patchSpots: (id: number, spots_available: number) =>
    apiPatch<AgendaItem>(`/swg/v1/agenda/${id}`, { spots_available }),
}
