import type { ReactNode } from 'react'

interface SidebarLayoutProps {
  reverse?: boolean
  children: ReactNode
  sidebar: ReactNode
}

export function SidebarLayout({ reverse, children, sidebar }: SidebarLayoutProps) {
  return (
    <div className={`grid gap-12 lg:items-start ${reverse ? 'lg:grid-cols-[1fr_3fr]' : 'lg:grid-cols-[2fr_1fr]'}`}>
      {children}
      <aside className={`lg:sticky lg:top-28 ${reverse ? 'lg:order-first' : ''}`}>
        {sidebar}
      </aside>
    </div>
  )
}
