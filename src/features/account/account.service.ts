import { apiGet, apiPost } from '@/shared/services/api'
import type { AuthUser } from '@/stores/auth'

interface AuthTokenRecord {
  id: number
  email: string
  password: string
  token: string
  user: AuthUser
}

export const accountService = {
  login: async (email: string, password: string): Promise<{ token: string; user: AuthUser }> => {
    const records = await apiGet<AuthTokenRecord[]>('/jwt-auth/v1/token', { email })
    const match = records.find((r) => r.email === email && r.password === password)
    if (!match) throw new Error('Ongeldige inloggegevens')
    return { token: match.token, user: match.user }
  },

  register: (data: { name: string; email: string; phone: string; message?: string }) =>
    apiPost('/swg/v1/account/register', data),

  resetPassword: (email: string) =>
    apiPost('/swg/v1/account/reset-password', { email }),
}
