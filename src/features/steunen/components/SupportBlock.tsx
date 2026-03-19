import type { ReactNode } from 'react'
import { AppSection } from '@/shared/components/layout/AppSection'
import { SanitizedHtml } from '@/shared/components/ui/SanitizedHtml'

interface SupportBlockProps {
  id?: string
  title?: string
  content?: string
  imageSrc?: string
  imageAlt?: string
  imagePosition?: 'left' | 'right'
  cta?: ReactNode
}

export function SupportBlock({ id, title, content, imageSrc, imageAlt, imagePosition, cta }: SupportBlockProps) {
  return (
    <AppSection id={id}>
      <div className={`grid gap-10 lg:grid-cols-2 items-center ${imagePosition !== 'right' ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        {/* Image */}
        <div className="rounded-2xl overflow-hidden aspect-4/3 bg-gray-100 dark:bg-white/5">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={imageAlt ?? ''}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-primary-900 to-dark opacity-60" aria-hidden="true" />
          )}
        </div>

        {/* Text */}
        <div className="space-y-5">
          {title && <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>}
          {content && <SanitizedHtml html={content} className="prose prose-sm max-w-none text-muted" />}
          {cta && <div>{cta}</div>}
        </div>
      </div>
    </AppSection>
  )
}
