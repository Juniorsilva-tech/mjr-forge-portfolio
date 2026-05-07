import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { usePerformanceProfile } from '../../lib/performance.js'

const DESKTOP_QUERY = '(hover: hover) and (pointer: fine) and (min-width: 1024px)'

export default function DynamicLight() {
  const performance = usePerformanceProfile()
  const prefersReducedMotion = useReducedMotion()
  const [isInteractive, setIsInteractive] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const smoothX = useSpring(x, { stiffness: 120, damping: 24, mass: 0.9 })
  const smoothY = useSpring(y, { stiffness: 120, damping: 24, mass: 0.9 })

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const media = window.matchMedia(DESKTOP_QUERY)
    const syncMode = () =>
      setIsInteractive(media.matches && !prefersReducedMotion && performance.dynamicLight)

    syncMode()
    media.addEventListener('change', syncMode)

    return () => media.removeEventListener('change', syncMode)
  }, [performance.dynamicLight, prefersReducedMotion])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const seed = () => {
      x.set(window.innerWidth * 0.72)
      y.set(window.innerHeight * 0.22)
    }

    seed()

    if (!isInteractive) return undefined

    let frame = 0
    let nextX = window.innerWidth * 0.72
    let nextY = window.innerHeight * 0.22

    const update = () => {
      x.set(nextX)
      y.set(nextY)
      frame = 0
    }

    const handleMove = event => {
      nextX = event.clientX
      nextY = event.clientY

      if (!frame) {
        frame = window.requestAnimationFrame(update)
      }
    }

    window.addEventListener('mousemove', handleMove, { passive: true })

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', handleMove)
    }
  }, [isInteractive, x, y])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      <div className="forge-light-ambient absolute inset-0" />
      <motion.div
        className="forge-light-orb absolute left-0 top-0"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      <div className="forge-light-secondary absolute bottom-[-18vh] left-[-8vw]" />
    </div>
  )
}
