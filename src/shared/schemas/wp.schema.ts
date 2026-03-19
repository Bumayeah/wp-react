import { z } from 'zod'

// Shared WordPress REST API types

export const WpRenderedSchema = z.object({
  rendered: z.string(),
})

const WpPageBaseSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: WpRenderedSchema,
  content: WpRenderedSchema,
})

// Factory for typed ACF fields per page — e.g. makeWpPageSchema(z.object({ intro: z.string() }))
export function makeWpPageSchema<T extends z.ZodTypeAny>(acfSchema: T) {
  return WpPageBaseSchema.extend({ acf: acfSchema.optional() })
}

// Generic fallback — use makeWpPageSchema() for pages with known ACF structure
export const WpPageSchema = makeWpPageSchema(z.record(z.string(), z.unknown()))

export type WpPage = z.infer<typeof WpPageSchema>
