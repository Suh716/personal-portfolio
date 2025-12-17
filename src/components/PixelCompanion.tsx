import { useEffect, useState } from 'react'

// Import the character image
import characterImg from '../assets/pixel/character.png'

interface PixelCompanionProps {
  ageProgress: number // 0.0 = youngest (oldest events), 1.0 = oldest (most recent)
  scrollProgress: number // 0.0 = top, 1.0 = bottom
}

export function PixelCompanion({ ageProgress, scrollProgress }: PixelCompanionProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Fixed left position - character walks straight down, no horizontal movement
  const fixedLeftPosition = 24 // pixels from left edge

  // Vertical position: follows scroll position (character moves down as you scroll)
  const navbarHeight = 64
  const maxScrollDistance = viewportHeight - navbarHeight - 150 // Leave some space at bottom
  const topOffset = navbarHeight + 20 + scrollProgress * maxScrollDistance

  // Apply subtle aging effect via CSS filter (brightness/contrast changes)
  const ageFilter = prefersReducedMotion
    ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
    : `brightness(${0.95 + ageProgress * 0.1}) contrast(${1.0 - ageProgress * 0.05}) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))`

  return (
    <aside
      className="pointer-events-none fixed z-30 hidden lg:block"
      style={{
        left: `${fixedLeftPosition}px`,
        top: `${topOffset}px`,
        transition: prefersReducedMotion ? 'none' : 'top 0.05s linear, filter 0.3s ease-out',
      }}
      aria-label="Scroll-driven character that ages as you progress through the timeline"
    >
      <div className="relative">
        <img
          src={characterImg}
          alt={`Character at age progress ${(ageProgress * 100).toFixed(0)}%`}
          className="h-auto w-16 object-contain"
          style={{
            imageRendering: 'pixelated',
            filter: ageFilter,
          }}
        />
      </div>
    </aside>
  )
}
