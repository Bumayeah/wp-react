import { z } from 'zod'

export const BOARD_ROLE_ORDER = [
  'Voorzitter',
  'Secretariaat',
  'Penningmeester',
  'Materiaal',
  'Algemeen bestuurslid',
] as const

export const BoardMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  photo: z.string(),
  sort_order: z.number(),
})

export type BoardMember = z.infer<typeof BoardMemberSchema>

export function sortBoardMembers(members: BoardMember[]): BoardMember[] {
  return [...members].sort((a, b) => {
    const ai = BOARD_ROLE_ORDER.indexOf(a.role as typeof BOARD_ROLE_ORDER[number])
    const bi = BOARD_ROLE_ORDER.indexOf(b.role as typeof BOARD_ROLE_ORDER[number])
    const roleSort = (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
    return roleSort !== 0 ? roleSort : a.sort_order - b.sort_order
  })
}
