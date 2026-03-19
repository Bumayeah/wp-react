import { create } from 'zustand'

export interface AuthUser {
  id: number
  name: string
  email: string
  phone: string
}

function isTokenExpired(jwt: string): boolean {
  try {
    const payload = JSON.parse(atob(jwt.split('.')[1] ?? ''))
    if (typeof payload.exp !== 'number') return false
    return payload.exp * 1000 < Date.now()
  } catch {
    return true // treat malformed tokens as expired
  }
}

//TODO: Refactor this when going from test to real production localStorage should be httpOnly cookie
function loadStoredAuth(): { token: string | null; user: AuthUser | null } {
  const storedToken = localStorage.getItem('swg-token')
  const storedUser = localStorage.getItem('swg-user')
  if (!storedToken || isTokenExpired(storedToken)) {
    localStorage.removeItem('swg-token')
    localStorage.removeItem('swg-user')
    return { token: null, user: null }
  }
  const user = storedUser ? (JSON.parse(storedUser) as AuthUser) : null
  return { token: storedToken, user }
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  isLoggedIn: boolean
  setAuth: (token: string, user: AuthUser) => void
  logout: () => void
}

const stored = loadStoredAuth()

export const useAuthStore = create<AuthState>((set) => ({
  token: stored.token,
  user: stored.user,
  isLoggedIn: !!stored.token && !isTokenExpired(stored.token ?? ''),

  setAuth: (token, user) => {
    localStorage.setItem('swg-token', token)
    localStorage.setItem('swg-user', JSON.stringify(user))
    set({ token, user, isLoggedIn: true })
  },

  logout: () => {
    localStorage.removeItem('swg-token')
    localStorage.removeItem('swg-user')
    set({ token: null, user: null, isLoggedIn: false })
  },
}))
