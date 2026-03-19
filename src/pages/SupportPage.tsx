import { usePage } from '@/shared/hooks/usePage'
import { ROUTES } from '@/routes'
import { PageSeo } from '@/shared/components/seo/PageSeo'
import { PageHero } from '@/shared/components/layout/PageHero'
import { SanitizedHtml } from '@/shared/components/ui/SanitizedHtml'
import { BaseButton } from '@/shared/components/ui/BaseButton'
import { SupportBlock } from '@/features/steunen/components/SupportBlock'
import { IDealFlow } from '@/features/steunen/components/IDealFlow'
import { SponsorGrid } from '@/features/home/components/SponsorGrid'

export function SupportPage() {
  const { data: page } = usePage('steunen')

  const acf = page?.acf as Record<string, any> | undefined

  return (
    <>
      <PageSeo
        title={page?.title?.rendered ?? 'Steunen'}
        description={acf?.hero_description}
      />
      <PageHero
        eyebrow={acf?.hero_eyebrow ?? 'Steunen'}
        title={page?.title?.rendered ?? 'Steunen'}
        description={acf?.hero_description}
      />

      {page?.content?.rendered && (
        <div className="container mx-auto max-w-3xl px-4 py-10">
          <SanitizedHtml html={page.content.rendered} className="prose text-muted max-w-none" />
        </div>
      )}

      <SupportBlock
        id="vrijwilliger"
        title={acf?.volunteer?.title ?? 'Vrijwilliger worden'}
        content={acf?.volunteer?.content}
        imageSrc={acf?.volunteer?.image}
        imageAlt={acf?.volunteer?.image_alt ?? 'Vrijwilligers op de piste'}
        imagePosition="left"
        cta={<BaseButton to={ROUTES.contact}>Meld je aan als vrijwilliger →</BaseButton>}
      />

      <div className="border-t border-gray-100 dark:border-white/5" />

      <SupportBlock
        id="donatie"
        title={acf?.donation?.title ?? 'Donateur worden'}
        content={acf?.donation?.content}
        imageSrc={acf?.donation?.image}
        imageAlt={acf?.donation?.image_alt ?? 'Deelnemers op de piste'}
        imagePosition="right"
        cta={<IDealFlow />}
      />

      <div className="border-t border-gray-100 dark:border-white/5" />

      <SupportBlock
        id="sponsoren"
        title={acf?.sponsor?.title ?? 'Sponsor worden'}
        content={acf?.sponsor?.content}
        imageSrc={acf?.sponsor?.image}
        imageAlt={acf?.sponsor?.image_alt ?? 'SWG sponsors'}
        imagePosition="left"
        cta={<BaseButton to={ROUTES.contact}>Neem contact op →</BaseButton>}
      />

      <SponsorGrid
        eyebrow={acf?.sponsors_eyebrow ?? 'Mede mogelijk gemaakt door'}
        title={acf?.sponsors_title ?? 'Onze sponsors'}
        intro={acf?.sponsors_intro}
      />
    </>
  )
}
