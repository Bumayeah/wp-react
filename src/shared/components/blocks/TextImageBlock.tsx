import { AppSection } from '@/shared/components/layout/AppSection'
import { SanitizedHtml } from '@/shared/components/ui/SanitizedHtml'

interface TextImageBlockProps {
  content: string
  imageSrc?: string
  imageAlt?: string
  imagePosition?: 'left' | 'right'
}

export function TextImageBlock({ content, imageSrc, imageAlt, imagePosition }: TextImageBlockProps) {
  return (
    <AppSection>
      <div className={`grid gap-10 lg:grid-cols-2 items-center ${imagePosition === 'left' ? 'lg:[&>*:first-child]:order-2' : ''}`}>
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
        <div>
          <SanitizedHtml html={content} className="prose max-w-none text-muted" />
        </div>
      </div>
    </AppSection>
  )
}
