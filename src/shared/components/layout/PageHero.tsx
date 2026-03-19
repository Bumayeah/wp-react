import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface PageHeroProps {
  eyebrow?: string
  title: string
  description?: string
  imageSrc?: string
  backTo?: string
  backLabel?: string
  children?: ReactNode
}

export function PageHero({ eyebrow, title, description, imageSrc, backTo, backLabel, children }: PageHeroProps) {
  return (
    <div className="bg-dark relative overflow-hidden py-16 text-white md:py-24">
      {imageSrc && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${imageSrc})` }}
          aria-hidden="true"
        />
      )}
      {imageSrc && (
        <div className="from-dark absolute inset-0 bg-linear-to-t to-transparent" aria-hidden="true" />
      )}
      <div className="relative container mx-auto px-4">
        {backTo && (
          <Link
            to={backTo}
            className="text-accent-500 mb-3 inline-flex items-center gap-1 text-sm font-semibold tracking-widest uppercase transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {backLabel}
          </Link>
        )}
        {eyebrow && (
          <p className="text-accent-500 mb-3 text-sm font-semibold tracking-widest uppercase">{eyebrow}</p>
        )}
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">{title}</h1>
        {description && <p className="max-w-xl text-lg text-white/70">{description}</p>}
        {children}
      </div>
    </div>
  )
}
