interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  headingId?: string
  align?: 'left' | 'center'
  theme?: 'default' | 'inverted'
  className?: string
}

export function SectionHeader({ eyebrow, title, description, headingId, align, theme, className = '' }: SectionHeaderProps) {
  return (
    <div className={`${align === 'center' ? 'mx-auto max-w-2xl text-center' : ''} ${className}`}>
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold tracking-widest text-accent-500 uppercase">{eyebrow}</p>
      )}
      <h2
        id={headingId}
        className={`mb-4 text-3xl font-bold md:text-4xl ${theme === 'inverted' ? 'text-white' : ''}`}
      >
        {title}
      </h2>
      {description && (
        <p className={`text-lg ${theme === 'inverted' ? 'text-white/60' : 'text-muted'}`}>{description}</p>
      )}
    </div>
  )
}
