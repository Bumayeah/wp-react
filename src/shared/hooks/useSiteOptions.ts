import { useQuery } from '@tanstack/react-query'
import { pageService } from '@/shared/services/page.service'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useSiteOptions() {
  return useQuery({
    queryKey: queryKeys.siteOptions(),
    queryFn: () => pageService.getSiteOptions(),
    staleTime: 60 * 60 * 1000, // 1 hour — site options change rarely
  })
}
