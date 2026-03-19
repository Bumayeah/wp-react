import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/features/user/user.service'
import { queryKeys } from '@/shared/lib/queryKeys'
import { useAuthStore } from '@/stores/auth'
import { useInputClass } from '@/shared/hooks/useInputClass'
import { BaseSkeleton } from '@/shared/components/ui/BaseSkeleton'
import { BaseCard } from '@/shared/components/ui/BaseCard'
import { AlertBanner } from '@/shared/components/ui/AlertBanner'
import { BaseFormField } from '@/shared/components/ui/BaseFormField'
import { BaseButton } from '@/shared/components/ui/BaseButton'

const schema = z.object({
  name: z.string().min(2, 'Vul je naam in'),
  email: z.string().email('Vul een geldig e-mailadres in'),
  phone: z.string().min(6, 'Vul je telefoonnummer in'),
})

type FormValues = z.infer<typeof schema>

export function MyProfilePage() {
  const auth = useAuthStore()
  const queryClient = useQueryClient()
  const inputClass = useInputClass()
  const [saved, setSaved] = useState(false)

  const { data: profile, isPending } = useQuery({
    queryKey: queryKeys.myProfile(),
    queryFn: userService.getProfile,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (profile) {
      reset({ name: profile.name, email: profile.email, phone: profile.phone })
    }
  }, [profile, reset])

  const onSubmit = handleSubmit(async (values) => {
    if (!profile) return
    const updated = await userService.updateProfile(profile.id, {
      name: values.name,
      email: values.email,
      phone: values.phone,
    })
    if (auth.token && auth.user) {
      auth.setAuth(auth.token, { ...auth.user, name: updated.name, email: updated.email, phone: updated.phone })
    }
    queryClient.invalidateQueries({ queryKey: queryKeys.myProfile() })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  })

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 dark:text-white">Mijn profiel</h2>

      {isPending ? (
        <div className="space-y-4">
          <BaseSkeleton className="h-10 w-full rounded-lg" />
          <BaseSkeleton className="h-10 w-full rounded-lg" />
          <BaseSkeleton className="h-10 w-full rounded-lg" />
        </div>
      ) : (
        <BaseCard variant="elevated" padding="lg" className="max-w-lg">
          {saved && (
            <AlertBanner variant="success" size="sm" role="status" aria-live="polite" className="mb-6">
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              Profiel opgeslagen.
            </AlertBanner>
          )}

          <form noValidate className="space-y-5" onSubmit={onSubmit}>
            <BaseFormField id="name" label="Naam" error={errors.name?.message}>
              <input
                id="name"
                type="text"
                autoComplete="name"
                className={inputClass(!!errors.name)}
                {...register('name')}
              />
            </BaseFormField>

            <BaseFormField id="email" label="E-mailadres" error={errors.email?.message}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={inputClass(!!errors.email)}
                {...register('email')}
              />
            </BaseFormField>

            <BaseFormField id="phone" label="Telefoonnummer" error={errors.phone?.message}>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                className={inputClass(!!errors.phone)}
                {...register('phone')}
              />
            </BaseFormField>

            <BaseButton type="submit" disabled={isSubmitting} className="w-full justify-center">
              {isSubmitting ? 'Opslaan…' : 'Opslaan'}
            </BaseButton>
          </form>
        </BaseCard>
      )}
    </div>
  )
}
