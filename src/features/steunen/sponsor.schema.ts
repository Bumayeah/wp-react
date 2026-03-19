import { z } from 'zod'

export const TIER_ORDER = ['Goud', 'Zilver', 'Brons'] as const
export type SponsorTier = typeof TIER_ORDER[number]

export const SponsorSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string(),
  tier: z.enum(TIER_ORDER),
  url: z.string(),
  sort_order: z.number(),
})

export type Sponsor = z.infer<typeof SponsorSchema>

export function sortSponsors(sponsors: Sponsor[]): Sponsor[] {
  return [...sponsors].sort((a, b) => {
    const tierSort = TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier)
    return tierSort !== 0 ? tierSort : a.sort_order - b.sort_order
  })
}
