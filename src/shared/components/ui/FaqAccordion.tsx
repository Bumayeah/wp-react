import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FaqAccordionProps {
  items: { question: string; answer: string }[]
  multiple?: boolean
}

export function FaqAccordion({ items, multiple }: FaqAccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set())

  function toggle(i: number) {
    setOpenIndexes((prev) => {
      const next = new Set(prev)
      if (next.has(i)) {
        next.delete(i)
      } else {
        if (!multiple) next.clear()
        next.add(i)
      }
      return next
    })
  }

  return (
    <dl className="divide-y divide-gray-200 dark:divide-white/10">
      {items.map((item, i) => (
        <div key={i}>
          <dt>
            <button
              type="button"
              aria-expanded={openIndexes.has(i)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              onClick={() => toggle(i)}
            >
              <span>{item.question}</span>
              <ChevronDown
                className={`w-5 h-5 shrink-0 transition-transform duration-300 ${openIndexes.has(i) ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
          </dt>
          <dd
            style={{
              display: 'grid',
              gridTemplateRows: openIndexes.has(i) ? '1fr' : '0fr',
              transition: 'grid-template-rows 0.3s ease',
            }}
          >
            <div className="overflow-hidden">
              <p className="pb-5 text-muted leading-relaxed">{item.answer}</p>
            </div>
          </dd>
        </div>
      ))}
    </dl>
  )
}
