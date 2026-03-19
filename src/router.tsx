import { createHashRouter, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { ROUTES } from './routes'

import App from './App'
import { HomePage } from '@/pages/HomePage'
import { TripsPage } from '@/pages/TripsPage'
import { TripDetailPage } from '@/pages/TripDetailPage'
import { TripRegisterPage } from '@/pages/TripRegisterPage'
import { NewsPage } from '@/pages/NewsPage'
import { NewsDetailPage } from '@/pages/NewsDetailPage'
import { AboutPage } from '@/pages/AboutPage'
import { BoardPage } from '@/pages/BoardPage'
import { FaqPage } from '@/pages/FaqPage'
import { ContactPage } from '@/pages/ContactPage'
import { SupportPage } from '@/pages/SupportPage'
import { SupportThankYouPage } from '@/pages/SupportThankYouPage'
import { PrivacyPage } from '@/pages/PrivacyPage'
import { CookiesPage } from '@/pages/CookiesPage'
import { TermsPage } from '@/pages/TermsPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { MyLayout } from '@/pages/my/MyLayout'
import { MyDashboardPage } from '@/pages/my/MyDashboardPage'
import { MyRegistrationsPage } from '@/pages/my/MyRegistrationsPage'
import { MyProfilePage } from '@/pages/my/MyProfilePage'
import { MyQuestionsPage } from '@/pages/my/MyQuestionsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = useAuthStore()
  const ui = useUiStore()

  useEffect(() => {
    if (!auth.isLoggedIn) {
      ui.openAuthModal({ view: 'login', redirectTo: window.location.hash.replace('#', '') || ROUTES.my })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!auth.isLoggedIn) {
    return <Navigate to={ROUTES.home} replace />
  }

  return <>{children}</>
}

export const router = createHashRouter([
  {
    path: ROUTES.home,
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'reizen', element: <TripsPage /> },
      {
        path: 'reizen/:slug',
        element: <TripDetailPage />,
        children: [
          { path: 'inschrijven', element: <TripRegisterPage /> },
        ],
      },
      { path: 'nieuws', element: <NewsPage /> },
      { path: 'nieuws/:slug', element: <NewsDetailPage /> },
      { path: 'over-ons', element: <AboutPage /> },
      { path: 'bestuur', element: <BoardPage /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'steunen', element: <SupportPage /> },
      { path: 'steunen/bedankt', element: <SupportThankYouPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'cookies', element: <CookiesPage /> },
      { path: 'voorwaarden', element: <TermsPage /> },
      { path: 'account/wachtwoord-vergeten', element: <ForgotPasswordPage /> },
      {
        path: 'mijn',
        element: (
          <RequireAuth>
            <MyLayout />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <MyDashboardPage /> },
          { path: 'inschrijvingen', element: <MyRegistrationsPage /> },
          { path: 'profiel', element: <MyProfilePage /> },
          { path: 'vragen', element: <MyQuestionsPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
