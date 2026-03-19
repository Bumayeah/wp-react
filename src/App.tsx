import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Toaster } from 'sonner'
import { TheHeader } from '@/shared/components/layout/TheHeader'
import { TheFooter } from '@/shared/components/layout/TheFooter'
import { AuthModal } from '@/shared/components/ui/AuthModal'
import { SkipToMain } from '@/shared/components/layout/SkipToMain'

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollRestoration />
      <Toaster position="bottom-right" richColors closeButton />
      <SkipToMain />
      <TheHeader />
      <AuthModal />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <Outlet />
      </main>
      <TheFooter />
    </div>
  )
}
