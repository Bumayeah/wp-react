import type { ElementType } from 'react'
import DOMPurify from 'dompurify'

interface SanitizedHtmlProps {
  html: string
  className?: string
  tag?: ElementType
}

export function SanitizedHtml({ html, className, tag: Tag = 'div' }: SanitizedHtmlProps) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 'ul', 'ol', 'li', 'a', 'h2', 'h3', 'h4', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  })

  return <Tag className={className} dangerouslySetInnerHTML={{ __html: clean }} />
}
