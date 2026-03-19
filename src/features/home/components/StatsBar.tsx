import { AppSection } from '@/shared/components/layout/AppSection'

interface StatsBarProps {
  stats: Array<{ value: string; label: string }>
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <AppSection bg="dark-secondary" aria-label="SWG in cijfers">
      <dl className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center text-center py-4 px-6">
            <dt className="text-4xl font-bold text-white tracking-tight">{stat.value}</dt>
            <dd className="text-sm text-white/50 mt-2 leading-snug">{stat.label}</dd>
          </div>
        ))}
      </dl>
    </AppSection>
  )
}
