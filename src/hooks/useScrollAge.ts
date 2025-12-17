import { useEffect, useState } from 'react'

/**
 * Hook that maps scroll position to age progress (0.0 = youngest, 1.0 = oldest).
 * Uses requestAnimationFrame throttling for performance.
 */
export function useScrollAge(): number {
  const [ageProgress, setAgeProgress] = useState(0)

  useEffect(() => {
    let rafId: number | null = null
    let lastScrollY = window.scrollY

    const updateAgeProgress = () => {
      // Get the main content container (or use document body)
      const scrollContainer = document.documentElement
      const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight
      const scrollY = window.scrollY

      // Only update if scroll position changed significantly (performance optimization)
      if (Math.abs(scrollY - lastScrollY) < 1) {
        rafId = requestAnimationFrame(updateAgeProgress)
        return
      }

      lastScrollY = scrollY

      if (scrollHeight <= 0) {
        setAgeProgress(0)
        rafId = requestAnimationFrame(updateAgeProgress)
        return
      }

      // Map scroll progress to age progress
      // 0.0 = at top (most recent accomplishments) = oldest character
      // 1.0 = at bottom (oldest events) = youngest character
      // So we invert: ageProgress = 1 - scrollProgress
      const scrollProgress = scrollY / scrollHeight
      const newAgeProgress = 1 - scrollProgress

      setAgeProgress(newAgeProgress)
      rafId = requestAnimationFrame(updateAgeProgress)
    }

    // Initial update
    updateAgeProgress()

    // Also listen to scroll events for immediate updates
    const handleScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateAgeProgress)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [])

  return ageProgress
}

