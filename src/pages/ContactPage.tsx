import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Mail, CheckCircle2 } from 'lucide-react'
import { PageSeo } from '@/shared/components/seo/PageSeo'
import { ROUTES } from '@/routes'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { usePage } from '@/shared/hooks/usePage'
import { apiPost } from '@/shared/services/api'
import { useInputClass } from '@/shared/hooks/useInputClass'
import { PageHero } from '@/shared/components/layout/PageHero'
import { AppSection } from '@/shared/components/layout/AppSection'
import { SidebarLayout } from '@/shared/components/layout/SidebarLayout'
import { AlertBanner } from '@/shared/components/ui/AlertBanner'
import { BaseFormField } from '@/shared/components/ui/BaseFormField'
import { BaseButton } from '@/shared/components/ui/BaseButton'
import { BaseCard } from '@/shared/components/ui/BaseCard'
import { CtaBlock } from '@/shared/components/blocks/CtaBlock'

const schema = z.object({
  naam: z.string().min(2, 'Vul je naam in'),
  email: z.string().email('Vul een geldig e-mailadres in'),
  telefoon: z.string().optional(),
  bericht: z.string().min(10, 'Vul een bericht in van minimaal 10 tekens'),
  privacy: z.literal(true, { error: 'Je moet akkoord gaan met de privacyverklaring' }),
  honeypot: z.string().max(0).optional(),
})

type FormValues = z.infer<typeof schema>

export function ContactPage() {
  const inputClass = useInputClass()
  const [submitted, setSubmitted] = useState(false)

  const { data: page } = usePage('contact', 30 * 60 * 1000)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit(async (values) => {
    await apiPost('/gf/v2/forms/2/submissions', {
      input_1: values.naam,
      input_2: values.email,
      input_3: values.telefoon ?? '',
      input_4: values.bericht,
    })
    reset()
    setSubmitted(true)
  })

  const sidebar = (
    <div className="space-y-4">
      <BaseCard>
        <h2 className="text-base font-semibold mb-4 dark:text-white">Contactgegevens</h2>
        <dl className="space-y-3 text-sm text-muted">
          <div className="flex items-start gap-3">
            <dt className="sr-only">Organisatie</dt>
            <Building2 className="w-5 h-5 mt-0.5 shrink-0 text-primary-500" aria-hidden="true" />
            <dd>Stichting Wintersport Gehandicapten Nederland</dd>
          </div>
          <div className="flex items-start gap-3">
            <dt className="sr-only">E-mail</dt>
            <Mail className="w-5 h-5 mt-0.5 shrink-0 text-primary-500" aria-hidden="true" />
            <dd><a href="mailto:info@swg-nederland.nl" className="hover:text-primary-500 transition-colors">info@swg-nederland.nl</a></dd>
          </div>
        </dl>
      </BaseCard>

      <BaseCard>
        <h2 className="text-base font-semibold mb-2 dark:text-white">Aanmelden voor een reis?</h2>
        <p className="text-sm text-muted mb-4">Schrijf je in voor een van onze groepsreizen op de agendapagina.</p>
        <BaseButton to={ROUTES.trips} variant="secondary" size="sm">Bekijk reizen →</BaseButton>
      </BaseCard>

      <BaseCard variant="accent">
        <h2 className="text-base font-semibold mb-2 dark:text-white">Meedoen als vrijwilliger?</h2>
        <p className="text-sm text-muted mb-4">We zijn altijd op zoek naar enthousiaste begeleiders. Stuur ons een bericht of bel ons op.</p>
        <BaseButton to={ROUTES.about} variant="ghost" size="sm">Meer over vrijwilligerswerk →</BaseButton>
      </BaseCard>
    </div>
  )

  return (
    <>
      <PageSeo
        title={page?.title?.rendered ?? 'Contact'}
        description={(page?.acf as any)?.hero_description}
      />
      <PageHero
        eyebrow={(page?.acf as any)?.hero_eyebrow ?? 'Contact'}
        title={page?.title?.rendered ?? 'Contact'}
        description={(page?.acf as any)?.hero_description}
      />

      <AppSection tag="div">
        <SidebarLayout sidebar={sidebar}>
          <div className="lg:pr-32">
            {submitted ? (
              <AlertBanner variant="success" size="lg" role="status" aria-live="polite">
                <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" aria-hidden="true" />
                <h2 className="text-xl font-semibold mb-2 dark:text-white">Bericht ontvangen!</h2>
                <p className="text-muted">Bedankt voor je bericht. We nemen zo snel mogelijk contact met je op.</p>
                <BaseButton variant="secondary" className="mt-6" onClick={() => setSubmitted(false)}>
                  Nog een bericht sturen
                </BaseButton>
              </AlertBanner>
            ) : (
              <form noValidate className="space-y-5" onSubmit={onSubmit}>
                <input type="text" autoComplete="off" tabIndex={-1} aria-hidden="true" className="sr-only" {...register('honeypot')} />

                <BaseFormField id="naam" label="Naam" error={errors.naam?.message} required>
                  <input id="naam" type="text" autoComplete="name" className={inputClass(!!errors.naam)} {...register('naam')} />
                </BaseFormField>

                <BaseFormField id="email" label="E-mailadres" error={errors.email?.message} required>
                  <input id="email" type="email" autoComplete="email" className={inputClass(!!errors.email)} {...register('email')} />
                </BaseFormField>

                <BaseFormField id="telefoon" label="Telefoonnummer" optional>
                  <input id="telefoon" type="tel" autoComplete="tel" className={inputClass(false)} {...register('telefoon')} />
                </BaseFormField>

                <BaseFormField id="bericht" label="Bericht" error={errors.bericht?.message} required>
                  <textarea id="bericht" rows={5} className={`${inputClass(!!errors.bericht)} resize-none`} {...register('bericht')} />
                </BaseFormField>

                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-0.5 rounded border-gray-300 dark:border-white/20 text-primary-500 focus:ring-primary-500" {...register('privacy')} />
                    <span className="text-sm text-muted">
                      Ik ga akkoord met de <Link to={ROUTES.privacy} className="text-primary-500 hover:underline">privacyverklaring</Link>.
                      <span className="text-red-500" aria-hidden="true"> *</span>
                    </span>
                  </label>
                  {errors.privacy && <p role="alert" className="text-sm text-red-500 mt-1">{errors.privacy.message}</p>}
                </div>

                <BaseButton type="submit" disabled={isSubmitting} className="w-full justify-center">
                  {isSubmitting ? 'Versturen…' : 'Verstuur bericht →'}
                </BaseButton>
              </form>
            )}
          </div>
        </SidebarLayout>
      </AppSection>

      <CtaBlock heading="Steun SWG Nederland" />
    </>
  )
}
