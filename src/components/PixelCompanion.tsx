import { useEffect, useState, useRef } from 'react'

// Import the character image and walk frames
import characterImg from '../assets/pixel/character.png'
import walk00 from '../assets/pixel/walk_00.png'
import walk01 from '../assets/pixel/walk_01.png'
import walk02 from '../assets/pixel/walk_02.png'
import walk03 from '../assets/pixel/walk_03.png'

const WALK_FRAMES = [walk00, walk01, walk02, walk03]
const NUM_WALK_FRAMES = WALK_FRAMES.length
const NUM_SLOTS = 5 // Discrete save slots between top and bottom

interface PixelCompanionProps {
  ageProgress: number // 0.0 = youngest (oldest events), 1.0 = oldest (most recent)
  scrollProgress: number // 0.0 = top, 1.0 = bottom
}

export function PixelCompanion({ ageProgress, scrollProgress }: PixelCompanionProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [walkFrame, setWalkFrame] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800)
  const [targetPosition, setTargetPosition] = useState(0) // Target scroll position (where character should be)
  const [currentPosition, setCurrentPosition] = useState(0) // Current character position (independent entity)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

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

  // Detect when scrolling stops - character stays fixed during scroll
  useEffect(() => {
    setIsScrolling(true)

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // Set new timeout - scrolling stops after 200ms of no scroll events
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false)
      // Update target position when scrolling stops - quantized into discrete \"save slots\"
      const slotIndex = Math.round(scrollProgress * (NUM_SLOTS - 1))
      const slotNormalized = slotIndex / (NUM_SLOTS - 1)
      setTargetPosition(slotNormalized)
    }, 200)

    return () => {
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [scrollProgress])

  // Character moves at its own fixed walking pace to catch up (only when not scrolling)
  useEffect(() => {
    if (prefersReducedMotion) {
      setCurrentPosition(targetPosition)
      return
    }

    // Character stays fixed while scrolling
    if (isScrolling) {
      return
    }

    // Character walks at a fixed speed (pixels per frame) to catch up
    const walkSpeed = 0.008 // Fixed walking speed per frame (slower, more deliberate)
    const minDistance = 0.002 // Minimum distance to consider "caught up"

    const animate = () => {
      setCurrentPosition((prev) => {
        const diff = targetPosition - prev
        const distance = Math.abs(diff)

        // If very close, snap to target
        if (distance < minDistance) {
          return targetPosition
        }

        // Move at fixed speed toward target
        if (diff > 0) {
          // Moving down (forward)
          return Math.min(prev + walkSpeed, targetPosition)
        } else {
          // Moving up (backward)
          return Math.max(prev - walkSpeed, targetPosition)
        }
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [targetPosition, isScrolling, prefersReducedMotion])

  // Animate walking cycle only when character is actively moving to catch up
  useEffect(() => {
    if (prefersReducedMotion || isScrolling) {
      setWalkFrame(0)
      return
    }

    // Only animate walking when character is moving (catching up to scroll position)
    const isMoving = Math.abs(targetPosition - currentPosition) > 0.01

    if (isMoving && scrollProgress > 0.02) {
      const interval = setInterval(() => {
        setWalkFrame((prev) => (prev + 1) % NUM_WALK_FRAMES)
      }, 180) // Walk animation speed (slightly faster for more visible animation)

      return () => clearInterval(interval)
    } else {
      setWalkFrame(0)
    }
  }, [targetPosition, currentPosition, scrollProgress, isScrolling, prefersReducedMotion])

  // Fixed left position - character walks straight down, no horizontal movement
  const fixedLeftPosition = 24 // pixels from left edge

  // Vertical position: character's independent position (not tied directly to scroll)
  const navbarHeight = 64
  const maxScrollDistance = viewportHeight - navbarHeight - 150 // Leave some space at bottom
  const topOffset = navbarHeight + 20 + currentPosition * maxScrollDistance

  // Apply subtle aging effect via CSS filter (brightness/contrast changes)
  const ageFilter = prefersReducedMotion
    ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
    : `brightness(${0.95 + ageProgress * 0.1}) contrast(${1.0 - ageProgress * 0.05}) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))`

  // Select frame: use walking animation when actively moving to catch up
  const isWalking =
    !isScrolling && Math.abs(targetPosition - currentPosition) > 0.01 && scrollProgress > 0.02 && !prefersReducedMotion
  const displayFrame = isWalking ? WALK_FRAMES[walkFrame] : characterImg

  return (
    <aside
      className="pointer-events-none absolute z-30 hidden lg:block"
      style={{
        left: `${fixedLeftPosition}px`,
        top: `${topOffset}px`,
        transition: 'none', // No CSS transitions - character moves via JavaScript for independent feel
      }}
      aria-label="Scroll-driven character that ages and walks independently to catch up to scroll position"
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
