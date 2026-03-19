import { apiDelete, apiGet, apiPatch, apiPost } from '@/shared/services/api'

export interface Registration {
  id: number
  user_id: number
  trip_id: number
  trip_title: string
  date_from: string
  date_to: string
  location: string
  status: 'confirmed' | 'waitlist' | 'cancelled'
}

export interface UserQuestion {
  id: number
  user_id: number
  question: string
  status: 'pending' | 'answered'
  answer?: string
  created_at: string
}

export interface UserProfile {
  id: number
  user_id: number
  name: string
  email: string
  phone: string
}

export const userService = {
  getRegistrations: () => apiGet<Registration[]>('/swg/v1/mijn/inschrijvingen'),
  getQuestions: () => apiGet<UserQuestion[]>('/swg/v1/mijn/vragen'),
  getProfile: () => apiGet<UserProfile[]>('/swg/v1/mijn/profiel').then((items) => items[0]),
  updateProfile: (id: number, data: Partial<UserProfile>) =>
    apiPatch<UserProfile>(`/swg/v1/mijn/profiel/${id}`, data),
  deleteQuestion: (id: number) =>
    apiDelete(`/swg/v1/mijn/vragen/${id}`),
  cancelRegistration: (id: number) =>
    apiPatch<Registration>(`/swg/v1/mijn/inschrijvingen/${id}`, { status: 'cancelled' }),
  createRegistration: (data: Omit<Registration, 'id'>) =>
    apiPost<Registration>('/swg/v1/mijn/inschrijvingen', data),
}
