import { useRef, useState } from 'react'

export function useDragScroll<T extends HTMLElement = HTMLElement>() {
  const trackRef = useRef<T | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  function onDragStart(e: React.MouseEvent) {
    setIsDragging(true)
    startX.current = e.pageX - (trackRef.current?.offsetLeft ?? 0)
    scrollLeft.current = trackRef.current?.scrollLeft ?? 0
  }

  function onDragMove(e: React.MouseEvent) {
    if (!isDragging || !trackRef.current) return
    e.preventDefault()
    const x = e.pageX - trackRef.current.offsetLeft
    trackRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.5
  }

  function onDragEnd() {
    setIsDragging(false)
  }

  return { trackRef, isDragging, onDragStart, onDragMove, onDragEnd }
}
