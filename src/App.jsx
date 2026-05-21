import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import BrandMark from './components/BrandMark.jsx'

const BRAND = {
  name: 'MJR Forge',
  signature: 'Mauricio Junior',
  whatsapp: 'https://wa.me/5524992625175',
  github: 'https://github.com/Juniorsilva-tech',
}

const NAV = [
  ['Manifesto', '#manifesto'],
  ['Jornada', '#journey'],
  ['Projetos', '#work'],
  ['Processo', '#process'],
  ['Contato', '#contact'],
]

const PROJECTS = [
  {
    title: 'RetailFlow',
    eyebrow: 'dashboard operacional',
    text: 'Painel SaaS para pequenos negócios, com leitura de clientes, pedidos, pagamentos e métricas em uma interface premium.',
    tags: ['React', 'Dashboard', 'Produto'],
    href: 'https://retailflow-dashboard.vercel.app',
  },
  {
    title: 'Princessmel',
    eyebrow: 'presença editorial',
    text: 'Landing page para marca real com vitrine, narrativa visual, respiração e conversão direta por WhatsApp.',
    tags: ['Landing Page', 'UI Editorial', 'Marca'],
  },
  {
    title: 'Jarvis',
    eyebrow: 'sistema interno',
    text: 'Workflow autoral de automação, QA visual e aceleração de criação de interfaces com IA aplicada.',
    tags: ['Automação', 'IA', 'QA Visual'],
  },
]

const PROCESS = [
  ['01', 'Matéria bruta', 'Entendo o problema, contexto, público e objetivo real antes da primeira tela.'],
  ['02', 'Molde visual', 'Defino direção, hierarquia, ritmo e linguagem para a interface não nascer genérica.'],
  ['03', 'Construção', 'Transformo a ideia em componentes, layout responsivo e experiência navegável.'],
  ['04', 'Refino', 'Ajusto contraste, espaçamento, microinterações, legibilidade, performance e mobile.'],
  ['05', 'Entrega', 'Deploy limpo, apresentação clara e próximos passos para evoluir o produto.'],
]

const QUALITY = {
  auto: { label: 'Auto', ember: 0.066, ash: 70, dpr: 1.35, max: 130, lenis: 1.06, glow: 1 },
  low: { label: 'Low', ember: 0.036, ash: 38, dpr: 1.08, max: 74, lenis: 0.92, glow: 0.72 },
  medium: { label: 'Med', ember: 0.062, ash: 62, dpr: 1.3, max: 126, lenis: 1.06, glow: 0.95 },
  high: { label: 'High', ember: 0.112, ash: 110, dpr: 1.75, max: 230, lenis: 1.18, glow: 1.35 },
}

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

function useReducedMotionPreference() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(media.matches)
    sync()
    media.addEventListener('change', sync)

    return () => media.removeEventListener('change', sync)
  }, [])

  return reduced
}

function useLenis(reducedMotion, quality) {
  useEffect(() => {
    if (typeof window === 'undefined' || reducedMotion) {
      ScrollTrigger.update()
      return undefined
    }

    gsap.registerPlugin(ScrollTrigger)

    const existing = window.__mjrLenis
    if (existing) {
      existing.destroy()
      window.__mjrLenis = null
    }

    const lenis = new Lenis({
      duration: QUALITY[quality]?.lenis ?? 1.12,
      easing: t => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.86,
    })

    window.__mjrLenis = lenis

    const updateScrollTrigger = () => ScrollTrigger.update()
    lenis.on('scroll', updateScrollTrigger)

    const raf = time => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    ScrollTrigger.refresh()

    return () => {
      lenis.off('scroll', updateScrollTrigger)
      gsap.ticker.remove(raf)
      lenis.destroy()
      if (window.__mjrLenis === lenis) window.__mjrLenis = null
      ScrollTrigger.update()
    }
  }, [reducedMotion, quality])
}

function ForgeCanvas({ reducedMotion, quality }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return undefined

    const settings = QUALITY[quality] ?? QUALITY.high
    let width = 0
    let height = 0
    let dpr = 1
    let raf = 0
    let last = performance.now()
    let accumulator = 0
    const embers = []
    const ash = []

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? Math.min(settings.dpr, 1.28) : settings.dpr)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const spawn = time => {
      if (embers.length > settings.max) return
      const mobile = width < 768
      const sourceRoll = Math.random()
      const fromHero = sourceRoll < 0.48
      const fromLower = sourceRoll > 0.76
      const baseX = fromHero
        ? width * (mobile ? 0.36 + Math.random() * 0.58 : 0.56 + Math.random() * 0.36)
        : fromLower
          ? width * Math.random()
          : width * (0.08 + Math.random() * 0.84)
      const baseY = fromHero
        ? height * (mobile ? 0.12 + Math.random() * 0.62 : 0.14 + Math.random() * 0.42)
        : fromLower
          ? height * (0.72 + Math.random() * 0.22)
          : height * (0.34 + Math.random() * 0.5)
      const spark = Math.random() < (quality === 'high' ? 0.22 : 0.14)

      embers.push({
        x: baseX,
        y: baseY,
        vx: (-0.18 + Math.random() * 0.36) * (spark ? 1.85 : 1),
        vy: (-0.24 - Math.random() * 0.96) * (spark ? 1.4 : 1),
        size: spark ? 1.7 + Math.random() * 2.9 : 0.6 + Math.random() * 1.85,
        life: 1900 + Math.random() * 3400,
        age: 0,
        sway: Math.random() * Math.PI * 2,
        spark,
      })
    }

    const spawnAsh = () => {
      ash.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: -0.06 + Math.random() * 0.12,
        vy: -0.035 + Math.random() * 0.1,
        size: 0.65 + Math.random() * 1.45,
        alpha: 0.045 + Math.random() * 0.09,
        drift: Math.random() * Math.PI * 2,
      })
    }

    const drawThermalField = time => {
      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, width, height)

      const pulse = (Math.sin(time * 0.00072) + 1) / 2
      const ignition = (Math.sin(time * 0.00046 + 1.8) + 1) / 2
      const glow = settings.glow
      const mobile = width < 768

      const base = ctx.createLinearGradient(0, 0, width, height)
      base.addColorStop(0, 'rgba(0,0,4,0.88)')
      base.addColorStop(0.38, 'rgba(4,3,10,0.76)')
      base.addColorStop(0.7, 'rgba(8,3,6,0.72)')
      base.addColorStop(1, 'rgba(1,1,4,0.88)')
      ctx.fillStyle = base
      ctx.fillRect(0, 0, width, height)

      const hearth = ctx.createRadialGradient(width * (mobile ? 0.62 : 0.72), height * 0.32, 0, width * (mobile ? 0.62 : 0.72), height * 0.32, Math.max(width, height) * 0.92)
      hearth.addColorStop(0, `rgba(236,92,24,${(0.17 + pulse * 0.14) * glow})`)
      hearth.addColorStop(0.2, `rgba(150,30,12,${(0.14 + ignition * 0.08) * glow})`)
      hearth.addColorStop(0.54, `rgba(52,9,9,${0.08 * glow})`)
      hearth.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = hearth
      ctx.fillRect(0, 0, width, height)

      const blueBase = ctx.createRadialGradient(width * 0.46, height * 0.76, 0, width * 0.46, height * 0.76, Math.max(width, height) * 0.7)
      blueBase.addColorStop(0, `rgba(18,48,108,${(0.1 + ignition * 0.08) * glow})`)
      blueBase.addColorStop(0.4, `rgba(15,22,56,${0.07 * glow})`)
      blueBase.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = blueBase
      ctx.fillRect(0, 0, width, height)

      const fissure = ctx.createLinearGradient(width * 0.02, height * 0.72, width * 0.95, height * 0.42)
      fissure.addColorStop(0, 'rgba(0,0,0,0)')
      fissure.addColorStop(0.38, `rgba(235,111,35,${(0.06 + pulse * 0.07) * glow})`)
      fissure.addColorStop(0.54, `rgba(48,112,210,${(0.03 + ignition * 0.04) * glow})`)
      fissure.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = fissure
      ctx.fillRect(0, 0, width, height)
    }

    const drawAsh = time => {
      ctx.globalCompositeOperation = 'screen'
      for (const flake of ash) {
        flake.x += flake.vx + Math.sin(time * 0.0007 + flake.drift) * 0.08
        flake.y += flake.vy
        if (flake.y < -8) flake.y = height + 8
        if (flake.y > height + 8) flake.y = -8
        if (flake.x < -8) flake.x = width + 8
        if (flake.x > width + 8) flake.x = -8
        ctx.fillStyle = `rgba(164,143,128,${flake.alpha})`
        ctx.fillRect(flake.x, flake.y, flake.size, flake.size)
      }
    }

    const drawEmbers = (delta, time) => {
      if (!reducedMotion) {
        accumulator += delta * settings.ember
        while (accumulator >= 1) {
          spawn(time)
          accumulator -= 1
        }
      }

      ctx.globalCompositeOperation = 'lighter'

      for (let i = embers.length - 1; i >= 0; i -= 1) {
        const ember = embers[i]
        ember.age += delta
        const progress = Math.min(ember.age / ember.life, 1)
        if (progress >= 1) {
          embers.splice(i, 1)
          continue
        }

        ember.x += ember.vx + Math.sin(time * 0.002 + ember.sway) * 0.24
        ember.y += ember.vy
        ember.vx *= 0.997
        ember.vy *= 0.995

        const blue = [49, 105, 202]
        const hot = [255, 150, 60]
        const red = [192, 44, 18]
        const dead = [118, 94, 84]
        const heat = progress < 0.16
          ? mixColor(blue, hot, progress / 0.16)
          : progress < 0.55
            ? mixColor(hot, red, (progress - 0.16) / 0.39)
            : mixColor(red, dead, (progress - 0.55) / 0.45)
        const flicker = 0.78 + Math.sin(time * 0.009 + ember.sway) * 0.18
        const alpha = Math.pow(1 - progress, 1.12) * flicker * settings.glow

        ctx.shadowColor = `rgba(${heat[0]},${heat[1]},${heat[2]},${alpha})`
        ctx.shadowBlur = ember.spark ? 18 : 10
        ctx.fillStyle = `rgba(${heat[0]},${heat[1]},${heat[2]},${alpha})`

        if (ember.spark) {
          ctx.save()
          ctx.translate(ember.x, ember.y)
          ctx.rotate(-0.22)
          ctx.fillRect(-ember.size * 2.8, -0.5, ember.size * 5.6, 1)
          ctx.restore()
        } else if (progress > 0.76) {
          const offset = (progress - 0.76) * 30
          for (let shard = 0; shard < 2; shard += 1) {
            const angle = ember.sway + shard * Math.PI
            ctx.fillRect(ember.x + Math.cos(angle) * offset, ember.y + Math.sin(angle) * offset, Math.max(0.7, ember.size * 0.42), Math.max(0.7, ember.size * 0.42))
          }
        } else {
          ctx.beginPath()
          ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.shadowBlur = 0
    }

    const draw = time => {
      const delta = Math.min(time - last, 34)
      last = time
      drawThermalField(time)
      drawAsh(time)
      drawEmbers(delta, time)
      raf = window.requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    for (let i = 0; i < settings.ash; i += 1) spawnAsh()
    for (let i = 0; i < Math.min(settings.max, window.innerWidth < 768 ? 48 : 82); i += 1) spawn(last)
    raf = window.requestAnimationFrame(draw)

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [reducedMotion, quality])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-100 mix-blend-screen" aria-hidden="true" />
}

function Cursor({ reducedMotion }) {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined' || reducedMotion || window.matchMedia('(pointer: coarse)').matches) return undefined

    document.documentElement.dataset.cursorMode = 'custom'
    const dotX = gsap.quickTo(dotRef.current, 'x', { duration: 0.24, ease: 'power3.out' })
    const dotY = gsap.quickTo(dotRef.current, 'y', { duration: 0.24, ease: 'power3.out' })
    const ringX = gsap.quickTo(ringRef.current, 'x', { duration: 0.62, ease: 'power3.out' })
    const ringY = gsap.quickTo(ringRef.current, 'y', { duration: 0.62, ease: 'power3.out' })

    const move = event => {
      dotX(event.clientX)
      dotY(event.clientY)
      ringX(event.clientX)
      ringY(event.clientY)
    }
    const enter = event => {
      if (event.target.closest('a,button,[data-forge-card]')) {
        gsap.to(ringRef.current, { scale: 1.9, opacity: 0.34, duration: 0.45, ease: 'power3.out' })
        gsap.to(dotRef.current, { scale: 0.5, duration: 0.35, ease: 'power3.out' })
      }
    }
    const leave = () => {
      gsap.to(ringRef.current, { scale: 1, opacity: 0.22, duration: 0.45, ease: 'power3.out' })
      gsap.to(dotRef.current, { scale: 1, duration: 0.35, ease: 'power3.out' })
    }

    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseover', enter)
    document.addEventListener('mouseout', leave)

    return () => {
      delete document.documentElement.dataset.cursorMode
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', enter)
      document.removeEventListener('mouseout', leave)
      gsap.killTweensOf([dotRef.current, ringRef.current])
    }
  }, [reducedMotion])

  return (
    <>
      <div ref={ringRef} className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#e8842e]/50 opacity-20 mix-blend-screen md:block" />
      <div ref={dotRef} className="pointer-events-none fixed left-0 top-0 z-[101] hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f0a24a] shadow-[0_0_24px_rgba(232,132,46,.8)] md:block" />
    </>
  )
}

function PerformanceDock({ quality, setQuality }) {
  return (
    <div className="fixed bottom-5 left-1/2 z-[80] w-[calc(100vw-2rem)] max-w-[720px] -translate-x-1/2 rounded-[1.45rem] border border-white/10 bg-[#040405]/88 p-3 shadow-[0_24px_90px_rgba(0,0,0,.6)] backdrop-blur-2xl md:right-6 md:left-auto md:w-[430px] md:translate-x-0">
      <div className="mb-3 flex items-center justify-between gap-4 px-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#a89d92]">Performance</p>
        <p className="rounded-full border border-[#e8842e]/25 bg-[#e8842e]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.26em] text-[#f0a24a]">{QUALITY[quality]?.label}</p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(QUALITY).map(([key, value]) => (
          <button
            key={key}
            type="button"
            onClick={() => setQuality(key)}
            className={`rounded-2xl border px-3 py-3 text-xs font-bold transition duration-300 ${
              quality === key
                ? 'border-[#e8842e]/55 bg-[#e8842e]/16 text-[#f6efe8] shadow-[0_0_34px_rgba(232,132,46,.16)]'
                : 'border-white/10 bg-white/[0.035] text-[#a89d92] hover:border-[#e8842e]/30 hover:text-[#f6efe8]'
            }`}
          >
            {value.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#030305]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1560px] items-center justify-between px-5 py-4 lg:px-8">
        <a href="#top" className="flex items-center gap-3">
          <BrandMark />
          <div>
            <p className="text-sm font-semibold text-[#f6efe8]">{BRAND.name}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.34em] text-[#a89d92]">{BRAND.signature}</p>
          </div>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map(([label, href]) => (
            <a key={href} href={href} className="text-xs font-semibold text-[#a89d92] transition hover:text-[#f6efe8]">{label}</a>
          ))}
        </nav>
        <button onClick={() => setOpen(value => !value)} className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] md:hidden">
          {open ? 'Fechar' : 'Menu'}
        </button>
      </div>
      {open && (
        <div className="mx-5 mb-4 rounded-[1.5rem] border border-white/10 bg-[#050507]/95 p-3 backdrop-blur-2xl md:hidden">
          {NAV.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="mb-2 block rounded-2xl bg-white/[0.04] px-4 py-3 text-sm font-semibold text-[#f6efe8]">{label}</a>
          ))}
        </div>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section id="top" className="relative z-10 flex min-h-screen items-center overflow-hidden px-5 pt-28 lg:px-8">
      <div className="hero-video absolute inset-0 z-[-1] opacity-60">
        <video className="h-full w-full object-cover opacity-40" autoPlay muted loop playsInline poster="/forge-portrait.jpg">
          <source src="/forge-loop.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_64%_42%,rgba(232,132,46,.22),transparent_28%),linear-gradient(90deg,rgba(3,3,5,.92),rgba(3,3,5,.38),rgba(3,3,5,.9))]" />
      </div>
      <div className="mx-auto grid w-full max-w-[1560px] items-end gap-12 lg:grid-cols-[1.08fr_.92fr]">
        <div className="max-w-[980px] pb-24 md:pb-20">
          <p className="hero-kicker mb-8 text-[11px] font-bold uppercase tracking-[0.48em] text-[#e8842e]">Front-end, UI premium e direção de produto</p>
          <h1 className="hero-title text-[16vw] font-semibold leading-[0.86] tracking-[-0.095em] text-[#f6efe8] sm:text-[7rem] lg:text-[9.4rem]">
            Interfaces que transformam ideias em <span className="text-[#e8842e] drop-shadow-[0_0_34px_rgba(232,132,46,.34)]">resultado real.</span>
          </h1>
          <p className="hero-copy mt-8 max-w-2xl text-lg leading-8 text-[#d7ccc1]">Eu crio experiências digitais com presença, ritmo, automação e acabamento de produto — como peças forjadas para vender, guiar e impressionar.</p>
          <div className="hero-actions mt-9 flex flex-col gap-4 sm:flex-row">
            <a href="#work" className="group rounded-full border border-[#e8842e]/45 bg-[#e8842e]/14 px-8 py-4 text-center text-sm font-semibold text-[#f6efe8] shadow-[0_0_60px_rgba(232,132,46,.22)] transition hover:bg-[#e8842e] hover:text-[#080604]">Explorar projetos →</a>
            <a href={BRAND.whatsapp} target="_blank" rel="noreferrer" className="rounded-full border border-white/12 bg-white/[0.04] px-8 py-4 text-center text-sm font-semibold text-[#f6efe8] transition hover:border-[#e8842e]/40">Falar comigo →</a>
          </div>
        </div>
        <div className="forge-core hidden pb-20 lg:block">
          <div className="relative ml-auto aspect-square max-w-[520px] rounded-full border border-[#e8842e]/20 bg-[radial-gradient(circle_at_50%_50%,rgba(232,132,46,.22),transparent_32%),radial-gradient(circle_at_50%_58%,rgba(42,92,190,.15),transparent_46%)] shadow-[0_0_140px_rgba(232,132,46,.16)]">
            <div className="absolute inset-[18%] rounded-full border border-white/10 bg-[#050507]/70 blur-[1px]" />
            <div className="absolute inset-[30%] rounded-full bg-[#e8842e]/20 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-px w-[130%] -translate-x-1/2 -translate-y-1/2 rotate-[-17deg] bg-gradient-to-r from-transparent via-[#e8842e]/70 to-transparent" />
          </div>
        </div>
      </div>
      <div className="scroll-indicator absolute bottom-28 left-1/2 hidden -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.34em] text-[#a89d92] md:block">Role para acender</div>
    </section>
  )
}

function Manifesto() {
  return (
    <section id="manifesto" className="cinema-section relative z-10 mx-auto max-w-[1560px] px-5 py-28 lg:px-8 lg:py-40">
      <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <p className="section-kicker text-xs font-bold uppercase tracking-[0.48em] text-[#e8842e]">Manifesto</p>
        <div>
          <h2 className="split-title text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-[#f6efe8] md:text-7xl">Código é ferramenta. Propósito é o que fica.</h2>
          <p className="mt-8 max-w-3xl text-lg leading-9 text-[#d7ccc1]">A alma da forja não é fogo na tela. É transformação: ideia bruta entrando, método aquecendo, interface ganhando forma e produto saindo pronto para uso real.</p>
        </div>
      </div>
    </section>
  )
}

function Journey() {
  return (
    <section id="journey" className="camera-section relative z-10 overflow-hidden border-y border-white/10 bg-black/20 px-5 py-28 lg:px-8 lg:py-0">
      <div className="camera-stage mx-auto grid max-w-[1560px] gap-12 lg:min-h-screen lg:grid-cols-[.82fr_1.18fr] lg:items-center">
        <div>
          <p className="section-kicker mb-5 text-xs font-bold uppercase tracking-[0.48em] text-[#e8842e]">Jornada</p>
          <h2 className="camera-title text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-[#f6efe8] md:text-7xl">Da faísca ao domínio.</h2>
          <p className="mt-7 max-w-xl text-base leading-8 text-[#d7ccc1]">O movimento aqui é câmera: aproxima, revela camadas, atravessa calor e estabiliza quando a peça toma forma.</p>
        </div>
        <div className="camera-cards grid gap-4">
          {PROCESS.map(([step, title, text]) => (
            <article key={step} className="camera-card rounded-[2rem] border border-white/10 bg-[#080807]/70 p-6 shadow-[0_30px_100px_rgba(0,0,0,.35)] backdrop-blur-xl">
              <p className="mb-5 text-xs font-bold text-[#e8842e]">{step}</p>
              <h3 className="text-2xl font-semibold text-[#f6efe8]">{title}</h3>
              <p className="mt-3 leading-7 text-[#a89d92]">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Work() {
  return (
    <section id="work" className="relative z-10 mx-auto max-w-[1560px] px-5 py-28 lg:px-8 lg:py-40">
      <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="section-kicker mb-5 text-xs font-bold uppercase tracking-[0.48em] text-[#e8842e]">Projetos</p>
          <h2 className="split-title text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-[#f6efe8] md:text-7xl">Peças forjadas para gerar impacto.</h2>
        </div>
        <p className="max-w-xl text-base leading-8 text-[#d7ccc1]">Cada card reage como material aquecido: borda viva, profundidade, microbrasa e foco no resultado.</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {PROJECTS.map(project => (
          <a key={project.title} href={project.href || '#contact'} data-forge-card className="forge-card group relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#080807]/72 p-7 shadow-[0_30px_120px_rgba(0,0,0,.38)] backdrop-blur-xl">
            <div className="absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100" style={{ background: 'radial-gradient(circle at 70% 20%, rgba(232,132,46,.22), transparent 30%), linear-gradient(180deg, transparent, rgba(232,132,46,.08))' }} />
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#e8842e]">{project.eyebrow}</p>
              <h3 className="mt-7 text-4xl font-semibold tracking-[-0.05em] text-[#f6efe8]">{project.title}</h3>
              <p className="mt-6 leading-8 text-[#d7ccc1]">{project.text}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {project.tags.map(tag => <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a89d92]">{tag}</span>)}
              </div>
            </div>
            <span className="absolute bottom-7 left-7 right-7 h-px bg-gradient-to-r from-[#e8842e]/70 via-white/10 to-transparent" />
          </a>
        ))}
      </div>
    </section>
  )
}

function ProcessSection() {
  return (
    <section id="process" className="relative z-10 border-y border-white/10 bg-[#030305]/55 px-5 py-28 lg:px-8 lg:py-36">
      <div className="mx-auto max-w-[1560px]">
        <p className="section-kicker mb-5 text-xs font-bold uppercase tracking-[0.48em] text-[#e8842e]">Processo</p>
        <h2 className="split-title max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-[#f6efe8] md:text-7xl">Um método forjado para resultados sólidos.</h2>
        <div className="process-line mt-14 grid gap-4 md:grid-cols-5">
          {PROCESS.map(([step, title, text]) => (
            <div key={step} className="process-step rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5">
              <p className="text-xs font-bold text-[#e8842e]">{step}</p>
              <h3 className="mt-8 text-xl font-semibold text-[#f6efe8]">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#a89d92]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="relative z-10 mx-auto max-w-[1560px] px-5 py-28 lg:px-8 lg:py-40">
      <div className="contact-core rounded-[2.5rem] border border-[#e8842e]/20 bg-[radial-gradient(circle_at_74%_20%,rgba(232,132,46,.2),transparent_32%),rgba(8,8,8,.78)] p-8 shadow-[0_40px_160px_rgba(0,0,0,.5)] backdrop-blur-xl md:p-14">
        <p className="section-kicker mb-5 text-xs font-bold uppercase tracking-[0.48em] text-[#e8842e]">Contato</p>
        <h2 className="split-title max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-[#f6efe8] md:text-7xl">Traga a ideia bruta. Eu forjo a interface.</h2>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a href={BRAND.whatsapp} target="_blank" rel="noreferrer" className="rounded-full bg-[#e8842e] px-8 py-4 text-center text-sm font-bold text-[#080604] transition hover:bg-[#f6efe8]">Começar conversa →</a>
          <a href={BRAND.github} target="_blank" rel="noreferrer" className="rounded-full border border-white/12 bg-white/[0.04] px-8 py-4 text-center text-sm font-bold text-[#f6efe8]">Ver GitHub →</a>
        </div>
      </div>
    </section>
  )
}

function App() {
  const rootRef = useRef(null)
  const reducedMotion = useReducedMotionPreference()
  const [quality, setQuality] = useState('high')
  const isMobile = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches, [])

  useLenis(reducedMotion, quality)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    document.documentElement.dataset.performanceMode = quality
    return () => {
      delete document.documentElement.dataset.performanceMode
    }
  }, [quality])

  useEffect(() => {
    if (typeof window === 'undefined' || reducedMotion) return undefined

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.set(['.hero-kicker', '.hero-title', '.hero-copy', '.hero-actions'], { opacity: 0, y: 28 })
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .to('.hero-kicker', { opacity: 1, y: 0, duration: 0.9, delay: 0.32 })
        .to('.hero-title', { opacity: 1, y: 0, duration: 1.25 }, '-=0.42')
        .to('.hero-copy', { opacity: 1, y: 0, duration: 0.9 }, '-=0.48')
        .to('.hero-actions', { opacity: 1, y: 0, duration: 0.82 }, '-=0.42')

      gsap.to('.scroll-indicator', {
        opacity: 0,
        y: -12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#manifesto', start: 'top 88%', end: 'top 72%', scrub: 0.8 },
      })

      gsap.utils.toArray('.section-kicker').forEach(el => {
        gsap.fromTo(el, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%' } })
      })

      gsap.utils.toArray('.split-title').forEach(el => {
        gsap.fromTo(el, { opacity: 0, y: 34, scale: 0.985 }, { opacity: 1, y: 0, scale: 1, duration: 1.05, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 84%' } })
      })

      gsap.utils.toArray('[data-forge-card]').forEach(card => {
        gsap.fromTo(card, { opacity: 0, y: 48, scale: 0.965 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 86%' } })
      })

      gsap.fromTo('.process-step', { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.85, stagger: 0.14, ease: 'power3.out', scrollTrigger: { trigger: '.process-line', start: 'top 82%' } })

      if (!isMobile) {
        const cards = gsap.utils.toArray('.camera-card')
        const cameraTl = gsap.timeline({
          scrollTrigger: {
            trigger: '.camera-section',
            start: 'top top',
            end: '+=220%',
            pin: true,
            scrub: 1.1,
            anticipatePin: 1,
          },
        })
        cameraTl.fromTo('.camera-title', { y: 80, scale: 0.94, opacity: 0.35 }, { y: 0, scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out' })
        cards.forEach((card, index) => {
          cameraTl.fromTo(card, { y: 110, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, index * 0.2)
        })
        cameraTl.to('.camera-stage', { scale: 0.965, y: -24, duration: 0.9, ease: 'power3.inOut' })
      } else {
        gsap.fromTo('.camera-card', { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.16, ease: 'power3.out', scrollTrigger: { trigger: '.camera-cards', start: 'top 82%' } })
      }

      gsap.to('.forge-core', { y: -38, scale: 1.04, ease: 'power3.inOut', scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: 1.2 } })
      gsap.to('.contact-core', { boxShadow: '0 0 160px rgba(232,132,46,.2)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.contact-core', start: 'top 70%' } })
    }, rootRef)

    return () => ctx.revert()
  }, [reducedMotion, isMobile])

  return (
    <main ref={rootRef} className="forge-root relative min-h-screen overflow-x-hidden bg-[#030305] text-[#f6efe8]">
      <ForgeCanvas reducedMotion={reducedMotion} quality={quality} />
      <Cursor reducedMotion={reducedMotion} />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,.16)_45%,rgba(0,0,0,.66)_100%)]" />
      <Header />
      <PerformanceDock quality={quality} setQuality={setQuality} />
      <div className="relative z-10 pb-32 md:pb-0">
        <Hero />
        <Manifesto />
        <Journey />
        <Work />
        <ProcessSection />
        <Contact />
      </div>
    </main>
  )
}

export default App
