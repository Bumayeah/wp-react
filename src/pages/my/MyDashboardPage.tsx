import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { ROUTES } from '@/routes'
import { userService } from '@/features/user/user.service'
import { useFormatting } from '@/shared/hooks/useFormatting'

const statusLabel: Record<string, string> = {
  confirmed: 'Bevestigd',
  waitlist: 'Wachtlijst',
  cancelled: 'Geannuleerd',
}

const statusClass: Record<string, string> = {
  confirmed: 'text-success bg-success/10',
  waitlist: 'text-accent-500 bg-accent-500/10',
  cancelled: 'text-muted bg-muted/10',
}

const quickLinks = [
  { to: ROUTES.myProfile, title: 'Mijn profiel', desc: 'Naam, e-mail en telefoonnummer aanpassen' },
  { to: ROUTES.myQuestions, title: 'Mijn vragen', desc: 'Vragen die je hebt gesteld aan SWG' },
]

export function MyDashboardPage() {
  const { formatDateRange } = useFormatting()

  const { data: registrations } = useQuery({
    queryKey: queryKeys.myRegistrations(),
    queryFn: userService.getRegistrations,
  })

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold mb-4">Komende reizen</h2>
        {!registrations?.length ? (
          <div className="text-sm text-muted bg-gray-50 dark:bg-white/5 rounded-xl p-6 text-center">
            Je hebt nog geen registrations.
            <Link to={ROUTES.trips} className="text-primary-500 hover:underline block mt-2">
              Bekijk beschikbare reizen →
            </Link>
          </div>
        ) : (
          <ul role="list" className="space-y-3">
            {registrations.map((item) => (
              <li
                key={item.id}
                className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-semibold text-sm dark:text-white">{item.trip_title}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {item.location} · {formatDateRange(item.date_from, item.date_to)}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${
                    statusClass[item.status] ?? 'text-muted bg-muted/10'
                  }`}
                >
                  {statusLabel[item.status] ?? item.status}
                </span>
              </li>
            ))}
          </ul>
        )}
        <Link
          to={ROUTES.myRegistrations}
          className="text-sm text-primary-500 hover:underline mt-3 inline-block"
        >
          Alle inschrijvingen bekijken →
        </Link>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {quickLinks.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow group"
          >
            <p className="font-semibold text-sm dark:text-white group-hover:text-primary-500 transition-colors">
              {card.title}
            </p>
            <p className="text-xs text-muted mt-1">{card.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}
