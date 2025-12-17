import { useEffect, useState } from 'react'

/**
 * Hook that maps scroll position to age progress and scroll progress.
 * Returns both values for the pixel companion.
 */
export function useScrollAge(): { ageProgress: number; scrollProgress: number } {
  const [ageProgress, setAgeProgress] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    let rafId: number | null = null
    let lastScrollY = window.scrollY

    const updateProgress = () => {
      const scrollContainer = document.documentElement
      const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight
      const scrollY = window.scrollY

      // Only update if scroll position changed significantly (performance optimization)
      if (Math.abs(scrollY - lastScrollY) < 1) {
        rafId = requestAnimationFrame(updateProgress)
        return
      }

      lastScrollY = scrollY

      if (scrollHeight <= 0) {
        setAgeProgress(0)
        setScrollProgress(0)
        rafId = requestAnimationFrame(updateProgress)
        return
      }

      // Map scroll progress (0.0 = top, 1.0 = bottom)
      const newScrollProgress = scrollY / scrollHeight

      // Map scroll progress to age progress
      // 0.0 = at top (most recent accomplishments) = oldest character
      // 1.0 = at bottom (oldest events) = youngest character
      // So we invert: ageProgress = 1 - scrollProgress
      const newAgeProgress = 1 - newScrollProgress

      setAgeProgress(newAgeProgress)
      setScrollProgress(newScrollProgress)
      rafId = requestAnimationFrame(updateProgress)
    }

    // Initial update
    updateProgress()

    // Also listen to scroll events for immediate updates
    const handleScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateProgress)
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

  return { ageProgress, scrollProgress }
}
