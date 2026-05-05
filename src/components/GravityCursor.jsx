import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function GravityCursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const smoothX = useSpring(x, { stiffness: 780, damping: 42, mass: 0.22 })
  const smoothY = useSpring(y, { stiffness: 780, damping: 42, mass: 0.22 })
  const haloX = useSpring(x, { stiffness: 260, damping: 30, mass: 0.35 })
  const haloY = useSpring(y, { stiffness: 260, damping: 30, mass: 0.35 })
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
      window.setTimeout(() => setPressed(false), 220)
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
        className="pointer-events-none fixed left-0 top-0 z-[999] hidden h-24 w-24 md:block"
        style={{ x: haloX, y: haloY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: active ? 1.18 : pressed ? 0.9 : 1, opacity: active ? 0.95 : 0.58 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(93,224,255,.16),rgba(93,224,255,.055)_34%,transparent_68%)] blur-[1px]" />
        <div className="absolute inset-5 rounded-full border border-cyan-200/20" />
        <div className="absolute left-1/2 top-1/2 h-px w-24 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-100/45 to-transparent" />
        <div className="absolute left-1/2 top-1/2 h-24 w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-cyan-100/35 to-transparent" />
      </motion.div>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[1000] hidden h-7 w-7 md:block"
        style={{ x: smoothX, y: smoothY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: pressed ? 0.72 : active ? 1.22 : 1 }}
        transition={{ type: 'spring', stiffness: 620, damping: 25 }}
      >
        <div className="absolute inset-0 rounded-full border border-[#5de0ff]/80 shadow-[0_0_28px_rgba(93,224,255,.62)]" />
        <div className="absolute inset-[5px] rounded-full border border-white/35" />
        <div className="absolute left-1/2 top-[-5px] h-2 w-px -translate-x-1/2 bg-[#5de0ff]/80" />
        <div className="absolute bottom-[-5px] left-1/2 h-2 w-px -translate-x-1/2 bg-[#5de0ff]/80" />
        <div className="absolute left-[-5px] top-1/2 h-px w-2 -translate-y-1/2 bg-[#5de0ff]/80" />
        <div className="absolute right-[-5px] top-1/2 h-px w-2 -translate-y-1/2 bg-[#5de0ff]/80" />
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,.95)]" />
      </motion.div>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[998] hidden h-12 w-12 rounded-full border border-cyan-100/40 md:block"
        style={{ x: smoothX, y: smoothY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: pressed ? 2.7 : 0.3, opacity: pressed ? 0 : 0 }}
        transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
      />
    </>
  )
}
