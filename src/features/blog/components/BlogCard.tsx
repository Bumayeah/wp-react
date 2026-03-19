import { useQueryClient } from '@tanstack/react-query'
import { FileText } from 'lucide-react'
import type { Post } from '../blog.schema'
import { useFormatting } from '@/shared/hooks/useFormatting'
import { BaseArrowLink } from '@/shared/components/ui/BaseArrowLink'
import { BaseImage } from '@/shared/components/ui/BaseImage'
import { SanitizedHtml } from '@/shared/components/ui/SanitizedHtml'
import { ROUTES } from '@/routes'

interface BlogCardProps {
  post: Post
}

export function BlogCard({ post }: BlogCardProps) {
  const queryClient = useQueryClient()
  const { formatDate } = useFormatting()

  function onMouseEnter() {
    if (!queryClient.getQueryData(['posts', post.slug])) {
      queryClient.setQueryData(['posts', post.slug], post)
    }
  }

  return (
    <article
      className="relative group rounded-2xl overflow-hidden bg-white dark:bg-dark-secondary shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
      onMouseEnter={onMouseEnter}
    >
      {/* Image */}
      <div className="relative aspect-video bg-gray-100 dark:bg-white/5 overflow-hidden">
        {post.featured_media_url ? (
          <BaseImage
            src={post.featured_media_url}
            alt=""
            width={800}
            height={450}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">
            <FileText className="w-12 h-12" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-5 flex-1">
        <p className="text-xs text-muted">{formatDate(post.date)}</p>
        <h3 className="text-lg font-semibold leading-snug">{post.title.rendered}</h3>
        <SanitizedHtml tag="p" html={post.excerpt.rendered} className="text-sm text-muted leading-relaxed line-clamp-3" />

        <div className="mt-auto pt-3">
          <BaseArrowLink to={ROUTES.newsDetail(post.slug)}>Lees verder</BaseArrowLink>
        </div>
      </div>
    </article>
  )
}
