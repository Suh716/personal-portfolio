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
  const [targetPosition, setTargetPosition] = useState(0) // Target top offset in px (where character should be)
  const [currentPosition, setCurrentPosition] = useState(0) // Current character top offset in px (independent entity)
  const [zoneOffsets, setZoneOffsets] = useState<number[]>([]) // Anchors for [hero, experience, projects, qualifications, contact]
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

  // Compute zone anchors based on section headers: hero, experience, projects, qualifications, contact
  useEffect(() => {
    const computeZones = () => {
      const root = document.getElementById('root')
      const rootTop = root ? root.getBoundingClientRect().top + window.scrollY : 0

      const zones: number[] = []

      const main = document.querySelector('main')
      const heroSection = main?.querySelector('section') as HTMLElement | null

      const addZone = (el: HTMLElement | null) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const y = rect.top + window.scrollY - rootTop
        zones.push(y)
      }

      // Hero / header zone
      if (heroSection) {
        addZone(heroSection)
      } else {
        zones.push(0)
      }

      addZone(document.getElementById('experience') as HTMLElement | null)
      addZone(document.getElementById('projects') as HTMLElement | null)
      addZone(document.getElementById('qualifications') as HTMLElement | null)
      addZone(document.getElementById('contact') as HTMLElement | null)

      if (zones.length) {
        setZoneOffsets(zones)
        // Initialize character at the first zone on first load
        if (currentPosition === 0 && targetPosition === 0) {
          setCurrentPosition(zones[0])
          setTargetPosition(zones[0])
        }
      }
    }

    computeZones()
    window.addEventListener('resize', computeZones)
    return () => window.removeEventListener('resize', computeZones)
  }, [currentPosition, targetPosition])

  // Detect when scrolling stops - character stays fixed during scroll
  useEffect(() => {
    if (!zoneOffsets.length) return

    setIsScrolling(true)

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // Set new timeout - scrolling stops after 200ms of no scroll events
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false)
      // Determine which zone header is closest to the viewport center
      const root = document.getElementById('root')
      const rootTop = root ? root.getBoundingClientRect().top + window.scrollY : 0
      const viewportCenter = window.scrollY + window.innerHeight / 2
      const relativeCenter = viewportCenter - rootTop

      let closestIndex = 0
      let closestDistance = Infinity
      zoneOffsets.forEach((offset, index) => {
        const distance = Math.abs(offset - relativeCenter)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      const targetTop = zoneOffsets[closestIndex]
      setTargetPosition(targetTop)
    }, 200)

    return () => {
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [scrollProgress, zoneOffsets])

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
    const walkSpeed = 8 // px per frame
    const minDistance = 2 // px: minimum distance to consider "caught up"

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
        }
        // Moving up (backward)
        return Math.max(prev - walkSpeed, targetPosition)
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
  const topOffset = currentPosition

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
