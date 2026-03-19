import { z } from 'zod'

export const PageAcfSchema = z
  .object({
    hero_eyebrow: z.string().optional(),
    hero_description: z.string().optional(),
    show_gallery: z.boolean().optional(),
    show_cta: z.boolean().optional(),
    cta_heading: z.string().optional(),
    cta_body: z.string().optional(),
    sponsors_intro: z.string().optional(),
  })
  .passthrough()

export const PageSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.object({ rendered: z.string() }),
  content: z.object({ rendered: z.string() }),
  acf: PageAcfSchema.optional(),
})

export type Page = z.infer<typeof PageSchema>
export type PageAcf = z.infer<typeof PageAcfSchema>

export const StatSchema = z.object({ value: z.string(), label: z.string() })
export const FeatureSchema = z.object({ title: z.string(), description: z.string() })

const NavLabelsSchema = z.object({
  home: z.string(), trips: z.string(), news: z.string(), about: z.string(),
  faq: z.string(), contact: z.string(), support: z.string(), board: z.string(),
  privacy: z.string(), cookies: z.string(), terms: z.string(),
}).optional()

const HeaderLabelsSchema = z.object({
  cta: z.string(), login: z.string(),
}).optional()

const TopbarLabelsSchema = z.object({
  next_trip_prefix: z.string(), about: z.string(), support: z.string(),
  login: z.string(), my_account: z.string(),
}).optional()

const FooterLabelsSchema = z.object({
  privacy: z.string(), cookies: z.string(), terms: z.string(),
}).optional()

const CtaCardSchema = z.object({ title: z.string(), description: z.string(), button: z.string() })

const CtaTripleSchema = z.object({
  heading_fallback: z.string(),
  donor: CtaCardSchema,
  sponsor: CtaCardSchema,
  volunteer: CtaCardSchema,
}).optional()

export const SiteOptionsSchema = z.object({
  id: z.number(),
  site_name: z.string(),
  site_tagline: z.string(),
  organization_name: z.string(),
  contact_email: z.string(),
  contact_phone: z.string(),
  postal_address: z.string(),
  kvk_number: z.string(),
  iban_number: z.string(),
  bic_code: z.string(),
  footer_description: z.string(),
  facebook_url: z.string(),
  instagram_url: z.string(),
  nav_labels: NavLabelsSchema,
  header_labels: HeaderLabelsSchema,
  topbar_labels: TopbarLabelsSchema,
  footer_labels: FooterLabelsSchema,
  cta_triple: CtaTripleSchema,
})

export type SiteOptions = z.infer<typeof SiteOptionsSchema>
export type Stat = z.infer<typeof StatSchema>
export type Feature = z.infer<typeof FeatureSchema>
