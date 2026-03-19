import { Heart, Building2, User } from 'lucide-react'
import { BaseButton } from '@/shared/components/ui/BaseButton'
import { ROUTES } from '@/routes'
import { useSiteOptions } from '@/shared/hooks/useSiteOptions'

interface CtaBlockProps {
  variant?: 'triple' | 'simple'
  heading?: string
  body?: string
  actions?: { label: string; to: string; variant?: string }[]
}

export function CtaBlock({ variant, heading, body, actions }: CtaBlockProps) {
  const { data: opts } = useSiteOptions()
  const cta = opts?.cta_triple

  if (!variant || variant === 'triple') {
    return (
      <section className="bg-primary-800 text-white py-16 md:py-20" aria-labelledby="cta-heading">
        <div className="container mx-auto px-4">
          <h2 id="cta-heading" className="text-2xl md:text-3xl font-bold text-center mb-10">
            {heading ?? cta?.heading_fallback ?? 'Doe mee met SWG Nederland'}
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="bg-white/10 rounded-2xl p-6 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
                <Heart className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-lg">{cta?.donor.title ?? 'Donateur worden'}</h3>
              <p className="text-white/80 text-sm">{cta?.donor.description ?? 'Steun SWG met een eenmalige of jaarlijkse donatie.'}</p>
              <BaseButton to={`${ROUTES.support}#donatie`} variant="ghost" className="w-full justify-center border border-white/30 hover:bg-white/10 text-white">
                {cta?.donor.button ?? 'Doneer nu →'}
              </BaseButton>
            </div>

            <div className="bg-white/10 rounded-2xl p-6 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
                <Building2 className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-lg">{cta?.sponsor.title ?? 'Sponsor worden'}</h3>
              <p className="text-white/80 text-sm">{cta?.sponsor.description ?? 'Verbind uw naam aan een bijzondere stichting.'}</p>
              <BaseButton to={`${ROUTES.support}#sponsoren`} variant="ghost" className="w-full justify-center border border-white/30 hover:bg-white/10 text-white">
                {cta?.sponsor.button ?? 'Meer info →'}
              </BaseButton>
            </div>

            <div className="bg-white/10 rounded-2xl p-6 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
                <User className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-lg">{cta?.volunteer.title ?? 'Vrijwilliger worden'}</h3>
              <p className="text-white/80 text-sm">{cta?.volunteer.description ?? 'Help mee op de piste of achter de schermen.'}</p>
              <BaseButton to={ROUTES.contact} variant="ghost" className="w-full justify-center border border-white/30 hover:bg-white/10 text-white">
                {cta?.volunteer.button ?? 'Aanmelden →'}
              </BaseButton>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-primary-800 text-white py-16" aria-labelledby="cta-heading-simple">
      <div className="container mx-auto px-4 text-center">
        <h2 id="cta-heading-simple" className="text-2xl md:text-3xl font-bold mb-4">{heading}</h2>
        {body && <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">{body}</p>}
        <div className="flex flex-wrap gap-3 justify-center">
          {actions?.map((action) => (
            <BaseButton
              key={action.to}
              to={action.to}
              variant={action.variant === 'outline' ? 'ghost' : 'secondary'}
              className={action.variant === 'outline' ? 'border border-white/30 hover:bg-white/10 text-white' : ''}
            >
              {action.label}
            </BaseButton>
          ))}
        </div>
      </div>
    </section>
  )
}
