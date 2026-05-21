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
    let emberAccumulator = 0
    const embers = []
    const maxEmbers = quality === 'high' ? 180 : quality === 'medium' ? 112 : 58
    const spawnRate = quality === 'high' ? 0.098 : quality === 'medium' ? 0.064 : 0.036

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, quality === 'high' ? 1.9 : quality === 'medium' ? 1.45 : 1.08)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const spawnEmber = (time, burst = false) => {
      if (embers.length >= maxEmbers) return

      const mobile = width < 768
      const source = Math.random()
      const xBase = source < 0.58 ? width * 0.74 : source < 0.84 ? width * 0.58 : width * 0.88
      const yBase = source < 0.58 ? height * 0.28 : source < 0.84 ? height * 0.42 : height * 0.18
      const speed = (burst ? 1.2 : 0.72) + Math.random() * 0.72
      const kindRoll = Math.random()

      embers.push({
        x: xBase + (Math.random() - 0.5) * width * (mobile ? 0.28 : 0.2),
        y: yBase + (Math.random() - 0.5) * height * (mobile ? 0.24 : 0.18),
        vx: (-0.18 + (Math.random() - 0.5) * 0.34) * speed,
        vy: (-0.42 - Math.random() * 1.12) * speed,
        sway: Math.random() * Math.PI * 2,
        size: kindRoll < 0.14 ? 2.2 + Math.random() * 2.6 : 0.65 + Math.random() * 1.55,
        life: 1550 + Math.random() * 2800,
        age: 0,
        kind: kindRoll < 0.14 ? 'spark' : kindRoll < 0.9 ? 'ember' : 'ash',
        flicker: 0.72 + Math.random() * 0.74,
        born: time,
      })
    }

    const drawBackgroundMatter = time => {
      context.globalCompositeOperation = 'source-over'
      context.clearRect(0, 0, width, height)

      const pulse = (Math.sin(time * 0.0009) + 1) / 2
      const slow = (Math.sin(time * 0.00042 + 1.8) + 1) / 2
      const mobile = width < 768

      const base = context.createLinearGradient(0, 0, width, height)
      base.addColorStop(0, 'rgba(1,1,5,0.88)')
      base.addColorStop(0.42, 'rgba(5,3,11,0.78)')
      base.addColorStop(0.72, 'rgba(10,4,9,0.7)')
      base.addColorStop(1, 'rgba(1,1,4,0.86)')
      context.fillStyle = base
      context.fillRect(0, 0, width, height)

      const redFog = context.createRadialGradient(
        width * (mobile ? 0.76 : 0.8),
        height * 0.24,
        0,
        width * (mobile ? 0.76 : 0.8),
        height * 0.24,
        Math.max(width, height) * 0.78,
      )
      redFog.addColorStop(0, `rgba(168,28,10,${0.18 + pulse * 0.06})`)
      redFog.addColorStop(0.22, `rgba(119,16,8,${0.14 + slow * 0.05})`)
      redFog.addColorStop(0.58, 'rgba(58,8,10,0.06)')
      redFog.addColorStop(1, 'rgba(0,0,0,0)')
      context.fillStyle = redFog
      context.fillRect(0, 0, width, height)

      const warmCore = context.createRadialGradient(
        width * (mobile ? 0.84 : 0.78),
        height * 0.18,
        0,
        width * (mobile ? 0.84 : 0.78),
        height * 0.18,
        Math.max(width, height) * 0.52,
      )
      warmCore.addColorStop(0, `rgba(255,122,35,${0.2 + pulse * 0.09})`)
      warmCore.addColorStop(0.2, `rgba(239,76,18,${0.16 + slow * 0.05})`)
      warmCore.addColorStop(0.56, 'rgba(82,14,9,0.05)')
      warmCore.addColorStop(1, 'rgba(0,0,0,0)')
      context.fillStyle = warmCore
      context.fillRect(0, 0, width, height)

      const obsidianBlue = context.createRadialGradient(width * 0.38, height * 0.86, 0, width * 0.38, height * 0.86, Math.max(width, height) * 0.62)
      obsidianBlue.addColorStop(0, 'rgba(18,44,92,0.12)')
      obsidianBlue.addColorStop(0.28, 'rgba(18,26,62,0.08)')
      obsidianBlue.addColorStop(1, 'rgba(0,0,0,0)')
      context.fillStyle = obsidianBlue
      context.fillRect(0, 0, width, height)
    }

    const drawSmoke = time => {
      context.globalCompositeOperation = 'screen'
      const plumes = width < 768 ? 3 : 4

      for (let index = 0; index < plumes; index += 1) {
        const shift = (Math.sin(time * 0.00028 + index * 1.6) + 1) / 2
        const x = width * (0.52 + index * 0.12) - shift * 42
        const y = height * (0.18 + index * 0.1) - shift * 26
        const radius = Math.min(width, height) * (0.18 + index * 0.028)
        const haze = context.createRadialGradient(x, y, 0, x, y, radius)
        haze.addColorStop(0, `rgba(255,92,28,${0.034 - index * 0.005})`)
        haze.addColorStop(0.35, `rgba(106,18,16,${0.028 - index * 0.004})`)
        haze.addColorStop(1, 'rgba(0,0,0,0)')
        context.fillStyle = haze
        context.fillRect(x - radius, y - radius, radius * 2, radius * 2)
      }
    }

    const drawEmbers = (delta, time) => {
      if (enabled) {
        emberAccumulator += delta * spawnRate
        while (emberAccumulator >= 1) {
          spawnEmber(time)
          emberAccumulator -= 1
        }
      }

      context.globalCompositeOperation = 'lighter'

      for (let index = embers.length - 1; index >= 0; index -= 1) {
        const ember = embers[index]
        ember.age += delta
        const progress = Math.min(ember.age / ember.life, 1)

        if (progress >= 1) {
          embers.splice(index, 1)
          continue
        }

        const sway = Math.sin(time * 0.0024 + ember.sway) * 0.26
        ember.x += ember.vx + sway
        ember.y += ember.vy
        ember.vx *= 0.998
        ember.vy *= 0.994

        const hot = [255, 150, 62]
        const deep = [214, 54, 22]
        const ash = [120, 92, 84]
        const firstFade = Math.min(progress / 0.44, 1)
        const secondFade = Math.max((progress - 0.44) / 0.56, 0)
        const midColor = mixColor(hot, deep, firstFade)
        const color = secondFade > 0 ? mixColor(midColor, ash, secondFade) : midColor
        const flicker = 0.72 + Math.sin(time * 0.008 * ember.flicker + ember.sway) * 0.18
        const opacity = Math.pow(1 - progress, ember.kind === 'ash' ? 1.6 : 1.18) * flicker

        context.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${opacity})`
        context.shadowColor = `rgba(${color[0]},${color[1]},${color[2]},${opacity * 0.9})`
        context.shadowBlur = ember.kind === 'ash' ? 2 : ember.kind === 'spark' ? 16 : 10

        if (ember.kind === 'spark') {
          context.save()
          context.translate(ember.x, ember.y)
          context.rotate(-0.24)
          context.fillRect(-ember.size * 2.1, -0.6, ember.size * 4.2, 1.2)
          context.restore()
        } else if (ember.kind === 'ash') {
          const offset = progress * 8
          for (let shard = 0; shard < 2; shard += 1) {
            const angle = ember.sway + shard * Math.PI
            context.fillRect(
              ember.x + Math.cos(angle) * offset,
              ember.y + Math.sin(angle) * offset,
              Math.max(0.7, ember.size * 0.42),
              Math.max(0.7, ember.size * 0.42),
            )
          }
        } else {
          context.beginPath()
          context.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2)
          context.fill()
        }
      }

      context.shadowBlur = 0
    }

    const draw = time => {
      const delta = Math.min(time - lastTime, 34)
      lastTime = time

      drawBackgroundMatter(time)
      drawSmoke(time)
      drawEmbers(delta, time)

      if (enabled) {
        animationFrame = window.requestAnimationFrame(draw)
      }
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })

    for (let index = 0; index < Math.min(maxEmbers, quality === 'low' ? 18 : 28); index += 1) {
      spawnEmber(lastTime, true)
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
        opacity: quality === 'low' ? 0.92 : 1,
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
        className="absolute inset-y-[-16vh] right-[-10vw] w-[82vw] blur-[74px]"
        style={{
          background:
            'radial-gradient(circle at 34% 20%, rgba(255,118,34,0.28), transparent 24%), radial-gradient(circle at 54% 38%, rgba(159,26,10,0.22), transparent 34%), radial-gradient(circle at 42% 80%, rgba(20,36,92,0.16), transparent 42%)',
        }}
        animate={
          forgeMotionEnabled
            ? { opacity: [0.46, 0.72, 0.46], scale: [1, 1.03, 1], x: [0, -6, 0] }
            : { opacity: 0.42, scale: 1, x: 0 }
        }
        transition={forgeMotionEnabled ? { duration: 6.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
      />

      <div
        className="absolute inset-0 opacity-[0.16] mix-blend-soft-light"
        style={{
          backgroundImage:
            'repeating-linear-gradient(112deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 18px), radial-gradient(circle at 76% 22%, rgba(255,146,69,0.12), transparent 20%)',
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
