import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { usePerformanceProfile } from '../lib/performance.js'

const DESKTOP_CURSOR_QUERY = '(hover: hover) and (pointer: fine) and (min-width: 768px)'

export default function GravityCursor() {
  const performance = usePerformanceProfile()
  const prefersReducedMotion = useReducedMotion()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const smoothX = useSpring(x, { stiffness: 620, damping: 42, mass: 0.28 })
  const smoothY = useSpring(y, { stiffness: 620, damping: 42, mass: 0.28 })
  const haloX = useSpring(x, { stiffness: 180, damping: 28, mass: 0.45 })
  const haloY = useSpring(y, { stiffness: 180, damping: 28, mass: 0.45 })
  const [enabled, setEnabled] = useState(false)
  const [active, setActive] = useState(false)
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const media = window.matchMedia(DESKTOP_CURSOR_QUERY)
    const syncMode = () =>
      setEnabled(media.matches && !prefersReducedMotion && performance.cursorEnabled)

    syncMode()
    media.addEventListener('change', syncMode)

    return () => media.removeEventListener('change', syncMode)
  }, [performance.cursorEnabled, prefersReducedMotion])

  useEffect(() => {
    if (!enabled) return undefined

    let raf = 0
    let lastX = -100
    let lastY = -100

    const update = () => {
      x.set(lastX)
      y.set(lastY)
      raf = 0
    }

    const move = event => {
      lastX = event.clientX
      lastY = event.clientY
      if (!raf) raf = requestAnimationFrame(update)
      setActive(Boolean(event.target.closest('a, button, [data-cursor="active"]')))
    }

    const down = () => {
      setPressed(true)
      window.setTimeout(() => setPressed(false), 180)
    }

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mousedown', down, { passive: true })

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[999] h-20 w-20 rounded-full"
        style={{ x: haloX, y: haloY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: active ? 1.1 : pressed ? 0.92 : 1, opacity: active ? 0.34 : 0.18 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        <div className="absolute inset-0 rounded-full border border-[#c7a15a]/18 bg-[radial-gradient(circle,rgba(199,161,90,.1),transparent_68%)]" />
      </motion.div>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[1000] h-3 w-3 rounded-full bg-[#f4efe7] shadow-[0_0_24px_rgba(244,239,231,.22)]"
        style={{ x: smoothX, y: smoothY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: pressed ? 0.74 : active ? 1.35 : 1, backgroundColor: active ? '#c7a15a' : '#f4efe7' }}
        transition={{ type: 'spring', stiffness: 540, damping: 26 }}
      />
    </>
  )
}
