import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes'
import { useSiteOptions } from '@/shared/hooks/useSiteOptions'
import { IconFacebook } from './IconFacebook'
import { IconInstagram } from './IconInstagram'

const logoUrl = `${import.meta.env.BASE_URL}logo-w.png`
const year = new Date().getFullYear()

export function TheFooter() {
  const { data: opts } = useSiteOptions()
  const nav = opts?.nav_labels
  const footer = opts?.footer_labels
  const org = opts?.organization_name ?? 'Stichting Wintersport Gehandicapten Nederland'

  return (
    <footer role="contentinfo" className="bg-dark pt-12 pb-6 text-white">
      <div className="container mx-auto grid gap-10 px-4 md:grid-cols-3">

        {/* Column 1: Logo + description + social */}
        <div className="flex flex-col gap-5">
          <Link to={ROUTES.home} aria-label={`${opts?.site_name ?? 'SWG Nederland'} — home`}>
            <img src={logoUrl} alt={opts?.site_name ?? 'SWG Nederland'} className="h-10 w-auto" />
          </Link>
          <p className="text-sm leading-relaxed text-white/60">
            {opts?.footer_description ?? 'Stichting Wintersport Gehandicapten Nederland maakt skiën mogelijk voor mensen met een beperking.'}
          </p>
          <div className="flex gap-3">
            {opts?.facebook_url && (
              <a
                href={opts.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${opts.site_name ?? 'SWG Nederland'} op Facebook`}
                className="text-white/60 transition-colors hover:text-white"
              >
                <IconFacebook className="h-6 w-6" />
              </a>
            )}
            {opts?.instagram_url && (
              <a
                href={opts.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${opts?.site_name ?? 'SWG Nederland'} op Instagram`}
                className="text-white/60 transition-colors hover:text-white"
              >
                <IconInstagram className="h-6 w-6" />
              </a>
            )}
          </div>
        </div>

        {/* Column 2: Navigation */}
        <nav aria-label="Footer navigation">
          <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-white/70">
            <li><Link to={ROUTES.home} className="transition-colors hover:text-white">{nav?.home ?? 'Home'}</Link></li>
            <li><Link to={ROUTES.trips} className="transition-colors hover:text-white">{nav?.trips ?? 'Reizen'}</Link></li>
            <li><Link to={ROUTES.news} className="transition-colors hover:text-white">{nav?.news ?? 'Nieuws'}</Link></li>
            <li><Link to={ROUTES.about} className="transition-colors hover:text-white">{nav?.about ?? 'Over ons'}</Link></li>
            <li><Link to={ROUTES.faq} className="transition-colors hover:text-white">{nav?.faq ?? 'FAQ'}</Link></li>
            <li><Link to={ROUTES.contact} className="transition-colors hover:text-white">{nav?.contact ?? 'Contact'}</Link></li>
            <li><Link to={ROUTES.support} className="transition-colors hover:text-white">{nav?.support ?? 'Steunen'}</Link></li>
            <li><Link to={ROUTES.board} className="transition-colors hover:text-white">{nav?.board ?? 'Bestuur'}</Link></li>
            <li><Link to={ROUTES.privacy} className="transition-colors hover:text-white">{nav?.privacy ?? 'Privacy'}</Link></li>
            <li><Link to={ROUTES.cookies} className="transition-colors hover:text-white">{nav?.cookies ?? 'Cookies'}</Link></li>
            <li><Link to={ROUTES.terms} className="transition-colors hover:text-white">{nav?.terms ?? 'Voorwaarden'}</Link></li>
          </ul>
        </nav>

        {/* Column 3: Organisation details */}
        <address className="flex flex-col gap-1.5 text-sm text-white/60 not-italic">
          <strong className="font-semibold text-white">{org}</strong>
          {opts?.kvk_number && <span>KvK: {opts.kvk_number}</span>}
          {opts?.iban_number && <span>IBAN: {opts.iban_number}</span>}
          {opts?.bic_code && <span>BIC: {opts.bic_code}</span>}
          {opts?.postal_address && <span className="mt-2 leading-snug">{opts.postal_address}</span>}
          {opts?.contact_email && (
            <a href={`mailto:${opts.contact_email}`} className="transition-colors hover:text-white">
              {opts.contact_email}
            </a>
          )}
        </address>
      </div>

      {/* Copyright bar */}
      <div className="container mx-auto mt-10 flex flex-col items-center justify-between gap-2 border-t border-white/10 px-4 pt-4 text-xs text-white/40 sm:flex-row">
        <span>© {year} {opts?.site_name ?? 'SWG Nederland'} — {org}</span>
        <div className="flex gap-4">
          <Link to={ROUTES.privacy} className="transition-colors hover:text-white/70">{footer?.privacy ?? 'Privacybeleid'}</Link>
          <Link to={ROUTES.cookies} className="transition-colors hover:text-white/70">{footer?.cookies ?? 'Cookiebeleid'}</Link>
          <Link to={ROUTES.terms} className="transition-colors hover:text-white/70">{footer?.terms ?? 'Voorwaarden'}</Link>
        </div>
      </div>
    </footer>
  )
}
