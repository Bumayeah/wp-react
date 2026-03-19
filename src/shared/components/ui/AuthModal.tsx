import { useEffect, useRef, useState } from 'react'
import { X, CheckCircle2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import { accountService } from '@/features/account/account.service'
import { useInputClass } from '@/shared/hooks/useInputClass'
import { BaseButton } from './BaseButton'
import { BaseFormField } from './BaseFormField'
import { AlertBanner } from './AlertBanner'

const loginSchema = z.object({
  email: z.string().email('Vul een geldig e-mailadres in'),
  password: z.string().min(1, 'Vul je wachtwoord in'),
})

const registerSchema = z.object({
  naam: z.string().min(2, 'Vul je naam in'),
  email: z.string().email('Vul een geldig e-mailadres in'),
  telefoon: z.string().min(6, 'Vul je telefoonnummer in'),
  bericht: z.string().optional(),
  honeypot: z.string().max(0).optional(),
})

type LoginValues = z.infer<typeof loginSchema>
type RegisterValues = z.infer<typeof registerSchema>

export function AuthModal() {
  const ui = useUiStore()
  const auth = useAuthStore()
  const navigate = useNavigate()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputClass = useInputClass()

  const { open, view: storeView, redirectTo } = ui.authModal
  const [view, setView] = useState<'login' | 'register'>(storeView)
  const [registerSubmitted, setRegisterSubmitted] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  // Sync view from store when modal opens
  useEffect(() => {
    if (open) {
      setView(storeView)
      setRegisterSubmitted(false)
      setLoginError(null)
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [open, storeView])

  function close() {
    ui.closeAuthModal()
  }

  // Login form
  const {
    register: loginRegister,
    handleSubmit: handleLogin,
    formState: { errors: loginErrors, isSubmitting: loginSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  const onLogin = handleLogin(async (values) => {
    setLoginError(null)
    try {
      const { token, user } = await accountService.login(values.email, values.password)
      auth.setAuth(token, user)
      close()
      if (redirectTo?.startsWith('/')) navigate(redirectTo)
    } catch {
      setLoginError('E-mailadres of wachtwoord klopt niet. Probeer het opnieuw.')
    }
  })

  // Register form
  const {
    register: regRegister,
    handleSubmit: handleRegister,
    formState: { errors: regErrors, isSubmitting: regSubmitting },
    reset: resetRegForm,
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) })

  const onRegister = handleRegister(async (values) => {
    await accountService.register({
      name: values.naam,
      email: values.email,
      phone: values.telefoon,
      message: values.bericht,
    })
    resetRegForm()
    setRegisterSubmitted(true)
  })

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-0 h-full w-full max-w-none bg-transparent p-4 flex items-center justify-center backdrop:bg-black/60 [&:not([open])]:hidden"
      onCancel={(e) => { e.preventDefault(); close() }}
      onClick={(e) => { if (e.target === dialogRef.current) close() }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-dark shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-8">

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-accent-500 text-xs font-semibold tracking-widest uppercase mb-1">Mijn SWG</p>
              <h2 className="text-xl font-bold dark:text-white">
                {view === 'login' ? 'Inloggen' : 'Account aanvragen'}
              </h2>
            </div>
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors shrink-0"
              aria-label="Sluiten"
              onClick={close}
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Login form */}
          {view === 'login' ? (
            <form noValidate className="space-y-5" onSubmit={onLogin}>
              {loginError && (
                <AlertBanner role="alert" variant="error" className="mb-2">
                  {loginError}
                </AlertBanner>
              )}

              <BaseFormField id="modal-email" label="E-mailadres" error={loginErrors.email?.message}>
                <input
                  id="modal-email"
                  type="email"
                  autoComplete="email"
                  className={inputClass(!!loginErrors.email)}
                  {...loginRegister('email')}
                />
              </BaseFormField>

              <BaseFormField id="modal-password" label="Wachtwoord" error={loginErrors.password?.message}>
                <input
                  id="modal-password"
                  type="password"
                  autoComplete="current-password"
                  className={inputClass(!!loginErrors.password)}
                  {...loginRegister('password')}
                />
              </BaseFormField>

              <div className="text-sm">
                <Link to={ROUTES.forgotPassword} className="text-primary-500 hover:underline" onClick={close}>
                  Wachtwoord vergeten?
                </Link>
              </div>

              <BaseButton type="submit" disabled={loginSubmitting} className="w-full justify-center">
                {loginSubmitting ? 'Inloggen…' : 'Inloggen →'}
              </BaseButton>

              <p className="text-xs text-center text-muted/60">Demo: test@swg-nederland.nl / test1234</p>
            </form>
          ) : (
            <>
              {/* Register success */}
              {registerSubmitted ? (
                <div role="status" aria-live="polite" className="text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-success mx-auto" aria-hidden="true" />
                  <p className="text-base font-semibold dark:text-white">Aanvraag ontvangen!</p>
                  <p className="text-sm text-muted">We sturen je een e-mail zodra je account is aangemaakt. Dit duurt doorgaans 1–2 werkdagen.</p>
                  <BaseButton variant="secondary" className="w-full justify-center" onClick={close}>Sluiten</BaseButton>
                </div>
              ) : (
                /* Register form */
                <form noValidate className="space-y-4" onSubmit={onRegister}>
                  <input type="text" autoComplete="off" tabIndex={-1} aria-hidden="true" className="sr-only" {...regRegister('honeypot')} />

                  <BaseFormField id="modal-naam" label="Naam" error={regErrors.naam?.message} required>
                    <input
                      id="modal-naam"
                      type="text"
                      autoComplete="name"
                      className={inputClass(!!regErrors.naam)}
                      {...regRegister('naam')}
                    />
                  </BaseFormField>

                  <BaseFormField id="modal-reg-email" label="E-mailadres" error={regErrors.email?.message} required>
                    <input
                      id="modal-reg-email"
                      type="email"
                      autoComplete="email"
                      className={inputClass(!!regErrors.email)}
                      {...regRegister('email')}
                    />
                  </BaseFormField>

                  <BaseFormField id="modal-telefoon" label="Telefoonnummer" error={regErrors.telefoon?.message} required>
                    <input
                      id="modal-telefoon"
                      type="tel"
                      autoComplete="tel"
                      className={inputClass(!!regErrors.telefoon)}
                      {...regRegister('telefoon')}
                    />
                  </BaseFormField>

                  <BaseFormField id="modal-bericht" label="Toelichting" optional>
                    <textarea
                      id="modal-bericht"
                      rows={2}
                      placeholder="Bijv.: ik ben deelnemer en wil mijn aanmeldingen inzien."
                      className={`${inputClass(false)} resize-none`}
                      {...regRegister('bericht')}
                    />
                  </BaseFormField>

                  <BaseButton type="submit" disabled={regSubmitting} className="w-full justify-center">
                    {regSubmitting ? 'Versturen…' : 'Account aanvragen →'}
                  </BaseButton>
                </form>
              )}
            </>
          )}

          {/* Footer toggle */}
          {!registerSubmitted && (
            <p className="mt-5 text-center text-sm text-muted">
              {view === 'login' ? (
                <>
                  Nog geen account?{' '}
                  <button type="button" className="text-primary-500 hover:underline" onClick={() => setView('register')}>
                    Account aanvragen
                  </button>
                </>
              ) : (
                <>
                  Heb je al een account?{' '}
                  <button type="button" className="text-primary-500 hover:underline" onClick={() => setView('login')}>
                    Inloggen
                  </button>
                </>
              )}
            </p>
          )}

        </div>
      </div>
    </dialog>
  )
}
