import { Users, BadgeCheck, Settings2, Heart } from 'lucide-react'
import { AppSection } from '@/shared/components/layout/AppSection'
import { SectionHeader } from '@/shared/components/ui/SectionHeader'
import { BaseButton } from '@/shared/components/ui/BaseButton'
import { ROUTES } from '@/routes'

interface WhySWGProps {
  eyebrow: string
  title: string
  description: string
  features: Array<{ title: string; description: string }>
}

const featureIcons = [Users, BadgeCheck, Settings2, Heart]

export function WhySWG({ eyebrow, title, description, features }: WhySWGProps) {
  return (
    <AppSection bg="white" aria-labelledby="why-swg-title">
      <div className="max-w-2xl mb-16">
        <SectionHeader eyebrow={eyebrow} headingId="why-swg-title" title={title} description={description} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => {
          const Icon = featureIcons[index % featureIcons.length]
          return (
          <div
            key={feature.title}
            className="group rounded-2xl border border-gray-100 dark:border-white/8 bg-gray-50 dark:bg-dark-secondary p-7 hover:border-primary-500/30 hover:shadow-md transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-5 group-hover:bg-primary-500/15 transition-colors">
              <Icon className="w-6 h-6 text-primary-500" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
          </div>
          )
        })}
      </div>

      <div className="mt-12 flex justify-center">
        <BaseButton to={ROUTES.about} variant="ghost">Meer over SWG Nederland →</BaseButton>
      </div>
    </AppSection>
  )
}
