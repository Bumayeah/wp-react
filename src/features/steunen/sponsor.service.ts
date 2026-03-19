import { apiGet } from '@/shared/services/api'
import type { Sponsor } from './sponsor.schema'

export const sponsorService = {
  getAll: () => apiGet<Sponsor[]>('/swg/v1/sponsors'),
}
