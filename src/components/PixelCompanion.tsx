import { useEffect, useState } from 'react'

// Import all age frames
import age00 from '../assets/pixel/age_00.png'
import age01 from '../assets/pixel/age_01.png'
import age02 from '../assets/pixel/age_02.png'
import age03 from '../assets/pixel/age_03.png'
import age04 from '../assets/pixel/age_04.png'
import age05 from '../assets/pixel/age_05.png'
import age06 from '../assets/pixel/age_06.png'
import age07 from '../assets/pixel/age_07.png'

const AGE_FRAMES = [age00, age01, age02, age03, age04, age05, age06, age07]
const NUM_FRAMES = AGE_FRAMES.length

interface PixelCompanionProps {
  ageProgress: number // 0.0 = youngest (oldest events), 1.0 = oldest (most recent)
}

export function PixelCompanion({ ageProgress }: PixelCompanionProps) {
  // Clamp ageProgress to [0, 1] and convert to frame index
  const clampedProgress = Math.max(0, Math.min(1, ageProgress))
  const frameIndex = Math.round(clampedProgress * (NUM_FRAMES - 1))
  const currentFrame = AGE_FRAMES[frameIndex]

  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // If reduced motion, show a single middle frame
  const displayFrame = prefersReducedMotion ? AGE_FRAMES[Math.floor(NUM_FRAMES / 2)] : currentFrame

  return (
    <aside
      className="pointer-events-none fixed right-4 top-1/2 z-30 -translate-y-1/2 hidden lg:block"
      aria-label="Scroll-driven character that ages as you progress through the timeline"
    >
      <div className="relative">
        <img
          src={displayFrame}
          alt={`Character at age progress ${(clampedProgress * 100).toFixed(0)}%`}
          className="h-24 w-16 object-contain drop-shadow-lg transition-opacity duration-300"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    </aside>
  )
}

