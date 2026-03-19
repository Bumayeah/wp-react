import type { BoardMember } from '../board.schema'

interface BoardCardProps {
  member: BoardMember
}

export function BoardCard({ member }: BoardCardProps) {
  const photoUrl = member.photo || null

  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="h-full flex gap-5 bg-white dark:bg-dark-secondary rounded-2xl shadow-sm p-5">
      {/* Photo + name + role */}
      <div className="basis-1/3 shrink-0 flex flex-col gap-3">
        <div className="w-full h-56 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={member.name}
              className="w-full h-full object-cover object-top"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-primary-500 font-bold text-3xl bg-primary-50 dark:bg-primary-900/20"
              aria-hidden="true"
            >
              {initials}
            </div>
          )}
        </div>
        <div>
          <p className="font-bold text-xl leading-snug">{member.name}</p>
          <p className="text-xs font-semibold text-primary-500 uppercase tracking-wide mt-1">{member.role}</p>
        </div>
      </div>

      {/* Bio */}
      {member.bio && (
        <p className="text-sm text-muted leading-relaxed whitespace-pre-line min-w-0">{member.bio}</p>
      )}
    </div>
  )
}
