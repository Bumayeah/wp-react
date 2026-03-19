import { apiGet } from './api'
import { PageSchema, SiteOptionsSchema } from '../schemas/page.schema'
import type { Page, SiteOptions } from '../schemas/page.schema'

export const pageService = {
  async getBySlug(slug: string): Promise<Page> {
    const pages = await apiGet<unknown[]>('/wp/v2/pages', { slug })
    const page = pages[0]
    if (!page) throw new Error(`Page not found: ${slug}`)
    return PageSchema.parse(page)
  },

  async getSiteOptions(): Promise<SiteOptions> {
    const data = await apiGet<unknown>('/acf/v3/options/options')
    return SiteOptionsSchema.parse(data)
  },
}
