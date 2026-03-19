import { usePage } from '@/shared/hooks/usePage'
import { ROUTES } from '@/routes'
import { PageSeo } from '@/shared/components/seo/PageSeo'
import type { Stat, Feature } from '@/shared/schemas/page.schema'
import { HeroVideo } from '@/features/home/components/HeroVideo'
import { StatsBar } from '@/features/home/components/StatsBar'
import { WhySWG } from '@/features/home/components/WhySWG'
import { MissionBlock } from '@/features/home/components/MissionBlock'
import { AgendaPreview } from '@/features/home/components/AgendaPreview'
import { TestimonialBlock } from '@/features/home/components/TestimonialBlock'
import { SponsorGrid } from '@/features/home/components/SponsorGrid'
import { CtaBlock } from '@/shared/components/blocks/CtaBlock'

interface HomeAcf {
  hero_tagline?: string
  hero_headline?: string
  hero_description?: string
  stats?: Stat[]
  mission_eyebrow?: string
  mission_title?: string
  mission_intro?: string
  mission_body?: string
  mission_highlights?: string[]
  founded_year_text?: string
  founded_year_detail?: string
  why_swg_eyebrow?: string
  why_swg_title?: string
  why_swg_description?: string
  why_swg_features?: Feature[]
  agenda_preview_eyebrow?: string
  agenda_preview_title?: string
  testimonials_eyebrow?: string
  testimonials_title?: string
  sponsors_eyebrow?: string
  sponsors_title?: string
  cta_heading?: string
  cta_body?: string
}

export function HomePage() {
  const { data: homePage } = usePage('home', 30 * 60 * 1000)

  const acf = homePage?.acf as HomeAcf | undefined

  return (
    <>
      <PageSeo
        description={acf?.hero_description}
      />
      <HeroVideo
        tagline={acf?.hero_tagline ?? 'Skiën voor iedereen'}
        headline={acf?.hero_headline ?? 'Skiën met een beperking? Dat kan!'}
        description={acf?.hero_description ?? ''}
      />
      <StatsBar stats={acf?.stats ?? []} />
      <WhySWG
        eyebrow={acf?.why_swg_eyebrow ?? 'Waarom SWG Nederland?'}
        title={acf?.why_swg_title ?? 'Skiën dat voor iedereen werkt'}
        description={acf?.why_swg_description ?? ''}
        features={acf?.why_swg_features ?? []}
      />
      <MissionBlock
        eyebrow={acf?.mission_eyebrow ?? 'Onze missie'}
        title={acf?.mission_title ?? 'Skiën zou voor iedereen bereikbaar moeten zijn'}
        intro={acf?.mission_intro ?? ''}
        body={acf?.mission_body ?? ''}
        highlights={acf?.mission_highlights ?? []}
        foundedText={acf?.founded_year_text ?? 'Al 15 jaar actief'}
        foundedDetail={acf?.founded_year_detail ?? 'Opgericht in 2009'}
      />
      <AgendaPreview
        eyebrow={acf?.agenda_preview_eyebrow ?? 'Aankomende reizen'}
        title={acf?.agenda_preview_title ?? 'Ski met ons mee'}
      />
      <TestimonialBlock
        eyebrow={acf?.testimonials_eyebrow ?? 'Ervaringen'}
        title={acf?.testimonials_title ?? 'Wat deelnemers zeggen'}
      />
      <SponsorGrid
        eyebrow={acf?.sponsors_eyebrow ?? 'Mede mogelijk gemaakt door'}
        title={acf?.sponsors_title ?? 'Onze sponsors'}
      />
      <CtaBlock
        variant="simple"
        heading={acf?.cta_heading ?? 'Klaar om mee te gaan?'}
        body={acf?.cta_body ?? 'Schrijf je in voor een van onze groepsreizen en maak een onvergetelijke week mee op de piste.'}
        actions={[
          { label: 'Bekijk alle reizen', to: ROUTES.trips, variant: 'secondary' },
          { label: 'Neem contact op', to: ROUTES.contact, variant: 'outline' },
        ]}
      />
    </>
  )
}
