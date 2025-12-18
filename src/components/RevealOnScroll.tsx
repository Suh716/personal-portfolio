import { useEffect, useRef, useState, type ReactNode } from 'react'

interface RevealOnScrollProps {
  children: ReactNode
  delayMs?: number
}

export function RevealOnScroll({ children, delayMs = 0 }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let timeoutId: number | null = null

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (timeoutId !== null) {
              window.clearTimeout(timeoutId)
            }
            timeoutId = window.setTimeout(() => {
              setIsVisible(true)
            }, delayMs)
          } else {
            if (timeoutId !== null) {
              window.clearTimeout(timeoutId)
              timeoutId = null
            }
            setIsVisible(false)
          }
        })
      },
      {
        threshold: 0.15,
      },
    )

    observer.observe(el)

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }
      observer.disconnect()
    }
  }, [delayMs])

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out will-change-transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </div>
  )
}


