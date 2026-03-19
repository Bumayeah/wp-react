interface BaseImageProps {
  src: string
  alt: string
  width: number
  height: number
  eager?: boolean
  className?: string
}

export function BaseImage({ src, alt, width, height, eager, className }: BaseImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
    />
  )
}
