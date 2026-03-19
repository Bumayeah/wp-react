import { useNavigate, NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { ROUTES } from '@/routes'
import { usePage } from '@/shared/hooks/usePage'
import { PageHero } from '@/shared/components/layout/PageHero'
import { PageSeo } from '@/shared/components/seo/PageSeo'
import { AppSection } from '@/shared/components/layout/AppSection'
import { SidebarLayout } from '@/shared/components/layout/SidebarLayout'

export function MyLayout() {
  const auth = useAuthStore()
  const navigate = useNavigate()
  const { data: page } = usePage('mijn-account', 60 * 60 * 1000)
  const acf = page?.acf as Record<string, string> | undefined

  const navItems = [
    { to: ROUTES.my, label: acf?.nav_dashboard ?? 'Overzicht' },
    { to: ROUTES.myRegistrations, label: acf?.nav_registrations ?? 'Mijn inschrijvingen' },
    { to: ROUTES.myQuestions, label: acf?.nav_questions ?? 'Mijn vragen' },
    { to: ROUTES.myProfile, label: acf?.nav_profile ?? 'Mijn profiel' },
  ]

  function logout() {
    auth.logout()
    navigate(ROUTES.home)
  }

  const nav = (
    <nav aria-label="Mijn SWG navigatie" className="space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === ROUTES.my}
          className={({ isActive }) =>
            `flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary-500 text-white'
                : 'hover:bg-gray-100 dark:hover:bg-white/5 text-muted'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}

      <div className="pt-4 border-t border-gray-100 dark:border-white/10 mt-2">
        <button
          className="flex items-center px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 w-full text-left transition-colors"
          onClick={logout}
        >
          {acf?.nav_logout ?? 'Uitloggen'}
        </button>
      </div>
    </nav>
  )

  return (
    <>
      <PageSeo title="Mijn account" noindex />
      <PageHero eyebrow={acf?.hero_eyebrow ?? 'Mijn SWG'} title={auth.user?.name ?? page?.title?.rendered ?? 'Mijn account'} />

      <AppSection tag="div">
        <SidebarLayout reverse sidebar={nav}>
          <div className="min-w-0">
            <Outlet />
          </div>
        </SidebarLayout>
      </AppSection>
    </>
  )
}
