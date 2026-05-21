import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { usePerformanceProfile } from '../../lib/performance.js'

const DESKTOP_QUERY = '(hover: hover) and (pointer: fine) and (min-width: 1024px)'

function lerp(start, end, amount) {
  return start + (end - start) * amount
}

function mixColor(from, to, amount) {
  return [
    Math.round(lerp(from[0], to[0], amount)),
    Math.round(lerp(from[1], to[1], amount)),
    Math.round(lerp(from[2], to[2], amount)),
  ]
}

function ObsidianForgeCanvas({ enabled, quality }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const canvas = canvasRef.current
    if (!canvas) return undefined

    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return undefined

    let animationFrame = 0
    let width = 0
    let height = 0
    let dpr = 1
    let lastTime = performance.now()
    let particleAccumulator = 0
    const particles = []
    const maxParticles = quality === 'high' ? 64 : quality === 'medium' ? 38 : 12
    const spawnRate = quality === 'high' ? 0.022 : quality === 'medium' ? 0.013 : 0

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, quality === 'high' ? 2 : 1.35)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const spawnParticle = (time) => {
      if (particles.length >= maxParticles) return

      const forgeX = width * (0.62 + Math.random() * 0.26)
      const forgeY = height * (0.22 + Math.random() * 0.52)
      const force = 0.6 + Math.random() * 0.9

      particles.push({
        x: forgeX,
        y: forgeY,
        vx: (-0.25 - Math.random() * 0.85) * force,
        vy: (-0.42 - Math.random() * 0.92) * force,
        drift: Math.random() * Math.PI * 2,
        size: 0.8 + Math.random() * 2.2,
        age: 0,
        life: 2100 + Math.random() * 2300,
        heat: 0.6 + Math.random() * 0.4,
        born: time,
      })
    }

    const drawBackgroundMatter = (time) => {
      context.globalCompositeOperation = 'source-over'
      context.clearRect(0, 0, width, height)

      const obsidianGlow = context.createRadialGradient(
        width * 0.62,
        height * 0.34,
        0,
        width * 0.62,
        height * 0.34,
        Math.max(width, height) * 0.82,
      )
      obsidianGlow.addColorStop(0, 'rgba(12, 38, 76, 0.22)')
      obsidianGlow.addColorStop(0.24, 'rgba(12, 18, 42, 0.2)')
      obsidianGlow.addColorStop(0.56, 'rgba(18, 10, 32, 0.12)')
      obsidianGlow.addColorStop(1, 'rgba(1, 1, 4, 0)')
      context.fillStyle = obsidianGlow
      context.fillRect(0, 0, width, height)

      const warmSideLight = context.createRadialGradient(
        width * 0.9,
        height * 0.2,
        0,
        width * 0.9,
        height * 0.2,
        Math.max(width, height) * 0.74,
      )
      warmSideLight.addColorStop(0, 'rgba(222, 139, 56, 0.16)')
      warmSideLight.addColorStop(0.24, 'rgba(166, 76, 34, 0.08)')
      warmSideLight.addColorStop(0.62, 'rgba(53, 26, 18, 0.03)')
      warmSideLight.addColorStop(1, 'rgba(0, 0, 0, 0)')
      context.fillStyle = warmSideLight
      context.fillRect(0, 0, width, height)

      const pulse = (Math.sin(time * 0.0011) + 1) / 2
      const coreX = width * 0.73
      const coreY = height * 0.38

      context.globalCompositeOperation = 'lighter'
      for (let index = 0; index < 4; index += 1) {
        const radius = 76 + index * 62 + pulse * 18
        context.beginPath()
        context.ellipse(coreX, coreY, radius * 1.28, radius * 0.72, -0.36, 0, Math.PI * 2)
        context.strokeStyle = `rgba(${index % 2 ? '91, 126, 173' : '224, 137, 54'}, ${0.035 - index * 0.005})`
        context.lineWidth = 1 + index * 0.24
        context.shadowColor = index % 2 ? 'rgba(39, 89, 154, 0.28)' : 'rgba(224, 137, 54, 0.24)'
        context.shadowBlur = 20
        context.stroke()
      }
      context.shadowBlur = 0
    }

    const drawDust = (time) => {
      context.globalCompositeOperation = 'screen'
      const count = quality === 'high' ? 48 : quality === 'medium' ? 28 : 10

      for (let index = 0; index < count; index += 1) {
        const seed = index * 97.13
        const x = (Math.sin(seed) * 0.5 + 0.5) * width
        const y = ((Math.cos(seed * 1.21) * 0.5 + 0.5) * height + time * 0.006 * (index % 5)) % height
        const opacity = 0.018 + ((index % 7) / 7) * 0.024

        context.fillStyle = `rgba(184, 178, 169, ${opacity})`
        context.fillRect(x, y, 0.8, 0.8)
      }
    }

    const drawParticles = (delta, time) => {
      if (enabled) {
        particleAccumulator += delta * spawnRate
        while (particleAccumulator >= 1) {
          spawnParticle(time)
          particleAccumulator -= 1
        }
      }

      context.globalCompositeOperation = 'lighter'

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index]
        particle.age += delta

        const progress = Math.min(particle.age / particle.life, 1)
        if (progress >= 1) {
          particles.splice(index, 1)
          continue
        }

        const turbulence = Math.sin(time * 0.002 + particle.drift) * 0.28
        particle.x += particle.vx + turbulence
        particle.y += particle.vy - progress * 0.42
        particle.vx *= 0.996
        particle.vy *= 0.992

        const hot = [239, 148, 58]
        const cooling = [86, 64, 82]
        const ash = [136, 133, 126]
        const firstFade = Math.min(progress / 0.56, 1)
        const secondFade = Math.max((progress - 0.56) / 0.44, 0)
        const color = secondFade > 0 ? mixColor(cooling, ash, secondFade) : mixColor(hot, cooling, firstFade)
        const opacity = Math.pow(1 - progress, 1.45) * particle.heat * 0.72
        const size = particle.size * (1 + progress * 1.8)

        context.shadowColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`
        context.shadowBlur = progress < 0.42 ? 14 : 3
        context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`

        if (progress < 0.72) {
          context.beginPath()
          context.arc(particle.x, particle.y, size, 0, Math.PI * 2)
          context.fill()
        } else {
          const fragments = 3
          for (let fragment = 0; fragment < fragments; fragment += 1) {
            const angle = particle.drift + fragment * 2.1
            const offset = (progress - 0.72) * 28
            context.fillRect(
              particle.x + Math.cos(angle) * offset,
              particle.y + Math.sin(angle) * offset,
              Math.max(0.7, size * 0.44),
              Math.max(0.7, size * 0.44),
            )
          }
        }
      }

      context.shadowBlur = 0
    }

    const draw = (time) => {
      const delta = Math.min(time - lastTime, 34)
      lastTime = time

      drawBackgroundMatter(time)
      drawDust(time)
      drawParticles(delta, time)

      if (enabled) {
        animationFrame = window.requestAnimationFrame(draw)
      }
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })

    draw(lastTime)
    if (enabled) {
      animationFrame = window.requestAnimationFrame(draw)
    }

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
    }
  }, [enabled, quality])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{
        opacity: quality === 'low' ? 0.34 : 0.72,
        mixBlendMode: 'screen',
      }}
    />
  )
}

export default function DynamicLight() {
  const performanceProfile = usePerformanceProfile()
  const prefersReducedMotion = useReducedMotion()
  const [isInteractive, setIsInteractive] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const smoothX = useSpring(x, { stiffness: 120, damping: 24, mass: 0.9 })
  const smoothY = useSpring(y, { stiffness: 120, damping: 24, mass: 0.9 })
  const quality = performanceProfile.key
  const forgeMotionEnabled = performanceProfile.dynamicLight && !prefersReducedMotion && quality !== 'low'

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const media = window.matchMedia(DESKTOP_QUERY)
    const syncMode = () =>
      setIsInteractive(media.matches && !prefersReducedMotion && performanceProfile.dynamicLight)

    syncMode()
    media.addEventListener('change', syncMode)

    return () => media.removeEventListener('change', syncMode)
  }, [performanceProfile.dynamicLight, prefersReducedMotion])

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
      <ObsidianForgeCanvas enabled={forgeMotionEnabled} quality={quality} />

      <motion.div
        className="absolute inset-y-[-10vh] right-[-18vw] w-[58vw] blur-[78px]"
        style={{
          background:
            'radial-gradient(circle at 36% 22%, rgba(237,145,54,0.18), transparent 30%), radial-gradient(circle at 52% 48%, rgba(31,84,142,0.16), transparent 38%), radial-gradient(circle at 58% 72%, rgba(35,16,53,0.26), transparent 48%)',
        }}
        animate={
          forgeMotionEnabled
            ? { opacity: [0.46, 0.74, 0.46], scale: [1, 1.035, 1], x: [0, -10, 0] }
            : { opacity: 0.38, scale: 1, x: 0 }
        }
        transition={forgeMotionEnabled ? { duration: 7.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
      />

      <div
        className="absolute inset-0 opacity-[0.18] mix-blend-soft-light"
        style={{
          backgroundImage:
            'repeating-linear-gradient(112deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 18px), radial-gradient(circle at 72% 34%, rgba(255,255,255,0.07), transparent 22%)',
        }}
      />

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
