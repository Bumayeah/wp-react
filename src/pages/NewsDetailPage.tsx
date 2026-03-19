import { useParams } from 'react-router-dom'
import { ROUTES } from '@/routes'
import { PageSeo } from '@/shared/components/seo/PageSeo'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { blogService } from '@/features/blog/blog.service'
import { useFormatting } from '@/shared/hooks/useFormatting'
import { PageHero } from '@/shared/components/layout/PageHero'
import { BaseSkeleton } from '@/shared/components/ui/BaseSkeleton'
import { ErrorState } from '@/shared/components/ui/ErrorState'
import { BaseButton } from '@/shared/components/ui/BaseButton'
import { SanitizedHtml } from '@/shared/components/ui/SanitizedHtml'

export function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { formatDateFull } = useFormatting()

  const { data: post, isPending, isError } = useQuery({
    queryKey: queryKeys.post(slug ?? ''),
    queryFn: () => blogService.getPostBySlug(slug!),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  })

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-16 space-y-6">
        <BaseSkeleton className="h-10 w-2/3" />
        <BaseSkeleton className="h-5 w-1/4" />
        <BaseSkeleton className="h-72 w-full" />
        <BaseSkeleton className="h-48 w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16">
        <ErrorState title="Bericht niet gevonden" description="Dit nieuwsbericht bestaat niet of is niet meer beschikbaar.">
          <BaseButton to={ROUTES.news} variant="secondary" className="mt-4">← Terug naar nieuws</BaseButton>
        </ErrorState>
      </div>
    )
  }

  if (!post) return null

  return (
    <article>
      <PageSeo
        title={post.title.rendered}
        description={post.excerpt.rendered.replace(/<[^>]+>/g, '').trim()}
        image={post.featured_media_url}
        type="article"
      />
      <PageHero
        title={post.title.rendered}
        imageSrc={post.featured_media_url}
        backTo="/nieuws"
        backLabel="Alle berichten"
      >
        <p className="text-sm text-white/60 mt-1">{formatDateFull(post.date)}</p>
      </PageHero>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <SanitizedHtml html={post.content.rendered} className="prose prose-sm md:prose max-w-none text-muted" />
      </div>
    </article>
  )
}
