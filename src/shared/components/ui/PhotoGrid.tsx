interface PhotoGridProps {
  photos: { src: string; alt: string }[]
  variant?: 'default' | 'sidebar'
}

export function PhotoGrid({ photos, variant }: PhotoGridProps) {
  if (!variant || variant === 'default') {
    return (
      <ul role="list" className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {photos.map((photo) => (
          <li key={photo.src}>
            <div className="aspect-4/3 overflow-hidden rounded-xl bg-gray-100 dark:bg-white/5">
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
                decoding="async"
              />
            </div>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2" aria-hidden="true">
      {photos.map((photo, i) => (
        <div
          key={photo.src}
          className={`overflow-hidden rounded-xl ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}
        >
          <img
            src={photo.src}
            alt=""
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
        </div>
      ))}
    </div>
  )
}
