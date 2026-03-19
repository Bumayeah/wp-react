import { Link } from 'react-router-dom'
import { PageSeo } from '@/shared/components/seo/PageSeo'

export function NotFoundPage() {
  return (
    <main className="container mx-auto px-4 py-32 text-center">
      <PageSeo title="Pagina niet gevonden" noindex />
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-muted mb-8">Deze pagina bestaat niet.</p>
      <Link to="/" className="text-primary-500 underline">Terug naar home</Link>
    </main>
  )
}
