import { useQuery } from '@tanstack/react-query'
import { Quote } from 'lucide-react'
import { queryKeys } from '@/shared/lib/queryKeys'
import photoUrl from '@/assets/swg-23.jpg'
import { apiGet } from '@/shared/services/api'
import { useDragScroll } from '@/shared/hooks/useDragScroll'

interface Testimonial {
  id: number
  name: string
  quote: string
  trip: string
}

interface TestimonialBlockProps {
  eyebrow: string
  title: string
}

export function TestimonialBlock({ eyebrow, title }: TestimonialBlockProps) {
  const { data } = useQuery({
    queryKey: queryKeys.testimonials(),
    queryFn: () => apiGet<Testimonial[]>('/swg/v1/testimonials'),
    staleTime: 10 * 60 * 1000,
  })

  const testimonials = data ?? []
  const { trackRef, onDragStart, onDragMove, onDragEnd } = useDragScroll<HTMLDivElement>()

  return (
    <section aria-labelledby="testimonials-title">
      {/* Photo header */}
      <div className="relative h-72 overflow-hidden md:h-96">
        <img
          src={photoUrl}
          alt="SWG deelnemers op de piste"
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
          width={1600}
          height={900}
        />
        <div className="from-dark/80 via-dark/30 to-dark/10 absolute inset-0 bg-linear-to-t" aria-hidden="true" />
        <div className="absolute inset-0 container mx-auto flex flex-col justify-end px-4 pb-10">
          <p className="text-accent-500 mb-2 text-sm font-semibold tracking-widest uppercase">{eyebrow}</p>
          <h2 id="testimonials-title" className="text-3xl font-bold text-white md:text-4xl">{title}</h2>
        </div>
      </div>

      {/* Testimonial cards */}
      <div className="dark:bg-dark-secondary overflow-hidden bg-gray-50 py-16">
        <div
          ref={trackRef}
          className="flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth select-none [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
          role="list"
          aria-label="Deelnemerservaringen"
          onMouseDown={onDragStart}
          onMouseMove={onDragMove}
          onMouseUp={onDragEnd}
          onMouseLeave={onDragEnd}
        >
          {/* Leading spacer */}
          <div className="shrink-0" style={{ width: 'max(1rem, calc((100vw - 80rem) / 2 + 1rem))' }} aria-hidden="true" />

          {testimonials.map((item) => (
            <blockquote
              key={item.id}
              role="listitem"
              className="dark:bg-dark flex w-[85vw] flex-none snap-start flex-col gap-6 rounded-2xl bg-white p-8 shadow-sm sm:w-[26.25rem]"
            >
              <Quote className="text-primary-500/30 h-8 w-8" aria-hidden="true" />
              <p className="flex-1 text-lg leading-relaxed dark:text-white/90">"{item.quote}"</p>
              <footer className="text-sm">
                <span className="font-semibold dark:text-white">{item.name}</span>
                <span className="text-muted"> — {item.trip}</span>
              </footer>
            </blockquote>
          ))}

          {/* Trailing spacer */}
          <div className="shrink-0" style={{ width: 'max(1rem, calc((100vw - 80rem) / 2 + 1rem))' }} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
