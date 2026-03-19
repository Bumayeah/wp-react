import { useQuery } from '@tanstack/react-query'
import { pageService } from '@/shared/services/page.service'
import { queryKeys } from '@/shared/lib/queryKeys'

/**
 * Fetches a WordPress page by its slug.
 * The slug is the WordPress content slug (Dutch), independent of the app's route paths.
 */
export function usePage(slug: string, staleTime = 10 * 60 * 1000) {
  return useQuery({
    queryKey: queryKeys.pages(slug),
    queryFn: () => pageService.getBySlug(slug),
    staleTime,
  })
}
