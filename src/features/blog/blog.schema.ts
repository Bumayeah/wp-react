import { z } from 'zod'

export const PostSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.object({ rendered: z.string() }),
  excerpt: z.object({ rendered: z.string() }),
  content: z.object({ rendered: z.string() }),
  date: z.string(),
  featured_media_url: z.string(),
})

export type Post = z.infer<typeof PostSchema>
