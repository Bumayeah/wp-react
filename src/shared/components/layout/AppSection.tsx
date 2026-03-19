import type { ElementType, ReactNode, HTMLAttributes } from 'react'

interface AppSectionProps extends HTMLAttributes<HTMLElement> {
  tag?: ElementType
  bg?: 'white' | 'gray' | 'dark' | 'dark-secondary'
  children: ReactNode
}

const bgClass: Record<string, string> = {
  white: 'bg-white dark:bg-dark',
  gray: 'bg-gray-50 dark:bg-dark-secondary',
  dark: 'bg-dark',
  'dark-secondary': 'bg-dark-secondary',
}

export function AppSection({ tag: Tag = 'section', bg, children, className, ...rest }: AppSectionProps) {
  return (
    <Tag className={`py-16 ${bg ? bgClass[bg] : ''} ${className ?? ''}`} {...rest}>
      <div className="container mx-auto px-4">
        {children}
      </div>
    </Tag>
  )
}
