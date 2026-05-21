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
    const maxParticles = quality === 'high' ? 92 : quality === 'medium' ? 58 : 26
    const spawnRate = quality === 'high' ? 0.052 : quality === 'medium' ? 0.032 : 0.018

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, quality === 'high' ? 2 : quality === 'medium' ? 1.6 : 1.15)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const spawnParticle = (time, burst = false) => {
      if (particles.length >= maxParticles) return

      const mobile = width < 768
      const forgeX = width * (mobile ? 0.78 : 0.72) + (Math.random() - 0.5) * width * (mobile ? 0.34 : 0.24)
      const forgeY = height * (mobile ? 0.31 : 0.36) + (Math.random() - 0.5) * height * (mobile ? 0.42 : 0.34)
      const force = (burst ? 1.35 : 0.78) + Math.random() * 0.85

      particles.push({
        x: forgeX,
        y: forgeY,
        vx: (-0.28 - Math.random() * 0.72) * force,
        vy: (-0.24 - Math.random() * 0.88) * force,
        drift: Math.random() * Math.PI * 2,
        size: 1.15 + Math.random() * (mobile ? 2.8 : 2.4),
        age: 0,
        life: 2400 + Math.random() * 2600,
        heat: 0.74 + Math.random() * 0.48,
        born: time,
      })
    }

    const drawBackgroundMatter = (time) => {
      context.globalCompositeOperation = 'source-over'
      context.clearRect(0, 0, width, height)

      const mobile = width < 768
      const coreX = width * (mobile ? 0.82 : 0.73)
      const coreY = height * (mobile ? 0.29 : 0.38)
      const pulse = (Math.sin(time * 0.00135) + 1) / 2
      const slowPulse = (Math.sin(time * 0.00062 + 1.4) + 1) / 2

      const obsidianGlow = context.createRadialGradient(
        coreX,
        coreY,
        0,
        coreX,
        coreY,
        Math.max(width, height) * 0.96,
      )
      obsidianGlow.addColorStop(0, `rgba(16, 48, 91, ${0.36 + pulse * 0.06})`)
      obsidianGlow.addColorStop(0.2, 'rgba(9, 20, 53, 0.28)')
      obsidianGlow.addColorStop(0.48, 'rgba(22, 10, 38, 0.2)')
      obsidianGlow.addColorStop(1, 'rgba(1, 1, 4, 0)')
      context.fillStyle = obsidianGlow
      context.fillRect(0, 0, width, height)

      const warmSideLight = context.createRadialGradient(
        width * (mobile ? 1.02 : 0.92),
        height * (mobile ? 0.18 : 0.22),
        0,
        width * (mobile ? 1.02 : 0.92),
        height * (mobile ? 0.18 : 0.22),
        Math.max(width, height) * 0.86,
      )
      warmSideLight.addColorStop(0, `rgba(234, 144, 55, ${0.3 + slowPulse * 0.08})`)
      warmSideLight.addColorStop(0.23, 'rgba(171, 76, 34, 0.16)')
      warmSideLight.addColorStop(0.58, 'rgba(48, 22, 21, 0.06)')
      warmSideLight.addColorStop(1, 'rgba(0, 0, 0, 0)')
      context.fillStyle = warmSideLight
      context.fillRect(0, 0, width, height)

      const fissure = context.createLinearGradient(coreX - width * 0.26, coreY - height * 0.08, coreX + width * 0.14, coreY + height * 0.12)
      fissure.addColorStop(0, 'rgba(0,0,0,0)')
      fissure.addColorStop(0.42, `rgba(239, 147, 57, ${0.08 + pulse * 0.08})`)
      fissure.addColorStop(0.52, `rgba(106, 153, 214, ${0.08 + pulse * 0.06})`)
      fissure.addColorStop(1, 'rgba(0,0,0,0)')
      context.fillStyle = fissure
      context.save()
      context.translate(coreX, coreY)
      context.rotate(-0.38)
      context.fillRect(-width * 0.34, -1, width * 0.52, 2.2)
      context.restore()

      context.globalCompositeOperation = 'lighter'
      for (let index = 0; index < 5; index += 1) {
        const radius = (mobile ? 54 : 78) + index * (mobile ? 42 : 62) + pulse * (mobile ? 12 : 18)
        context.beginPath()
        context.ellipse(coreX, coreY, radius * 1.34, radius * 0.68, -0.36, 0, Math.PI * 2)
        context.strokeStyle = `rgba(${index % 2 ? '88, 132, 190' : '232, 142, 55'}, ${0.075 - index * 0.009})`
        context.lineWidth = 1 + index * 0.2
        context.shadowColor = index % 2 ? 'rgba(38, 91, 166, 0.34)' : 'rgba(232, 142, 55, 0.32)'
        context.shadowBlur = 24
        context.stroke()
      }
      context.shadowBlur = 0
    }

    const drawDust = (time) => {
      context.globalCompositeOperation = 'screen'
      const count = quality === 'high' ? 70 : quality === 'medium' ? 42 : 22

      for (let index = 0; index < count; index += 1) {
        const seed = index * 97.13
        const x = (Math.sin(seed) * 0.5 + 0.5) * width
        const y = ((Math.cos(seed * 1.21) * 0.5 + 0.5) * height + time * 0.008 * (index % 5)) % height
        const opacity = 0.028 + ((index % 7) / 7) * 0.034

        context.fillStyle = `rgba(184, 178, 169, ${opacity})`
        context.fillRect(x, y, 0.9, 0.9)
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

        const turbulence = Math.sin(time * 0.002 + particle.drift) * 0.34
        particle.x += particle.vx + turbulence
        particle.y += particle.vy - progress * 0.44
        particle.vx *= 0.996
        particle.vy *= 0.992

        const hot = [245, 151, 57]
        const cooling = [62, 72, 112]
        const ash = [146, 143, 134]
        const firstFade = Math.min(progress / 0.54, 1)
        const secondFade = Math.max((progress - 0.54) / 0.46, 0)
        const color = secondFade > 0 ? mixColor(cooling, ash, secondFade) : mixColor(hot, cooling, firstFade)
        const opacity = Math.pow(1 - progress, 1.18) * particle.heat * 0.9
        const size = particle.size * (1 + progress * 1.75)

        context.shadowColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`
        context.shadowBlur = progress < 0.46 ? 18 : 4
        context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`

        if (progress < 0.7) {
          context.beginPath()
          context.arc(particle.x, particle.y, size, 0, Math.PI * 2)
          context.fill()
        } else {
          const fragments = 3
          for (let fragment = 0; fragment < fragments; fragment += 1) {
            const angle = particle.drift + fragment * 2.1
            const offset = (progress - 0.7) * 34
            context.fillRect(
              particle.x + Math.cos(angle) * offset,
              particle.y + Math.sin(angle) * offset,
              Math.max(0.8, size * 0.48),
              Math.max(0.8, size * 0.48),
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

    for (let index = 0; index < Math.min(maxParticles, quality === 'low' ? 10 : 18); index += 1) {
      spawnParticle(lastTime, true)
    }

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
        opacity: quality === 'low' ? 0.82 : quality === 'medium' ? 0.9 : 1,
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
  const forgeMotionEnabled = !prefersReducedMotion

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
      x.set(window.innerWidth * 0.78)
      y.set(window.innerHeight * 0.22)
    }

    seed()

    if (!isInteractive) return undefined

    let frame = 0
    let nextX = window.innerWidth * 0.78
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
        className="absolute inset-y-[-12vh] right-[-16vw] w-[72vw] blur-[72px]"
        style={{
          background:
            'radial-gradient(circle at 34% 22%, rgba(237,145,54,0.36), transparent 28%), radial-gradient(circle at 48% 46%, rgba(34,91,165,0.28), transparent 38%), radial-gradient(circle at 58% 72%, rgba(44,18,70,0.38), transparent 48%)',
        }}
        animate={
          forgeMotionEnabled
            ? { opacity: [0.62, 0.96, 0.62], scale: [1, 1.04, 1], x: [0, -10, 0] }
            : { opacity: 0.5, scale: 1, x: 0 }
        }
        transition={forgeMotionEnabled ? { duration: 6.8, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
      />

      <div
        className="absolute inset-0 opacity-[0.22] mix-blend-soft-light"
        style={{
          backgroundImage:
            'repeating-linear-gradient(112deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 18px), radial-gradient(circle at 76% 30%, rgba(255,255,255,0.09), transparent 22%)',
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
