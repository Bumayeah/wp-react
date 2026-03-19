import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Mail } from 'lucide-react'
import { PageSeo } from '@/shared/components/seo/PageSeo'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { usePage } from '@/shared/hooks/usePage'
import { accountService } from '@/features/account/account.service'
import { useUiStore } from '@/stores/ui'
import { PageHero } from '@/shared/components/layout/PageHero'
import { BaseButton } from '@/shared/components/ui/BaseButton'

const schema = z.object({
  email: z.string().email('Vul een geldig e-mailadres in'),
})

type FormValues = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const ui = useUiStore()
  const [submitted, setSubmitted] = useState(false)

  const { data: page } = usePage('wachtwoord-vergeten', 30 * 60 * 1000)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit(async (values) => {
    await accountService.resetPassword(values.email)
    reset()
    setSubmitted(true)
  })

  const inputClass = (hasError: boolean) =>
    `w-full px-3 py-2 border rounded-lg bg-white dark:bg-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
      hasError ? 'border-red-500' : 'border-gray-300 dark:border-white/20'
    }`

  return (
    <>
      <PageSeo title={page?.title?.rendered ?? 'Wachtwoord vergeten'} noindex />
      <PageHero
        eyebrow={(page?.acf as any)?.hero_eyebrow ?? 'Mijn SWG'}
        title={page?.title?.rendered ?? 'Wachtwoord vergeten'}
        description={(page?.acf as any)?.hero_description}
      />

      <div className="container mx-auto px-4 py-12 max-w-md">
        {submitted ? (
          <div role="status" aria-live="polite" className="rounded-2xl bg-success/10 border border-success/20 p-8 text-center">
            <Mail className="w-12 h-12 text-success mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-xl font-semibold mb-2">E-mail verstuurd!</h2>
            <p className="text-muted">Als je e-mailadres bij ons bekend is, ontvang je een link om je wachtwoord opnieuw in te stellen.</p>
            <BaseButton variant="secondary" className="mt-6" onClick={() => ui.openAuthModal({ view: 'login' })}>
              Terug naar inloggen
            </BaseButton>
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-secondary rounded-2xl shadow-sm p-8">
            <form noValidate className="space-y-5" onSubmit={onSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">E-mailadres</label>
                <input id="email" type="email" autoComplete="email" className={inputClass(!!errors.email)} {...register('email')} />
                {errors.email && <p role="alert" className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
              </div>
              <BaseButton type="submit" disabled={isSubmitting} className="w-full justify-center">
                {isSubmitting ? 'Versturen…' : 'Reset-link versturen →'}
              </BaseButton>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              <button className="text-primary-500 hover:underline" onClick={() => ui.openAuthModal({ view: 'login' })}>
                ← Terug naar inloggen
              </button>
            </p>
          </div>
        )}
      </div>
    </>
  )
}
