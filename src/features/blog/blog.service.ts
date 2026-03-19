import { apiGet } from '@/shared/services/api'
import type { Post } from './blog.schema'

export const blogService = {
  getPosts: (params?: { per_page?: string; page?: string }) =>
    apiGet<Post[]>('/wp/v2/posts', params as Record<string, string> | undefined),

  getPostBySlug: (slug: string) =>
    apiGet<Post[]>('/wp/v2/posts', { slug }).then((posts) => {
      const post = posts[0]
      if (!post) throw new Error(`Post not found: ${slug}`)
      return post
    }),
}
