import { Sun, Moon, Monitor } from 'lucide-react'
import { useUiStore } from '@/stores/ui'

const options = [
  { value: 'light' as const, label: 'Light mode', icon: Sun },
  { value: 'dark' as const, label: 'Dark mode', icon: Moon },
  { value: 'system' as const, label: 'System theme', icon: Monitor },
]

export function ThemeToggle() {
  const { theme, setTheme } = useUiStore()

  return (
    <div className="flex items-center gap-0.5 rounded-full bg-white/10 p-0.5" role="group" aria-label="Theme">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          aria-label={opt.label}
          aria-pressed={theme === opt.value}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
            theme === opt.value ? 'bg-primary-500 text-white' : 'text-white/60 hover:text-white'
          }`}
          onClick={() => setTheme(opt.value)}
        >
          <opt.icon className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}
