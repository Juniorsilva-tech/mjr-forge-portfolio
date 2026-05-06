import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function GravityCursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const smoothX = useSpring(x, { stiffness: 620, damping: 42, mass: 0.28 })
  const smoothY = useSpring(y, { stiffness: 620, damping: 42, mass: 0.28 })
  const haloX = useSpring(x, { stiffness: 180, damping: 28, mass: 0.45 })
  const haloY = useSpring(y, { stiffness: 180, damping: 28, mass: 0.45 })
  const [active, setActive] = useState(false)
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
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
  }, [x, y])

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[999] hidden h-20 w-20 rounded-full md:block"
        style={{ x: haloX, y: haloY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: active ? 1.12 : pressed ? 0.92 : 1, opacity: active ? 0.42 : 0.22 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        <div className="absolute inset-0 rounded-full border border-[#c7a15a]/20 bg-[radial-gradient(circle,rgba(199,161,90,.12),transparent_68%)]" />
      </motion.div>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[1000] hidden h-3 w-3 rounded-full bg-[#f4efe7] shadow-[0_0_24px_rgba(244,239,231,.28)] md:block"
        style={{ x: smoothX, y: smoothY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: pressed ? 0.7 : active ? 1.45 : 1, backgroundColor: active ? '#c7a15a' : '#f4efe7' }}
        transition={{ type: 'spring', stiffness: 540, damping: 26 }}
      />
    </>
  )
}
