import { usePage } from '@/shared/hooks/usePage'
import { PageHero } from '@/shared/components/layout/PageHero'
import { PageSeo } from '@/shared/components/seo/PageSeo'
import { AppSection } from '@/shared/components/layout/AppSection'
import { SanitizedHtml } from '@/shared/components/ui/SanitizedHtml'
import { PhotoGrid } from '@/shared/components/ui/PhotoGrid'
import { TextImageBlock } from '@/shared/components/blocks/TextImageBlock'
import { CtaBlock } from '@/shared/components/blocks/CtaBlock'

export function AboutPage() {
  const { data: page } = usePage('over-ons')

  const acf = page?.acf as Record<string, any> | undefined
  const galleryPhotos: { src: string; alt: string }[] = acf?.gallery ?? []

  return (
    <>
      <PageSeo
        title={page?.title?.rendered ?? 'Over ons'}
        description={acf?.hero_description}
      />
      <PageHero
        eyebrow={acf?.hero_eyebrow ?? 'Wie zijn wij'}
        title={page?.title?.rendered ?? 'Over ons'}
        description={acf?.hero_description}
      />

      {page?.content?.rendered && (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <SanitizedHtml html={page.content.rendered} className="prose max-w-none text-muted text-lg leading-relaxed" />
        </div>
      )}

      {acf?.text_block_1?.content && (
        <TextImageBlock
          content={acf.text_block_1.content}
          imageSrc={acf.text_block_1.image}
          imageAlt={acf.text_block_1.image_alt ?? ''}
          imagePosition="right"
        />
      )}

      {acf?.show_gallery && (
        <AppSection bg="gray" aria-label="Sfeerimpressie">
          <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">Sfeerimpressie</h2>
          <PhotoGrid photos={galleryPhotos} />
        </AppSection>
      )}

      {acf?.text_block_2?.content && (
        <TextImageBlock
          content={acf.text_block_2.content}
          imageSrc={acf.text_block_2.image}
          imageAlt={acf.text_block_2.image_alt ?? ''}
          imagePosition="left"
        />
      )}

      {acf?.show_cta && (
        <CtaBlock heading={acf?.cta_heading} body={acf?.cta_body} />
      )}
    </>
  )
}
