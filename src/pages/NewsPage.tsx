import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PageSeo } from '@/shared/components/seo/PageSeo'
import { queryKeys } from '@/shared/lib/queryKeys'
import { blogService } from '@/features/blog/blog.service'
import { usePage } from '@/shared/hooks/usePage'
import { BlogCard } from '@/features/blog/components/BlogCard'
import { PageHero } from '@/shared/components/layout/PageHero'
import { BaseSkeleton } from '@/shared/components/ui/BaseSkeleton'
import { ErrorState } from '@/shared/components/ui/ErrorState'
import { EmptyState } from '@/shared/components/ui/EmptyState'
import { BasePagination } from '@/shared/components/ui/BasePagination'

const PER_PAGE = 9

export function NewsPage() {
  const [currentPage, setCurrentPage] = useState(1)

  const { data: page } = usePage('nieuws', 30 * 60 * 1000)

  const { data: posts, isPending, isError, refetch } = useQuery({
    queryKey: queryKeys.posts(),
    queryFn: () => blogService.getPosts(),
    staleTime: 5 * 60 * 1000,
  })

  const totalPages = Math.ceil((posts?.length ?? 0) / PER_PAGE)
  const pagedPosts = (posts ?? []).slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  function handlePageChange(p: number) {
    setCurrentPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <PageSeo
        title={page?.title?.rendered ?? 'Nieuws'}
        description={(page?.acf as any)?.hero_description}
      />
      <PageHero
        eyebrow={(page?.acf as any)?.hero_eyebrow ?? 'Nieuws'}
        title={page?.title?.rendered ?? 'Nieuws'}
        description={(page?.acf as any)?.hero_description}
      />

      <div className="container mx-auto px-4 py-16">
        {isPending ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => <BaseSkeleton key={i} className="h-80" />)}
          </div>
        ) : isError ? (
          <ErrorState description="Nieuwsberichten konden niet worden geladen." retry={refetch} />
        ) : !posts?.length ? (
          <EmptyState title="Geen berichten" description="Er zijn momenteel geen nieuwsberichten. Kom later terug." />
        ) : (
          <>
            <ul role="list" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pagedPosts.map((post) => (
                <li key={post.id}><BlogCard post={post} /></li>
              ))}
            </ul>
            <BasePagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </>
  )
}
