import photoUrl from '@/assets/swg-07.jpg'
import { CheckCircle2 } from 'lucide-react'
import { AppSection } from '@/shared/components/layout/AppSection'
import { SectionHeader } from '@/shared/components/ui/SectionHeader'
import { BaseButton } from '@/shared/components/ui/BaseButton'
import { ROUTES } from '@/routes'

interface MissionBlockProps {
  eyebrow: string
  title: string
  intro: string
  body: string
  highlights: string[]
  foundedText: string
  foundedDetail: string
}

export function MissionBlock({ eyebrow, title, intro, body, highlights, foundedText, foundedDetail }: MissionBlockProps) {
  return (
    <AppSection>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Image */}
        <div className="relative order-last aspect-4/3 overflow-hidden rounded-2xl shadow-xl lg:order-first">
          <img
            src={photoUrl}
            alt="Skiinstructeur met deelnemer op de piste"
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            width={800}
            height={600}
          />
          {/* Floating badge */}
          <div className="dark:bg-dark absolute bottom-6 left-6 flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-lg">
            <div className="bg-primary-500/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <CheckCircle2 className="text-primary-500 h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold dark:text-white">{foundedText}</p>
              <p className="text-muted text-xs">{foundedDetail}</p>
            </div>
          </div>
        </div>

        {/* Text */}
        <div>
          <SectionHeader eyebrow={eyebrow} headingId="mission-title" title={title} className="mb-6" />
          <div className="text-muted space-y-4 text-base leading-relaxed">
            <p>{intro}</p>
            <p>{body}</p>
          </div>

          <ul className="mt-8 space-y-3" role="list">
            {highlights.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm dark:text-white/90">
                <CheckCircle2 className="text-primary-500 mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <BaseButton to={ROUTES.about} size="lg">Over de organisatie →</BaseButton>
            <BaseButton to={ROUTES.contact} variant="secondary" size="lg">Neem contact op</BaseButton>
          </div>
        </div>
      </div>
    </AppSection>
  )
}
