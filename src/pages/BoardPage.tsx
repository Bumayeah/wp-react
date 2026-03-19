import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { boardService } from '@/features/board/board.service'
import { sortBoardMembers } from '@/features/board/board.schema'
import { usePage } from '@/shared/hooks/usePage'
import { ROUTES } from '@/routes'
import { PageSeo } from '@/shared/components/seo/PageSeo'
import { BoardCard } from '@/features/board/components/BoardCard'
import { PageHero } from '@/shared/components/layout/PageHero'
import { BaseSkeleton } from '@/shared/components/ui/BaseSkeleton'
import { ErrorState } from '@/shared/components/ui/ErrorState'
import { CtaBlock } from '@/shared/components/blocks/CtaBlock'

export function BoardPage() {
  const { data: page } = usePage('algemeenbestuur', 30 * 60 * 1000)

  const { data: members, isPending, isError } = useQuery({
    queryKey: queryKeys.board(),
    queryFn: boardService.getAll,
    staleTime: 10 * 60 * 1000,
  })

  const sorted = sortBoardMembers(members ?? [])

  return (
    <>
      <PageSeo
        title={page?.title?.rendered ?? 'Bestuur'}
        description={(page?.acf as any)?.hero_description}
      />
      <PageHero
        eyebrow={(page?.acf as any)?.hero_eyebrow ?? 'Bestuur'}
        title={page?.title?.rendered ?? 'Algemeen bestuur'}
        description={(page?.acf as any)?.hero_description}
      />

      <section className="container mx-auto px-4 py-16" aria-labelledby="board-heading">
        <h2 id="board-heading" className="sr-only">Bestuursleden</h2>

        {isPending ? (
          <ul role="list" className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 5 }, (_, i) => (
              <li key={i} aria-hidden="true"><BaseSkeleton className="h-80" /></li>
            ))}
          </ul>
        ) : isError ? (
          <ErrorState description="Bestuursleden konden niet worden geladen." />
        ) : (
          <ul role="list" className="grid gap-6 md:grid-cols-2">
            {sorted.map((member) => (
              <li key={member.id} className="h-full">
                <BoardCard member={member} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <CtaBlock
        variant="simple"
        heading="Steun SWG Nederland"
        body="Helpen skiën toegankelijk te maken voor iedereen?"
        actions={[
          { label: 'Doneer nu', to: `${ROUTES.support}#donatie` },
          { label: 'Word sponsor', to: `${ROUTES.support}#sponsoren`, variant: 'outline' },
        ]}
      />
    </>
  )
}
