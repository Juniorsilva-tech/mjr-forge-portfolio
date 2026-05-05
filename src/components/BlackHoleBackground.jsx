import { useEffect, useRef } from 'react'

export default function BlackHoleBackground() {
  const canvasRef = useRef(null)
  const mouse = useRef({ x: 0, y: 0, active: false })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let frame = 0
    let raf = 0

    const stars = Array.from({ length: 260 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.4 + Math.random() * 1.25,
      a: 0.18 + Math.random() * 0.72,
      tw: Math.random() * Math.PI * 2,
      hue: i % 4 === 0 ? 190 : i % 4 === 1 ? 42 : i % 4 === 2 ? 282 : 215,
    }))

    const clouds = Array.from({ length: 10 }, (_, i) => ({
      x: Math.random(),
      y: Math.random() * 0.72,
      size: 260 + Math.random() * 520,
      hue: i % 3 === 0 ? 205 : i % 3 === 1 ? 282 : 24,
      alpha: 0.018 + Math.random() * 0.04,
      speed: 0.00012 + Math.random() * 0.00024,
    }))

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function center() {
      const mx = mouse.current.active ? (mouse.current.x - width / 2) / width : 0
      const my = mouse.current.active ? (mouse.current.y - height / 2) / height : 0
      return {
        cx: width * (width < 900 ? 0.52 : 0.68) + mx * 34,
        cy: height * (width < 900 ? 0.36 : 0.40) + my * 24,
      }
    }

    function drawSpace() {
      const { cx, cy } = center()
      const base = ctx.createLinearGradient(0, 0, width, height)
      base.addColorStop(0, '#02030b')
      base.addColorStop(0.22, '#071327')
      base.addColorStop(0.46, '#080914')
      base.addColorStop(0.7, '#120816')
      base.addColorStop(1, '#010103')
      ctx.fillStyle = base
      ctx.fillRect(0, 0, width, height)

      for (const cloud of clouds) {
        cloud.x += cloud.speed
        if (cloud.x > 1.14) cloud.x = -0.14
        const x = cloud.x * width
        const y = cloud.y * height
        const g = ctx.createRadialGradient(x, y, 0, x, y, cloud.size)
        g.addColorStop(0, `hsla(${cloud.hue}, 90%, 68%, ${cloud.alpha})`)
        g.addColorStop(0.48, `hsla(${cloud.hue}, 88%, 60%, ${cloud.alpha * 0.35})`)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.fillRect(x - cloud.size, y - cloud.size, cloud.size * 2, cloud.size * 2)
      }

      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height) * 0.78)
      halo.addColorStop(0, 'rgba(255,244,210,.12)')
      halo.addColorStop(0.18, 'rgba(255,150,64,.075)')
      halo.addColorStop(0.34, 'rgba(70,190,255,.055)')
      halo.addColorStop(0.62, 'rgba(135,80,255,.035)')
      halo.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = halo
      ctx.fillRect(0, 0, width, height)
    }

    function distortPoint(x, y, cx, cy, strength) {
      const dx = x - cx
      const dy = y - cy
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.001
      const lens = Math.min(1, strength / (dist * dist))
      const bend = lens * 110
      const angle = Math.atan2(dy, dx) + lens * 1.7
      return { x: x + Math.cos(angle) * bend, y: y + Math.sin(angle) * bend * 0.75, lens, dist }
    }

    function drawStars() {
      const { cx, cy } = center()
      const eventRadius = Math.min(width, height) * 0.105
      for (const s of stars) {
        const rawX = s.x * width
        const rawY = s.y * height
        const p = distortPoint(rawX, rawY, cx, cy, 2800)
        if (p.dist < eventRadius * 0.92) continue
        const twinkle = 0.55 + Math.sin(frame * 0.025 + s.tw) * 0.32
        const alpha = Math.max(0, Math.min(0.82, s.a * twinkle * (1 - p.lens * 0.45)))
        ctx.beginPath()
        ctx.arc(p.x, p.y, s.r * (1 + p.lens * 1.4), 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${s.hue}, 90%, 82%, ${alpha})`
        ctx.shadowColor = `hsla(${s.hue}, 90%, 75%, .55)`
        ctx.shadowBlur = 4 + p.lens * 12
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }

    function drawDisk() {
      const { cx, cy } = center()
      const eventRadius = Math.min(width, height) * 0.105
      const time = frame * 0.009
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(-0.12)
      for (let layer = 0; layer < 42; layer++) {
        const t = layer / 42
        const rx = eventRadius * (1.7 + t * 5.3)
        const ry = eventRadius * (0.34 + t * 0.96)
        const alpha = (1 - t) * 0.16
        const hue = layer % 3 === 0 ? 32 : layer % 3 === 1 ? 190 : 280
        ctx.beginPath()
        ctx.ellipse(0, 0, rx, ry, Math.sin(time + layer * 0.23) * 0.08, Math.PI * 0.03, Math.PI * 1.97)
        ctx.strokeStyle = `hsla(${hue}, 96%, ${64 + (1 - t) * 20}%, ${alpha})`
        ctx.lineWidth = Math.max(1, 2.2 - t * 1.4)
        ctx.shadowColor = hue === 32 ? 'rgba(255,155,68,.42)' : 'rgba(92,225,255,.32)'
        ctx.shadowBlur = 12 * (1 - t)
        ctx.stroke()
      }
      for (let arc = 0; arc < 18; arc++) {
        const t = arc / 18
        const rx = eventRadius * (2.1 + t * 4.6)
        const ry = eventRadius * (0.44 + t * 0.78)
        const start = (time * 0.35 + arc * 0.7) % (Math.PI * 2)
        const end = start + Math.PI * (0.18 + t * 0.12)
        ctx.beginPath()
        ctx.ellipse(0, 0, rx, ry, Math.sin(time + arc) * 0.08, start, end)
        ctx.strokeStyle = arc % 2 ? 'rgba(255,180,86,.34)' : 'rgba(120,235,255,.24)'
        ctx.lineWidth = 2.4 - t
        ctx.shadowColor = arc % 2 ? 'rgba(255,150,64,.55)' : 'rgba(100,230,255,.45)'
        ctx.shadowBlur = 18
        ctx.stroke()
      }
      ctx.shadowBlur = 0
      ctx.restore()
    }

    function drawHole() {
      const { cx, cy } = center()
      const eventRadius = Math.min(width, height) * 0.105
      const lens = ctx.createRadialGradient(cx, cy, eventRadius * 0.55, cx, cy, eventRadius * 2.7)
      lens.addColorStop(0, 'rgba(0,0,0,1)')
      lens.addColorStop(0.35, 'rgba(0,0,0,.98)')
      lens.addColorStop(0.48, 'rgba(255,220,150,.12)')
      lens.addColorStop(0.58, 'rgba(105,225,255,.10)')
      lens.addColorStop(0.74, 'rgba(255,110,205,.06)')
      lens.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = lens
      ctx.beginPath()
      ctx.arc(cx, cy, eventRadius * 2.75, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(cx, cy, eventRadius, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0,0,0,1)'
      ctx.shadowColor = 'rgba(0,0,0,1)'
      ctx.shadowBlur = 32
      ctx.fill()
      ctx.shadowBlur = 0
    }

    function vignette() {
      const v = ctx.createRadialGradient(width * 0.52, height * 0.46, 0, width * 0.52, height * 0.46, Math.max(width, height) * 0.78)
      v.addColorStop(0, 'rgba(0,0,0,0)')
      v.addColorStop(0.58, 'rgba(0,0,0,.26)')
      v.addColorStop(1, 'rgba(0,0,0,.95)')
      ctx.fillStyle = v
      ctx.fillRect(0, 0, width, height)
    }

    function render() {
      frame++
      ctx.clearRect(0, 0, width, height)
      drawSpace()
      drawStars()
      drawDisk()
      drawHole()
      vignette()
      raf = requestAnimationFrame(render)
    }

    const onMove = e => { mouse.current = { x: e.clientX, y: e.clientY, active: true } }
    const onLeave = () => { mouse.current.active = false }
    resize()
    render()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#010103]">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_40%,transparent,rgba(0,0,0,.18)_24%,rgba(0,0,0,.72)_78%,rgba(0,0,0,.95)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,1,4,.96)_0%,rgba(1,1,4,.82)_25%,rgba(1,1,4,.30)_58%,rgba(1,1,4,.78)_100%)]" />
    </div>
  )
}
