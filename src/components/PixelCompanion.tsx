import { useEffect, useState, useRef } from 'react'

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
  const [targetPosition, setTargetPosition] = useState(0) // Target scroll position
  const [currentPosition, setCurrentPosition] = useState(0) // Current character position (with delay)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<number | null>(null)

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

  // Detect when scrolling stops
  useEffect(() => {
    setIsScrolling(true)

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // Set new timeout - scrolling stops after 150ms of no scroll events
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false)
      // Update target position when scrolling stops
      setTargetPosition(scrollProgress)
    }, 150)

    return () => {
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [scrollProgress])

  // Animate character position to catch up to target (only when not scrolling)
  useEffect(() => {
    if (prefersReducedMotion) {
      setCurrentPosition(targetPosition)
      return
    }

    // Only catch up when scrolling has stopped
    if (isScrolling) {
      return
    }

    const catchUpSpeed = 0.05 // Catch-up speed
    const interval = setInterval(() => {
      setCurrentPosition((prev) => {
        const diff = targetPosition - prev
        // If difference is very small, snap to target, otherwise ease towards it
        if (Math.abs(diff) < 0.001) {
          return targetPosition
        }
        return prev + diff * catchUpSpeed
      })
    }, 16) // ~60fps

    return () => clearInterval(interval)
  }, [targetPosition, isScrolling, prefersReducedMotion])

  // Animate walking cycle only when character is catching up (and not scrolling)
  useEffect(() => {
    if (prefersReducedMotion || isScrolling) return

    // Only animate walking when character is moving (catching up to scroll position)
    const isMoving = Math.abs(targetPosition - currentPosition) > 0.01

    if (isMoving && scrollProgress > 0.02) {
      const interval = setInterval(() => {
        setWalkFrame((prev) => (prev + 1) % NUM_WALK_FRAMES)
      }, 200) // Walk animation speed (200ms per frame)

      return () => clearInterval(interval)
    } else {
      setWalkFrame(0)
    }
  }, [targetPosition, currentPosition, scrollProgress, isScrolling, prefersReducedMotion])

  // Fixed left position - character walks straight down, no horizontal movement
  const fixedLeftPosition = 24 // pixels from left edge

  // Vertical position: use currentPosition (with delay) instead of scrollProgress
  const navbarHeight = 64
  const maxScrollDistance = viewportHeight - navbarHeight - 150 // Leave some space at bottom
  const topOffset = navbarHeight + 20 + currentPosition * maxScrollDistance

  // Apply subtle aging effect via CSS filter (brightness/contrast changes)
  const ageFilter = prefersReducedMotion
    ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
    : `brightness(${0.95 + ageProgress * 0.1}) contrast(${1.0 - ageProgress * 0.05}) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))`

  // Select frame: use walking animation when catching up (and not scrolling), static character otherwise
  const isWalking =
    !isScrolling && Math.abs(targetPosition - currentPosition) > 0.01 && scrollProgress > 0.02 && !prefersReducedMotion
  const displayFrame = isWalking ? WALK_FRAMES[walkFrame] : characterImg

  return (
    <aside
      className="pointer-events-none fixed z-30 hidden lg:block"
      style={{
        left: `${fixedLeftPosition}px`,
        top: `${topOffset}px`,
        transition: prefersReducedMotion ? 'none' : 'filter 0.3s ease-out',
      }}
      aria-label="Scroll-driven character that ages and walks as you progress through the timeline"
    >
      <div className="relative">
        <img
          src={displayFrame}
          alt={
            isWalking
              ? `Character walking to catch up (age progress ${(ageProgress * 100).toFixed(0)}%)`
              : `Character at age progress ${(ageProgress * 100).toFixed(0)}%`
          }
          className="h-auto w-24 object-contain"
          style={{
            imageRendering: 'pixelated',
            filter: ageFilter,
          }}
        />
      </div>
    </aside>
  )
}
