import { useSearchParams } from 'react-router-dom'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { ROUTES } from '@/routes'
import { usePage } from '@/shared/hooks/usePage'
import { useFormatting } from '@/shared/hooks/useFormatting'
import { BaseButton } from '@/shared/components/ui/BaseButton'

export function SupportThankYouPage() {
  const [searchParams] = useSearchParams()
  const { formatCurrency } = useFormatting()
  const { data: page } = usePage('steunen-bedankt', 60 * 60 * 1000)
  const acf = page?.acf as Record<string, string> | undefined

  const status = searchParams.get('status')
  const naam = searchParams.get('naam') ? decodeURIComponent(searchParams.get('naam')!) : null
  const amount = searchParams.get('amount') ? Number(searchParams.get('amount')) : null
  const isMock = searchParams.get('mock') === 'true'

  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
      {status === 'paid' ? (
        <>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-8">
            <CheckCircle2 className="w-10 h-10 text-success" aria-hidden="true" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {acf?.thank_you_heading ?? 'Hartelijk bedankt'}{naam ? `, ${naam}` : ''}!
          </h1>
          <p className="text-muted text-lg mb-4">
            {amount ? (
              <>Je donatie van <strong>{formatCurrency(amount)}</strong> is ontvangen. </>
            ) : (
              'Je donatie is ontvangen. '
            )}
            {acf?.confirmation_note ?? 'Je ontvangt een bevestiging per e-mail.'}
          </p>
          <p className="text-muted mb-8">
            {acf?.thank_you_body ?? 'Met jouw steun maken wij het mogelijk dat mensen met een beperking kunnen genieten van de wintersport. Dank je wel!'}
          </p>
          {isMock && (
            <p className="text-xs text-muted mb-6 bg-gray-100 dark:bg-white/5 rounded-lg px-4 py-2">
              {acf?.mock_notice ?? 'Dit is een simulatie — er is geen echte betaling verwerkt.'}
            </p>
          )}
          <div className="flex flex-wrap gap-3 justify-center">
            <BaseButton to={ROUTES.home}>{acf?.btn_home ?? 'Terug naar home'}</BaseButton>
            <BaseButton to={ROUTES.trips} variant="secondary">{acf?.btn_trips ?? 'Bekijk reizen'}</BaseButton>
          </div>
        </>
      ) : (
        <>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 mb-8">
            <AlertTriangle className="w-10 h-10 text-red-500" aria-hidden="true" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {status === 'cancelled'
              ? (acf?.cancelled_heading ?? 'Betaling geannuleerd')
              : (acf?.failed_heading ?? 'Betaling mislukt')}
          </h1>
          <p className="text-muted text-lg mb-8">
            {status === 'cancelled'
              ? (acf?.cancelled_body ?? 'Je hebt de betaling geannuleerd. Je kunt het opnieuw proberen.')
              : (acf?.failed_body ?? 'Er is iets misgegaan bij de betaling. Probeer het opnieuw of neem contact met ons op.')}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <BaseButton to={`${ROUTES.support}#donatie`}>{acf?.btn_retry ?? 'Opnieuw proberen'}</BaseButton>
            <BaseButton to={ROUTES.contact} variant="secondary">{acf?.btn_contact ?? 'Contact opnemen'}</BaseButton>
          </div>
        </>
      )}
    </div>
  )
}
