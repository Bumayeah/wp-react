import { useState, useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { ROUTES } from '@/routes'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { agendaService } from '@/features/agenda/agenda.service'
import { getAvailabilityStatus } from '@/features/agenda/agenda.schema'
import { userService } from '@/features/user/user.service'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { BaseSkeleton } from '@/shared/components/ui/BaseSkeleton'
import { ErrorState } from '@/shared/components/ui/ErrorState'
import { BaseButton } from '@/shared/components/ui/BaseButton'

const schema = z.object({
  naam: z.string().min(2, 'Vul je naam in'),
  email: z.string().email('Vul een geldig e-mailadres in'),
  telefoon: z.string().min(6, 'Vul je telefoonnummer in'),
  aard_beperking: z.string().min(2, 'Vul de aard van je beperking in'),
  begeleider: z.enum(['ja', 'nee'], { error: 'Kies een optie' }),
  dieetwensen: z.string().optional(),
  noodcontact_naam: z.string().min(2, 'Vul naam noodcontact in'),
  noodcontact_telefoon: z.string().min(6, 'Vul telefoonnummer noodcontact in'),
  privacy: z.literal(true, { error: 'Je moet akkoord gaan met de privacyverklaring' }),
  honeypot: z.string().max(0).optional(),
})

type FormValues = z.infer<typeof schema>

export function TripRegisterPage() {
  const { slug } = useParams<{ slug: string }>()
  const auth = useAuthStore()
  const ui = useUiStore()
  const queryClient = useQueryClient()
  const [submitted, setSubmitted] = useState(false)

  const { data: trip, isPending, isError, refetch: refetchTrip } = useQuery({
    queryKey: queryKeys.trip(slug ?? ''),
    queryFn: () => agendaService.getBySlug(slug!),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  })

  const status = trip ? getAvailabilityStatus(trip) : ('full' as const)
  const isWaitlist = status === 'waitlist'
  const isFull = status === 'full'

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  // Prefill from auth user
  useEffect(() => {
    if (auth.user) {
      setValue('naam', auth.user.name)
      setValue('email', auth.user.email)
      setValue('telefoon', auth.user.phone)
    }
  }, [auth.user, setValue])

  const inputClass = (hasError: boolean) =>
    `w-full px-3 py-2 border rounded-lg bg-white dark:bg-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
      hasError ? 'border-red-500' : 'border-gray-300 dark:border-white/20'
    }`

  const onSubmit = handleSubmit(async () => {
    if (!auth.user || !trip) return
    await userService.createRegistration({
      user_id: auth.user.id,
      trip_id: trip.id,
      trip_title: trip.title,
      date_from: trip.date_from,
      date_to: trip.date_to,
      location: trip.location,
      status: isWaitlist ? 'waitlist' : 'confirmed',
    })
    if (!isWaitlist && trip.spots_available > 0) {
      await agendaService.patchSpots(trip.id, trip.spots_available - 1)
      await refetchTrip()
    }
    await queryClient.invalidateQueries({ queryKey: queryKeys.myRegistrations() })
    reset()
    setSubmitted(true)
  })

  if (isPending) {
    return (
      <div className="space-y-4 p-8">
        <BaseSkeleton className="h-8 w-2/3" />
        <BaseSkeleton className="h-5 w-1/3" />
        <BaseSkeleton className="h-48 w-full" />
      </div>
    )
  }

  if (isError || !trip) {
    return (
      <div className="p-8">
        <ErrorState title="Reis niet gevonden" description="Deze reis bestaat niet of is niet meer beschikbaar." />
      </div>
    )
  }

  if (isFull) {
    return (
      <div className="p-8 text-center">
        <p className="mb-2 text-lg font-semibold">Aanmelding gesloten</p>
        <p className="text-muted mb-4 text-sm">Er zijn geen plekken meer beschikbaar en de wachtlijst is gesloten.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Login banner */}
      {!auth.isLoggedIn && !submitted && (
        <div className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4">
          <div>
            <p className="text-sm font-medium">Heb je al een account?</p>
            <p className="text-muted text-xs">Log in om je gegevens automatisch in te vullen.</p>
          </div>
          <BaseButton
            variant="secondary"
            size="sm"
            onClick={() => ui.openAuthModal({ view: 'login', redirectTo: ROUTES.tripRegister(slug!) })}
          >
            Inloggen →
          </BaseButton>
        </div>
      )}

      {/* Logged in indicator */}
      {auth.isLoggedIn && !submitted && (
        <div className="bg-success/10 border-success/20 text-success flex items-center gap-2 rounded-xl border p-3 text-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          Ingelogd als <strong>{auth.user?.name}</strong> — gegevens zijn vooringevuld.
        </div>
      )}

      {/* Waitlist notice */}
      {isWaitlist && (
        <div className="bg-accent-500/10 border-accent-500/20 text-accent-500 rounded-xl border p-4 text-sm font-medium">
          Deze reis is vol. Je aanmelding gaat op de wachtlijst — we nemen contact op als er een plek vrijkomt.
        </div>
      )}

      {/* Success */}
      {submitted ? (
        <div role="status" aria-live="polite" className="bg-success/10 border-success/20 rounded-2xl border p-8 text-center">
          <CheckCircle2 className="text-success mx-auto mb-4 h-12 w-12" aria-hidden="true" />
          <h2 className="mb-2 text-xl font-semibold">
            {isWaitlist ? 'Op de wachtlijst gezet!' : 'Aanmelding ontvangen!'}
          </h2>
          <p className="text-muted">We nemen zo snel mogelijk contact met je op ter bevestiging.</p>
        </div>
      ) : (
        /* Form */
        <form noValidate className="space-y-6" onSubmit={onSubmit}>
          <input type="text" autoComplete="off" tabIndex={-1} aria-hidden="true" className="sr-only" {...register('honeypot')} />

          {/* Personal details */}
          <fieldset className="space-y-4">
            <legend className="mb-3 text-base font-semibold dark:text-white">Persoonlijke gegevens</legend>

            <div>
              <label htmlFor="naam" className="mb-1 block text-sm font-medium dark:text-white">
                Naam <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input id="naam" type="text" autoComplete="name" className={inputClass(!!errors.naam)} {...register('naam')} />
              {errors.naam && <p role="alert" className="mt-1 text-sm text-red-500">{errors.naam.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium dark:text-white">
                E-mailadres <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input id="email" type="email" autoComplete="email" className={inputClass(!!errors.email)} {...register('email')} />
              {errors.email && <p role="alert" className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="telefoon" className="mb-1 block text-sm font-medium dark:text-white">
                Telefoonnummer <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input id="telefoon" type="tel" autoComplete="tel" className={inputClass(!!errors.telefoon)} {...register('telefoon')} />
              {errors.telefoon && <p role="alert" className="mt-1 text-sm text-red-500">{errors.telefoon.message}</p>}
            </div>
          </fieldset>

          {/* Medical info */}
          <fieldset className="space-y-4">
            <legend className="mb-3 text-base font-semibold dark:text-white">Medische informatie</legend>

            <div>
              <label htmlFor="aard_beperking" className="mb-1 block text-sm font-medium dark:text-white">
                Aard van de beperking <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <textarea id="aard_beperking" rows={3} className={`${inputClass(!!errors.aard_beperking)} resize-none`} {...register('aard_beperking')} />
              {errors.aard_beperking && <p role="alert" className="mt-1 text-sm text-red-500">{errors.aard_beperking.message}</p>}
            </div>

            <div>
              <label htmlFor="dieetwensen" className="mb-1 block text-sm font-medium dark:text-white">
                Dieetwensen <span className="text-muted text-xs">(optioneel)</span>
              </label>
              <input id="dieetwensen" type="text" className="dark:bg-dark focus:ring-primary-500 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none dark:border-white/20" {...register('dieetwensen')} />
            </div>

            <div>
              <p className="mb-2 block text-sm font-medium dark:text-white">
                Kom je met een persoonlijk begeleider? <span className="text-red-500" aria-hidden="true">*</span>
              </p>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="radio" value="ja" className="text-primary-500 focus:ring-primary-500" {...register('begeleider')} />
                  Ja
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="radio" value="nee" className="text-primary-500 focus:ring-primary-500" {...register('begeleider')} />
                  Nee
                </label>
              </div>
              {errors.begeleider && <p role="alert" className="mt-1 text-sm text-red-500">{errors.begeleider.message}</p>}
            </div>
          </fieldset>

          {/* Emergency contact */}
          <fieldset className="space-y-4">
            <legend className="mb-3 text-base font-semibold dark:text-white">Noodcontact</legend>

            <div>
              <label htmlFor="noodcontact_naam" className="mb-1 block text-sm font-medium dark:text-white">
                Naam noodcontact <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input id="noodcontact_naam" type="text" className={inputClass(!!errors.noodcontact_naam)} {...register('noodcontact_naam')} />
              {errors.noodcontact_naam && <p role="alert" className="mt-1 text-sm text-red-500">{errors.noodcontact_naam.message}</p>}
            </div>

            <div>
              <label htmlFor="noodcontact_telefoon" className="mb-1 block text-sm font-medium dark:text-white">
                Telefoonnummer noodcontact <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input id="noodcontact_telefoon" type="tel" className={inputClass(!!errors.noodcontact_telefoon)} {...register('noodcontact_telefoon')} />
              {errors.noodcontact_telefoon && <p role="alert" className="mt-1 text-sm text-red-500">{errors.noodcontact_telefoon.message}</p>}
            </div>
          </fieldset>

          {/* Privacy */}
          <div>
            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" className="text-primary-500 focus:ring-primary-500 mt-0.5 rounded border-gray-300 dark:border-white/20" {...register('privacy')} />
              <span className="text-muted text-sm">
                Ik ga akkoord met de <Link to={ROUTES.privacy} className="text-primary-500 hover:underline">privacyverklaring</Link>.
                <span className="text-red-500" aria-hidden="true"> *</span>
              </span>
            </label>
            {errors.privacy && <p role="alert" className="mt-1 text-sm text-red-500">{errors.privacy.message}</p>}
          </div>

          <BaseButton type="submit" disabled={isSubmitting} className="w-full justify-center">
            {isSubmitting ? 'Versturen…' : isWaitlist ? 'Op wachtlijst zetten →' : 'Aanmelding versturen →'}
          </BaseButton>
        </form>
      )}
    </div>
  )
}
