import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { apiGet } from '@/shared/services/api'
import { ROUTES } from '@/routes'
import { useSiteOptions } from '@/shared/hooks/useSiteOptions'

interface AgendaItem {
  id: number
  slug: string
  title: { rendered: string }
  acf: {
    destination: string
    date_from: string
    date_to: string
  }
}

const fmt = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
function formatDate(iso: string) {
  return fmt.format(new Date(iso))
}

export function TheTopBar() {
  const auth = useAuthStore()
  const ui = useUiStore()
  const { data: opts } = useSiteOptions()
  const tb = opts?.topbar_labels

  const { data: trips } = useQuery({
    queryKey: queryKeys.trips(),
    queryFn: () => apiGet<AgendaItem[]>('/swg/v1/agenda'),
    staleTime: 5 * 60 * 1000,
  })

  const nextTrip = [...(trips ?? [])]
    .filter((t) => new Date(t.acf.date_from) >= new Date())
    .sort((a, b) => new Date(a.acf.date_from).getTime() - new Date(b.acf.date_from).getTime())[0]

  return (
    <div className="bg-dark hidden py-1.5 text-sm text-white/70 md:block">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Next trip highlight */}
        {nextTrip ? (
          <Link to={ROUTES.trips} className="hover:text-accent-500 flex items-center gap-2 transition-colors">
            <span aria-hidden="true">🎿</span>
            <span>
              {tb?.next_trip_prefix ?? 'Volgende vakantie:'}{' '}
              <strong className="text-white">{nextTrip.title.rendered}</strong>
              {' '}— {formatDate(nextTrip.acf.date_from)}
            </span>
          </Link>
        ) : (
          <span />
        )}

        {/* Secondary nav + auth */}
        <nav aria-label="Secondary navigation" className="flex items-center gap-4">
          <Link to={ROUTES.about} className="transition-colors hover:text-white">{tb?.about ?? 'Over de stichting'}</Link>
          <Link to={ROUTES.support} className="transition-colors hover:text-white">{tb?.support ?? 'Steun ons'}</Link>
          <span aria-hidden="true" className="text-white/30">|</span>
          {!auth.isLoggedIn ? (
            <button
              className="transition-colors hover:text-white"
              onClick={() => ui.openAuthModal({ view: 'login' })}
            >
              {tb?.login ?? 'Inloggen'}
            </button>
          ) : (
            <Link to={ROUTES.my} className="transition-colors hover:text-white">{tb?.my_account ?? 'Mijn account'}</Link>
          )}
        </nav>
      </div>
    </div>
  )
}
