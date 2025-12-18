import { useEffect, useState } from 'react'

/**
 * Hook that maps scroll position to:
 * - ageProgress: 0.0–1.0 (younger at bottom)
 * - scrollProgress: 0.0–1.0 (top to bottom)
 * - scrollY: raw scroll offset in px (for parallax)
 */
export function useScrollAge(): { ageProgress: number; scrollProgress: number; scrollY: number } {
  const [ageProgress, setAgeProgress] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let rafId: number | null = null
    let lastScrollY = window.scrollY

    const updateProgress = () => {
      const scrollContainer = document.documentElement
      const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight
      const currentY = window.scrollY

      // Only update if scroll position changed significantly (performance optimization)
      if (Math.abs(currentY - lastScrollY) < 1) {
        rafId = requestAnimationFrame(updateProgress)
        return
      }

      lastScrollY = currentY

      if (scrollHeight <= 0) {
        setAgeProgress(0)
        setScrollProgress(0)
        rafId = requestAnimationFrame(updateProgress)
        return
      }

      // Map scroll progress (0.0 = top, 1.0 = bottom)
      const newScrollProgress = currentY / scrollHeight

      // Map scroll progress to age progress
      // 0.0 = at top (most recent accomplishments) = oldest character
      // 1.0 = at bottom (oldest events) = youngest character
      // So we invert: ageProgress = 1 - scrollProgress
      const newAgeProgress = 1 - newScrollProgress

      setAgeProgress(newAgeProgress)
      setScrollProgress(newScrollProgress)
      setScrollY(currentY)
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

  return { ageProgress, scrollProgress, scrollY }
}
