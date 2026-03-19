import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useUiStore } from '@/stores/ui'
import { ROUTES } from '@/routes'
import { useSiteOptions } from '@/shared/hooks/useSiteOptions'
import { TheTopBar } from './TheTopBar'
import { ThemeToggle } from './ThemeToggle'

const logoUrl = `${import.meta.env.BASE_URL}logo-w.png`

export function TheHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const ui = useUiStore()
  const { data: opts } = useSiteOptions()
  const nav = opts?.nav_labels
  const hdr = opts?.header_labels
  const siteName = opts?.site_name ?? 'SWG Nederland'

  const navLinks = useMemo(() => [
    { to: ROUTES.home, label: nav?.home ?? 'Home' },
    { to: ROUTES.trips, label: nav?.trips ?? 'Reizen' },
    { to: ROUTES.news, label: nav?.news ?? 'Nieuws' },
    { to: ROUTES.about, label: nav?.about ?? 'Over ons' },
    { to: ROUTES.faq, label: nav?.faq ?? 'FAQ' },
    { to: ROUTES.contact, label: nav?.contact ?? 'Contact' },
  ], [nav])

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  // Scroll lock when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  // Track scroll for shadow
  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 20) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close on Escape
  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isMenuOpen) setIsMenuOpen(false)
    }
    window.addEventListener('keydown', onKeydown)
    return () => window.removeEventListener('keydown', onKeydown)
  }, [isMenuOpen])

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative py-1 hover:text-white transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary-500 after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100 ${
      isActive ? 'text-white after:scale-x-100' : ''
    }`

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors font-medium ${
      isActive ? 'text-white bg-white/10' : ''
    }`

  return (
    <>
      <header className={`sticky top-0 z-40 bg-dark transition-shadow duration-300 ${scrolled ? 'shadow-lg shadow-black/30' : ''}`}>
        <TheTopBar />

        {/* Divider */}
        <div className="border-b border-white/10" />

        {/* Navbar */}
        <div className="container mx-auto flex items-center justify-between px-4 h-16">

          {/* Logo */}
          <Link to="/" className="shrink-0">
            <img src={logoUrl} alt={`${siteName} — home`} className="h-9 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6 text-sm font-medium text-white/80">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={navLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop right: CTA + ThemeToggle */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link
              to={ROUTES.trips}
              className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors active:scale-97"
            >
              {hdr?.cta ?? 'Aanmelden →'}
            </Link>
          </div>

          {/* Mobile: ThemeToggle + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
              className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className={`block w-6 h-0.5 bg-current transition-transform duration-300 ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block w-6 h-0.5 bg-current transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-current transition-transform duration-300 ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          ref={menuRef}
          className={`md:hidden bg-dark-secondary border-t border-white/10 transition-all duration-300 ease-out ${
            isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none hidden'
          }`}
        >
          <nav aria-label="Mobile navigation" className="container mx-auto px-4 py-4">
            <ul role="list" className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={mobileNavLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
              <button
                type="button"
                className="block w-full text-center bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-colors"
                onClick={() => { setIsMenuOpen(false); ui.openAuthModal({ view: 'login' }) }}
              >
                {hdr?.login ?? 'Inloggen'}
              </button>
              <Link
                to={ROUTES.trips}
                className="block text-center bg-primary-500 hover:bg-primary-600 text-white px-4 py-2.5 rounded-full text-sm font-semibold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {hdr?.cta ?? 'Aanmelden →'}
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Backdrop overlay */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/50"
          aria-hidden="true"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  )
}
