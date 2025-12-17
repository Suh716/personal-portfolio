import { useEffect, useState } from 'react'

// Import the character image and walk frames
import characterImg from '../assets/pixel/character.png'
import walk00 from '../assets/pixel/walk_00.png'
import walk01 from '../assets/pixel/walk_01.png'
import walk02 from '../assets/pixel/walk_02.png'
import walk03 from '../assets/pixel/walk_03.png'

const WALK_FRAMES = [walk00, walk01, walk02, walk03]
const NUM_WALK_FRAMES = WALK_FRAMES.length

interface PixelCompanionProps {
  ageProgress: number // 0.0 = youngest (oldest events), 1.0 = oldest (most recent)
  scrollProgress: number // 0.0 = top, 1.0 = bottom
}

export function PixelCompanion({ ageProgress, scrollProgress }: PixelCompanionProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [walkFrame, setWalkFrame] = useState(0)
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

  // Animate walking cycle when scrolling
  useEffect(() => {
    if (prefersReducedMotion) return

    // Only animate walking when scrolling (not at the very top)
    if (scrollProgress > 0.02) {
      const interval = setInterval(() => {
        setWalkFrame((prev) => (prev + 1) % NUM_WALK_FRAMES)
      }, 200) // Walk animation speed (200ms per frame)

      return () => clearInterval(interval)
    } else {
      setWalkFrame(0)
    }
  }, [scrollProgress, prefersReducedMotion])

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

  // Select frame: use walking animation when scrolling, static character at top
  const isWalking = scrollProgress > 0.02 && !prefersReducedMotion
  const displayFrame = isWalking ? WALK_FRAMES[walkFrame] : characterImg

  return (
    <aside
      className="pointer-events-none fixed z-30 hidden lg:block"
      style={{
        left: `${fixedLeftPosition}px`,
        top: `${topOffset}px`,
        transition: prefersReducedMotion ? 'none' : 'top 0.05s linear, filter 0.3s ease-out',
      }}
      aria-label="Scroll-driven character that ages and walks as you progress through the timeline"
    >
      <div className="relative">
        <img
          src={displayFrame}
          alt={
            isWalking
              ? `Character walking (age progress ${(ageProgress * 100).toFixed(0)}%)`
              : `Character at age progress ${(ageProgress * 100).toFixed(0)}%`
          }
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
