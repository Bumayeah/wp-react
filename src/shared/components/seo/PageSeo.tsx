import { Helmet } from 'react-helmet-async'
import { useSiteOptions } from '@/shared/hooks/useSiteOptions'

interface PageSeoProps {
  title?: string
  description?: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
}

export function PageSeo({ title, description, image, type = 'website', noindex = false }: PageSeoProps) {
  const { data: opts } = useSiteOptions()
  const siteName = opts?.site_name ?? 'SWG Nederland'
  const fullTitle = title ? `${title} | ${siteName}` : siteName
  const fallbackDescription = opts?.site_tagline ?? 'Skiën voor iedereen — groepsreizen voor mensen met en zonder beperking.'

  const metaDescription = description ?? fallbackDescription

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  )
}
