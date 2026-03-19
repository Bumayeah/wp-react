import { usePage } from '@/shared/hooks/usePage'
import { PageHero } from '@/shared/components/layout/PageHero'
import { PageSeo } from '@/shared/components/seo/PageSeo'
import { BaseSkeleton } from '@/shared/components/ui/BaseSkeleton'
import { SanitizedHtml } from '@/shared/components/ui/SanitizedHtml'

export function CookiesPage() {
  const { data: page, isPending } = usePage('cookies')

  return (
    <>
      <PageSeo title={page?.title?.rendered ?? 'Cookiebeleid'} noindex />
      <PageHero
        eyebrow={(page?.acf as any)?.hero_eyebrow ?? 'Juridisch'}
        title={page?.title?.rendered ?? 'Cookiebeleid'}
      />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {isPending ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }, (_, i) => <BaseSkeleton key={i} className="h-6 w-full" />)}
          </div>
        ) : page?.content?.rendered ? (
          <SanitizedHtml html={page.content.rendered} className="prose max-w-none text-muted leading-relaxed" />
        ) : null}
      </div>
    </>
  )
}
