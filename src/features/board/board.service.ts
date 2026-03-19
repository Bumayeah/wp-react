import { apiGet } from '@/shared/services/api'
import type { BoardMember } from './board.schema'

export const boardService = {
  getAll: () => apiGet<BoardMember[]>('/swg/v1/bestuur'),
}
