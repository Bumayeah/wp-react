import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ROUTES } from '@/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useInputClass } from '@/shared/hooks/useInputClass'
import { BaseButton } from '@/shared/components/ui/BaseButton'
import { BaseFormField } from '@/shared/components/ui/BaseFormField'

const PRESET_AMOUNTS = [5, 10, 25, 50]

const schema = z.object({
  bedrag_preset: z.number().optional(),
  bedrag_eigen: z.string().optional(),
  frequentie: z.enum(['eenmalig', 'jaarlijks']),
  naam: z.string().min(2, 'Vul je naam in'),
  email: z.string().email('Vul een geldig e-mailadres in'),
  honeypot: z.string().max(0).optional(),
}).refine(
  (d) => d.bedrag_preset || (d.bedrag_eigen && Number(d.bedrag_eigen) >= 1),
  { message: 'Kies een bedrag of vul een eigen bedrag in', path: ['bedrag_preset'] },
)

type FormValues = z.infer<typeof schema>

export function IDealFlow() {
  const navigate = useNavigate()
  const inputClass = useInputClass()
  const [isSimulating, setIsSimulating] = useState(false)
  const isDev = import.meta.env.DEV

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { frequentie: 'eenmalig' },
  })

  const bedragPreset = watch('bedrag_preset')
  const bedragEigen = watch('bedrag_eigen')
  const frequentie = watch('frequentie')

  const onSubmit = handleSubmit(async (values) => {
    const amount = values.bedrag_preset ?? Number(values.bedrag_eigen)

    if (import.meta.env.DEV || !import.meta.env.VITE_USE_IDEAL) {
      setIsSimulating(true)
      await new Promise((r) => setTimeout(r, 1800))
      setIsSimulating(false)
      navigate(`${ROUTES.supportThankYou}?status=paid&mock=true&amount=${amount}&naam=${encodeURIComponent(values.naam)}`)
      return
    }

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/gf/v2/forms/3/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input_1: amount,
        input_2: values.frequentie,
        input_3: values.naam,
        input_4: values.email,
      }),
    })

    if (!res.ok) throw new Error('Betaling mislukt')
    const data = await res.json()
    const url = new URL(data.checkout_url)
    if (url.protocol !== 'https:') throw new Error('Ongeldige betaallink')
    window.location.href = url.toString()
  })

  const btnCls = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
      active
        ? 'bg-primary-500 border-primary-500 text-white'
        : 'border-gray-300 dark:border-white/20 hover:border-primary-500 hover:text-primary-500'
    }`

  return (
    <form className="space-y-5" noValidate onSubmit={onSubmit}>
      {/* Honeypot */}
      <input type="text" autoComplete="off" tabIndex={-1} aria-hidden="true" className="sr-only" {...register('honeypot')} />

      {/* Amount presets */}
      <fieldset>
        <legend className="text-sm font-medium mb-2">Bedrag</legend>
        <div className="flex flex-wrap gap-2">
          {PRESET_AMOUNTS.map((amount) => (
            <button
              key={amount}
              type="button"
              className={btnCls(bedragPreset === amount)}
              onClick={() => { setValue('bedrag_preset', amount); setValue('bedrag_eigen', '') }}
            >
              € {amount}
            </button>
          ))}
          <button
            type="button"
            className={btnCls(bedragPreset === undefined && !!bedragEigen)}
            onClick={() => setValue('bedrag_preset', undefined)}
          >
            Eigen bedrag
          </button>
        </div>

        {/* Custom amount input */}
        {bedragPreset === undefined && (
          <div className="mt-2">
            <label htmlFor="bedrag-eigen" className="sr-only">Eigen bedrag in euro's</label>
            <div className="relative w-36">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">€</span>
              <input
                id="bedrag-eigen"
                type="number"
                min="1"
                placeholder="0"
                className="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                {...register('bedrag_eigen')}
              />
            </div>
          </div>
        )}
        {errors.bedrag_preset && (
          <p className="text-sm text-red-500 mt-1">{errors.bedrag_preset.message}</p>
        )}
      </fieldset>

      {/* Frequency */}
      <fieldset>
        <legend className="text-sm font-medium mb-2">Frequentie</legend>
        <div className="flex gap-2">
          {(['eenmalig', 'jaarlijks'] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              className={btnCls(frequentie === opt)}
              onClick={() => setValue('frequentie', opt)}
            >
              {opt === 'eenmalig' ? 'Eenmalig' : 'Jaarlijks'}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Name */}
      <BaseFormField id="naam" label="Naam" error={errors.naam?.message}>
        <input id="naam" type="text" autoComplete="name" className={inputClass(!!errors.naam)} {...register('naam')} />
      </BaseFormField>

      {/* Email */}
      <BaseFormField id="email" label="E-mailadres" error={errors.email?.message}>
        <input id="email" type="email" autoComplete="email" className={inputClass(!!errors.email)} {...register('email')} />
      </BaseFormField>

      {/* Submit */}
      <BaseButton type="submit" disabled={isSubmitting || isSimulating} className="w-full justify-center">
        {isSimulating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" aria-hidden="true" />
            Doorsturen naar bank…
          </>
        ) : (
          'Doneer via iDEAL →'
        )}
      </BaseButton>

      {isDev && <p className="text-xs text-muted text-center">Simulatiemodus — geen echte betaling</p>}
    </form>
  )
}
