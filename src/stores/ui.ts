import { create } from 'zustand'

type Theme = 'system' | 'light' | 'dark'

interface CookieConsent {
  youtube: boolean
  analytics: boolean
}

interface AuthModalState {
  open: boolean
  view: 'login' | 'register'
  redirectTo: string | null
}

interface UiState {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  cookieConsent: CookieConsent
  authModal: AuthModalState
  setTheme: (t: Theme) => void
  setConsent: (consent: CookieConsent) => void
  openAuthModal: (opts?: { view?: 'login' | 'register'; redirectTo?: string }) => void
  closeAuthModal: () => void
}

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') return getSystemTheme()
  return theme
}

function applyTheme(resolved: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', resolved)
}

const savedTheme = (localStorage.getItem('swg-theme') as Theme) ?? 'system'
const initialResolved = resolveTheme(savedTheme)
applyTheme(initialResolved)

const savedConsent = localStorage.getItem('swg-consent')

export const useUiStore = create<UiState>((set) => ({
  theme: savedTheme,
  resolvedTheme: initialResolved,
  cookieConsent: savedConsent
    ? (JSON.parse(savedConsent) as CookieConsent)
    : { youtube: false, analytics: false },
  authModal: { open: false, view: 'login', redirectTo: null },

  setTheme: (t) => {
    const resolved = resolveTheme(t)
    applyTheme(resolved)
    localStorage.setItem('swg-theme', t)
    set({ theme: t, resolvedTheme: resolved })
  },

  setConsent: (consent) => {
    localStorage.setItem('swg-consent', JSON.stringify(consent))
    set({ cookieConsent: consent })
  },

  openAuthModal: (opts) =>
    set({
      authModal: {
        open: true,
        view: opts?.view ?? 'login',
        redirectTo: opts?.redirectTo ?? null,
      },
    }),

  closeAuthModal: () =>
    set((s) => ({ authModal: { ...s.authModal, open: false } })),
}))
