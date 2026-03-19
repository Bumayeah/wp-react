import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { sponsorService } from '@/features/steunen/sponsor.service'
import { sortSponsors } from '@/features/steunen/sponsor.schema'
import { AppSection } from '@/shared/components/layout/AppSection'
import { SectionHeader } from '@/shared/components/ui/SectionHeader'
import { BaseSkeleton } from '@/shared/components/ui/BaseSkeleton'
import { BaseButton } from '@/shared/components/ui/BaseButton'
import { ROUTES } from '@/routes'

interface SponsorGridProps {
  eyebrow: string
  title: string
  intro?: string
}

function logoUrl(filename: string): string {
  return new URL(`../../../assets/sponsors/${filename}`, import.meta.url).href
}

const tierWidth: Record<string, string> = {
  'Goud': 'w-36 md:w-44',
  'Zilver': 'w-28 md:w-36',
}

export function SponsorGrid({ eyebrow, title, intro }: SponsorGridProps) {
  const { data: sponsors, isPending } = useQuery({
    queryKey: queryKeys.sponsors(),
    queryFn: sponsorService.getAll,
    staleTime: 10 * 60 * 1000,
  })

  const sorted = sortSponsors(sponsors ?? [])

  const SponsorItem = ({ sponsor, keyPrefix }: { sponsor: typeof sorted[0]; keyPrefix: string }) => {
    const width = tierWidth[sponsor.tier] ?? 'w-24 md:w-28'
    const cls = `block shrink-0 transition-opacity hover:opacity-80 ${width}`
    if (sponsor.url) {
      return (
        <a key={`${keyPrefix}-${sponsor.id}`} href={sponsor.url} target="_blank" rel="noopener noreferrer" className={cls}>
          <img src={logoUrl(sponsor.logo)} alt={sponsor.name} className="w-full h-12 object-contain" loading="lazy" decoding="async" />
        </a>
      )
    }
    return (
      <div key={`${keyPrefix}-${sponsor.id}`} className={cls}>
        <img src={logoUrl(sponsor.logo)} alt={sponsor.name} className="w-full h-12 object-contain" loading="lazy" decoding="async" />
      </div>
    )
  }

  return (
    <AppSection bg="dark" aria-labelledby="sponsors-title" id="sponsoren">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        headingId="sponsors-title"
        align="center"
        theme="inverted"
        description={intro}
        className="mb-10"
      />

      {isPending ? (
        <div className="flex gap-10 justify-center overflow-hidden">
          {Array.from({ length: 6 }, (_, i) => (
            <BaseSkeleton key={i} className="h-12 w-32 shrink-0" />
          ))}
        </div>
      ) : (
        <div className="relative overflow-hidden" aria-label="Onze sponsors">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-dark to-transparent z-10" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-dark to-transparent z-10" aria-hidden="true" />

          {/* Scrolling track */}
          <div className="flex items-center gap-12 md:gap-16 w-max animate-marquee hover:pause-marquee" aria-hidden="true">
            {sorted.map((sponsor) => <SponsorItem key={`a-${sponsor.id}`} sponsor={sponsor} keyPrefix="a" />)}
            {sorted.map((sponsor) => <SponsorItem key={`b-${sponsor.id}`} sponsor={sponsor} keyPrefix="b" />)}
          </div>

          {/* Accessible list */}
          <ul role="list" className="sr-only">
            {sorted.map((sponsor) => (
              <li key={sponsor.id}>
                {sponsor.url ? (
                  <a href={sponsor.url} target="_blank" rel="noopener noreferrer">{sponsor.name}</a>
                ) : (
                  <span>{sponsor.name}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10 text-center">
        <BaseButton to={`${ROUTES.support}#sponsoren`} variant="ghost" size="sm">Sponsor worden →</BaseButton>
      </div>
    </AppSection>
  )
}
