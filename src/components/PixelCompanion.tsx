import { useEffect, useState } from 'react'

// Import all frames
import age00 from '../assets/pixel/age_00.png'
import age01 from '../assets/pixel/age_01.png'
import age02 from '../assets/pixel/age_02.png'
import age03 from '../assets/pixel/age_03.png'
import age04 from '../assets/pixel/age_04.png'
import age05 from '../assets/pixel/age_05.png'
import age06 from '../assets/pixel/age_06.png'
import age07 from '../assets/pixel/age_07.png'
import walk00 from '../assets/pixel/walk_00.png'
import walk01 from '../assets/pixel/walk_01.png'
import walk02 from '../assets/pixel/walk_02.png'
import walk03 from '../assets/pixel/walk_03.png'
import sitting from '../assets/pixel/sitting.png'

const AGE_FRAMES = [age00, age01, age02, age03, age04, age05, age06, age07]
const WALK_FRAMES = [walk00, walk01, walk02, walk03]
const NUM_AGE_FRAMES = AGE_FRAMES.length
const NUM_WALK_FRAMES = WALK_FRAMES.length

interface PixelCompanionProps {
  ageProgress: number // 0.0 = youngest (oldest events), 1.0 = oldest (most recent)
  scrollProgress: number // 0.0 = top, 1.0 = bottom
}

export function PixelCompanion({ ageProgress, scrollProgress }: PixelCompanionProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [walkFrame, setWalkFrame] = useState(0)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Animate walking cycle when scrolling
  useEffect(() => {
    if (prefersReducedMotion) return

    // Only animate walking when not at the very top (sitting)
    if (scrollProgress > 0.05) {
      const interval = setInterval(() => {
        setWalkFrame((prev) => (prev + 1) % NUM_WALK_FRAMES)
      }, 200) // Walk animation speed

      return () => clearInterval(interval)
    } else {
      setWalkFrame(0)
    }
  }, [scrollProgress, prefersReducedMotion])

  // Clamp ageProgress to [0, 1] and convert to frame index
  const clampedAgeProgress = Math.max(0, Math.min(1, ageProgress))
  const ageFrameIndex = Math.round(clampedAgeProgress * (NUM_AGE_FRAMES - 1))
  const currentAgeFrame = AGE_FRAMES[ageFrameIndex]

  // Determine pose: sitting at top, walking when scrolling
  const isSitting = scrollProgress < 0.05
  const isWalking = scrollProgress >= 0.05 && !prefersReducedMotion

  // Select frame based on state
  let displayFrame: string
  if (isSitting) {
    displayFrame = sitting
  } else if (isWalking) {
    displayFrame = WALK_FRAMES[walkFrame]
  } else {
    displayFrame = currentAgeFrame
  }

  const [viewportHeight, setViewportHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800)

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

  return (
    <aside
      className="pointer-events-none fixed z-30 hidden lg:block"
      style={{
        left: `${fixedLeftPosition}px`,
        top: `${topOffset}px`,
        transition: prefersReducedMotion ? 'none' : 'top 0.05s linear',
      }}
      aria-label="Scroll-driven character that ages and walks as you progress through the timeline"
    >
      <div className="relative">
        <img
          src={displayFrame}
          alt={
            isSitting
              ? 'Character sitting at the start'
              : isWalking
                ? `Character walking (age progress ${(clampedAgeProgress * 100).toFixed(0)}%)`
                : `Character at age progress ${(clampedAgeProgress * 100).toFixed(0)}%`
          }
          className="h-24 w-16 object-contain"
          style={{
            imageRendering: 'pixelated',
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
          }}
        />
      </div>
    </aside>
  )
}
