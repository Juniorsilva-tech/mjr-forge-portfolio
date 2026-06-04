import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import BrandMark from './components/BrandMark.jsx'
import BlackHoleBackground from './components/BlackHoleBackground.jsx'
import GravityCursor from './components/GravityCursor.jsx'
import PerformanceModeToggle, { usePerformanceMode } from './components/PerformanceModeToggle.jsx'
import ProjectMockup from './components/ProjectMockup.jsx'
import SpatialSection from './components/SpatialSection.jsx'
import {
  PerformanceProfileContext,
  getPerformanceProfile,
  usePerformanceProfile,
} from './lib/performance.js'
import { useSpatialJourney } from './lib/useSpatialJourney.js'

function PageIntroLoader({ onDone }) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)
  const [frame, setFrame] = useState('00:00:00:00')

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    // Timecode counter
    let f = 0
    const tc = setInterval(() => {
      f++
      const ff = String(f % 30).padStart(2, '0')
      const ss = String(Math.floor(f / 30) % 60).padStart(2, '0')
      const mm = String(Math.floor(f / 1800) % 60).padStart(2, '0')
      const hh = String(Math.floor(f / 108000)).padStart(2, '0')
      setFrame(`${hh}:${mm}:${ss}:${ff}`)
    }, 40)

    // Progress bar
    const start = performance.now()
    const duration = 2200
    const raf = requestAnimationFrame(function tick(now) {
      const t = Math.min((now - start) / duration, 1)
      setProgress(t)
      if (t < 1) requestAnimationFrame(tick)
    })

    // Exit
    const exit = setTimeout(() => {
      setVisible(false)
      document.body.style.overflow = ''
      clearInterval(tc)
      setTimeout(onDone, 520)
    }, 2600)

    return () => {
      clearInterval(tc)
      clearTimeout(exit)
      cancelAnimationFrame(raf)
      document.body.style.overflow = ''
    }
  }, [onDone])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: '#010103',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        opacity: visible ? 1 : 0,
        transition: 'opacity 500ms cubic-bezier(0.16,1,0.3,1)',
        pointerEvents: visible ? 'all' : 'none',
      }}
    >
      {/* Top-left brand */}
      <div style={{ position: 'absolute', top: 28, left: 28, fontFamily: 'Syne, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(244,239,231,0.38)' }}>
        MJR Forge
      </div>

      {/* Center content */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'rgba(199,161,90,0.55)', marginBottom: 32 }}>
          {frame}
        </div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(32px, 6vw, 72px)', fontWeight: 800, letterSpacing: '-0.06em', color: '#f4efe7', lineHeight: 1 }}>
          MAURICIO JUNIOR
        </div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, letterSpacing: '0.34em', textTransform: 'uppercase', color: 'rgba(244,239,231,0.32)', marginTop: 14 }}>
          Front-end Developer — UI Premium — React
        </div>
      </div>

      {/* Bottom-left label */}
      <div style={{ position: 'absolute', bottom: 36, left: 28, fontFamily: 'DM Sans, sans-serif', fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(199,161,90,0.38)' }}>
        Initializing
      </div>

      {/* Progress bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.06)' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, rgba(199,161,90,0.9), rgba(255,220,140,1))', width: `${progress * 100}%`, transition: 'width 60ms linear', boxShadow: '0 0 18px rgba(199,161,90,0.8)' }} />
      </div>
    </div>
  )
}

const BRAND = {
  name: 'MJR Forge',
  signature: 'Mauricio Junior',
  email: 'mauriciojr07052006@gmail.com',
  whatsapp: 'https://wa.me/5524992625175',
  github: 'https://github.com/Juniorsilva-tech',
}

const nav = [
  ['Manifesto', '#manifesto'],
  ['Jornada', '#journey'],
  ['Projetos', '#work'],
  ['Contato', '#contato'],
]

const principles = ['Silêncio', 'Presença', 'Ritmo', 'Produto', 'Refino']

const milestones = [
  ['01', 'Março 2026', 'ADS com foco real em web. Estudo virando prática, deploy e projeto visível.'],
  ['02', 'MJR Forge', 'Portfólio como laboratório de identidade, UI e direção visual aplicada.'],
  ['03', 'RetailFlow', 'Dashboard SaaS com CRUD, clientes, pedidos, métricas e visão de produto.'],
  ['04', 'Princessmel', 'Projeto real para loja cristã com vitrine digital, estética e conversão.'],
  ['05', 'Jarvis', 'Workflow privado de QA visual e aceleração de interface com IA aplicada.'],
]

const projects = [
  {
    slug: 'princessmel',
    label: 'Real Case',
    title: 'Princessmel',
    status: 'Em construção',
    summary: 'Editorial warm',
    text: 'Landing page e presença digital para loja de moda cristã, com foco em curadoria, respiração visual e CTA direto via WhatsApp.',
    note: 'Apresentado como direção visual e base real de produto, ainda em evolução.',
    tags: ['Landing Page', 'Branding', 'UI Editorial', 'WhatsApp'],
  },
  {
    slug: 'retailflow',
    label: 'SaaS Demo',
    title: 'RetailFlow Dashboard',
    status: 'Projeto navegável',
    summary: 'Business precise',
    text: 'Dashboard para pequenos negócios com clientes, pedidos, financeiro e relatórios, desenhado para parecer produto real e pronto para operação.',
    note: 'Caso mais maduro em termos de interface, fluxo operacional e prova visual de produto.',
    tags: ['React', 'Dashboard', 'CRUD', 'Vercel'],
    demo: 'https://retailflow-dashboard.vercel.app',
    repo: 'https://github.com/Juniorsilva-tech/retailflow-dashboard',
    screenshots: [
      '/retailflow/retailflow-dashboard-01.png',
      '/retailflow/retailflow-dashboard-02.png',
      '/retailflow/retailflow-dashboard-03.png',
      '/retailflow/retailflow-dashboard-04.png',
      '/retailflow/retailflow-dashboard-05.png',
    ],
  },
  {
    slug: 'jarvis',
    label: 'Private System',
    title: 'Jarvis Workflow',
    status: 'Em finalização',
    summary: 'Silent automation',
    text: 'Sistema privado para organizar, revisar e acelerar criação de interfaces com QA visual, automação e leitura operacional.',
    note: 'Exibido como sistema autoral em finalização, com foco em processo e automação aplicada.',
    tags: ['Automation', 'QA Visual', 'AI Workflow', 'React UI'],
  },
]

const professionalHighlights = [
  {
    title: 'Front-end React',
    text: 'Interfaces modernas com arquitetura clara, legibilidade e manutenção viável.',
  },
  {
    title: 'UI premium',
    text: 'Direção visual controlada, acabamento editorial e consistência entre layout, ritmo e marca.',
  },
  {
    title: 'Dashboards',
    text: 'Painéis para operação e leitura de métricas com foco em clareza e uso real.',
  },
  {
    title: 'Landing pages',
    text: 'Páginas para apresentação, conversão e narrativa visual com CTA objetivo.',
  },
  {
    title: 'Automação',
    text: 'Fluxos que aceleram build, QA e revisão sem sacrificar estabilidade.',
  },
  {
    title: 'IA aplicada',
    text: 'Uso pragmático de IA para validação, refinamento e aceleração de entrega.',
  },
]

const SCENES = {
  hero: {
    sceneKey: 'hero',
    direction: 'left',
    accent: 'rgba(199, 161, 90, 0.18)',
    secondary: 'rgba(110, 68, 42, 0.16)',
    gridLine: 'rgba(199, 161, 90, 0.08)',
    gridGlow: 'rgba(199, 161, 90, 0.2)',
    highlightX: '76%',
    highlightY: '16%',
    cameraX: '-28px',
    cameraY: '-12px',
    cameraScale: '1.006',
    gradientAngle: '118deg',
    dissolveAngle: '128deg',
    background:
      'linear-gradient(122deg, #050505 0%, #080706 34%, #14100d 63%, #050505 100%)',
    mesh:
      'radial-gradient(circle at 74% 16%, rgba(199,161,90,0.18), transparent 30%), radial-gradient(circle at 18% 84%, rgba(155,94,50,0.15), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.02), transparent 54%)',
    grid:
      'linear-gradient(rgba(199,161,90,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(199,161,90,0.05) 1px, transparent 1px)',
  },
  manifesto: {
    sceneKey: 'manifesto',
    direction: 'right',
    accent: 'rgba(214, 174, 118, 0.16)',
    secondary: 'rgba(244, 239, 231, 0.08)',
    gridLine: 'rgba(244, 239, 231, 0.05)',
    gridGlow: 'rgba(214, 174, 118, 0.18)',
    highlightX: '26%',
    highlightY: '28%',
    cameraX: '22px',
    cameraY: '-6px',
    cameraScale: '1.003',
    gradientAngle: '244deg',
    dissolveAngle: '236deg',
    background:
      'linear-gradient(132deg, #050505 0%, #120f0b 28%, #1a140e 56%, #070707 100%)',
    mesh:
      'radial-gradient(circle at 28% 24%, rgba(214,174,118,0.18), transparent 28%), radial-gradient(circle at 78% 76%, rgba(244,239,231,0.08), transparent 32%)',
    grid:
      'linear-gradient(rgba(244,239,231,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(214,174,118,0.04) 1px, transparent 1px)',
  },
  journey: {
    sceneKey: 'journey',
    direction: 'center',
    accent: 'rgba(165, 112, 68, 0.16)',
    secondary: 'rgba(244, 239, 231, 0.06)',
    gridLine: 'rgba(185, 139, 93, 0.05)',
    gridGlow: 'rgba(165, 112, 68, 0.16)',
    highlightX: '50%',
    highlightY: '18%',
    cameraX: '0px',
    cameraY: '-10px',
    cameraScale: '1.004',
    gradientAngle: '180deg',
    dissolveAngle: '180deg',
    background:
      'linear-gradient(145deg, #060606 0%, #0d0a08 25%, #19120d 58%, #070707 100%)',
    mesh:
      'radial-gradient(circle at 50% 18%, rgba(165,112,68,0.18), transparent 30%), radial-gradient(circle at 14% 72%, rgba(244,239,231,0.06), transparent 22%), radial-gradient(circle at 86% 72%, rgba(122,84,46,0.12), transparent 26%)',
    grid:
      'linear-gradient(rgba(185,139,93,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(185,139,93,0.05) 1px, transparent 1px)',
  },
  work: {
    sceneKey: 'work',
    direction: 'right',
    accent: 'rgba(87, 125, 214, 0.14)',
    secondary: 'rgba(20, 39, 76, 0.14)',
    gridLine: 'rgba(121, 164, 255, 0.04)',
    gridGlow: 'rgba(87, 125, 214, 0.14)',
    highlightX: '72%',
    highlightY: '18%',
    cameraX: '18px',
    cameraY: '-10px',
    cameraScale: '1.004',
    gradientAngle: '238deg',
    dissolveAngle: '230deg',
    background:
      'linear-gradient(138deg, #050608 0%, #0a111d 28%, #111b2a 58%, #060709 100%)',
    mesh:
      'radial-gradient(circle at 76% 18%, rgba(87,125,214,0.22), transparent 28%), radial-gradient(circle at 20% 80%, rgba(26,53,102,0.18), transparent 30%), linear-gradient(180deg, rgba(255,255,255,0.015), transparent 56%)',
    grid:
      'linear-gradient(rgba(121,164,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(121,164,255,0.05) 1px, transparent 1px)',
  },
  professional: {
    sceneKey: 'professional',
    direction: 'left',
    accent: 'rgba(199, 161, 90, 0.14)',
    secondary: 'rgba(244, 239, 231, 0.07)',
    gridLine: 'rgba(199, 161, 90, 0.04)',
    gridGlow: 'rgba(199, 161, 90, 0.16)',
    highlightX: '24%',
    highlightY: '24%',
    cameraX: '-18px',
    cameraY: '-6px',
    cameraScale: '1.002',
    gradientAngle: '118deg',
    dissolveAngle: '122deg',
    background:
      'linear-gradient(140deg, #050505 0%, #0a0907 24%, #141210 52%, #050505 100%)',
    mesh:
      'radial-gradient(circle at 22% 24%, rgba(199,161,90,0.16), transparent 26%), radial-gradient(circle at 82% 74%, rgba(244,239,231,0.05), transparent 30%)',
    grid:
      'linear-gradient(rgba(199,161,90,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(199,161,90,0.03) 1px, transparent 1px)',
  },
  process: {
    sceneKey: 'process',
    direction: 'center',
    accent: 'rgba(98, 122, 140, 0.14)',
    secondary: 'rgba(44, 56, 69, 0.18)',
    gridLine: 'rgba(98, 122, 140, 0.05)',
    gridGlow: 'rgba(98, 122, 140, 0.14)',
    highlightX: '50%',
    highlightY: '20%',
    cameraX: '0px',
    cameraY: '-16px',
    cameraScale: '1.006',
    gradientAngle: '180deg',
    dissolveAngle: '186deg',
    background:
      'linear-gradient(142deg, #050505 0%, #090c10 24%, #12171d 56%, #050505 100%)',
    mesh:
      'radial-gradient(circle at 50% 18%, rgba(98,122,140,0.16), transparent 28%), radial-gradient(circle at 18% 82%, rgba(55,74,95,0.14), transparent 24%), radial-gradient(circle at 82% 80%, rgba(244,239,231,0.05), transparent 22%)',
    grid:
      'linear-gradient(rgba(98,122,140,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(98,122,140,0.04) 1px, transparent 1px)',
  },
  contact: {
    sceneKey: 'contact',
    direction: 'right',
    accent: 'rgba(214, 180, 122, 0.2)',
    secondary: 'rgba(244, 239, 231, 0.08)',
    gridLine: 'rgba(214, 180, 122, 0.05)',
    gridGlow: 'rgba(214, 180, 122, 0.18)',
    highlightX: '66%',
    highlightY: '18%',
    cameraX: '18px',
    cameraY: '-10px',
    cameraScale: '1.004',
    gradientAngle: '238deg',
    dissolveAngle: '238deg',
    background:
      'linear-gradient(138deg, #050505 0%, #0d0a08 26%, #17110c 58%, #050505 100%)',
    mesh:
      'radial-gradient(circle at 68% 18%, rgba(214,180,122,0.22), transparent 30%), radial-gradient(circle at 28% 82%, rgba(244,239,231,0.06), transparent 26%)',
    grid:
      'linear-gradient(rgba(214,180,122,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(214,180,122,0.04) 1px, transparent 1px)',
  },
}

const PROJECT_TONES = {
  princessmel: {
    '--project-accent': 'rgba(214, 176, 122, 0.18)',
    '--project-secondary': 'rgba(132, 89, 48, 0.14)',
    '--project-tint': 'rgba(99, 63, 32, 0.1)',
    '--project-outline': 'rgba(244, 223, 190, 0.08)',
  },
  retailflow: {
    '--project-accent': 'rgba(93, 140, 255, 0.2)',
    '--project-secondary': 'rgba(23, 51, 109, 0.18)',
    '--project-tint': 'rgba(13, 26, 48, 0.14)',
    '--project-outline': 'rgba(127, 170, 255, 0.1)',
  },
  jarvis: {
    '--project-accent': 'rgba(133, 152, 160, 0.12)',
    '--project-secondary': 'rgba(40, 51, 58, 0.16)',
    '--project-tint': 'rgba(11, 14, 17, 0.24)',
    '--project-outline': 'rgba(166, 178, 185, 0.08)',
  },
}

function useCompactViewport() {
  const [isCompactViewport, setIsCompactViewport] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const media = window.matchMedia('(max-width: 767px)')
    const syncViewport = () => setIsCompactViewport(media.matches)

    syncViewport()
    media.addEventListener('change', syncViewport)

    return () => media.removeEventListener('change', syncViewport)
  }, [])

  return isCompactViewport
}

function getSceneVariants(type, intensity = 1) {
  const yDepth = Math.round(22 * intensity)
  const yRise = Math.round(28 * intensity)
  const xShift = Math.round(30 * intensity)
  const yFinal = Math.round(18 * intensity)

  return {
    depth: {
      hidden: { opacity: 0, y: yDepth, scale: 0.985 },
      visible: { opacity: 1, y: 0, scale: 1 },
    },
    rise: {
      hidden: { opacity: 0, y: yRise },
      visible: { opacity: 1, y: 0 },
    },
    left: {
      hidden: { opacity: 0, x: xShift, scale: 0.992 },
      visible: { opacity: 1, x: 0, scale: 1 },
    },
    expand: {
      hidden: { opacity: 0, scale: 0.985 },
      visible: { opacity: 1, scale: 1 },
    },
    final: {
      hidden: { opacity: 0, y: yFinal, scale: 0.988 },
      visible: { opacity: 1, y: 0, scale: 1 },
    },
  }[type]
}

function Scene({ type = 'rise', children, className = '', delay = 0 }) {
  const performance = usePerformanceProfile()

  if (!performance.motionEnabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      variants={getSceneVariants(type, performance.key === 'high' ? 1 : 0.76)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: performance.viewportAmount, margin: '-80px' }}
      transition={{
        duration: performance.sceneDuration,
        delay: delay * performance.sceneDelayFactor,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function Icon({ name, className = '' }) {
  const icons = {
    arrow: ['M5 12h14', 'M13 5l7 7-7 7'],
    menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
    close: ['M6 6l12 12', 'M18 6L6 18'],
  }

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {(icons[name] || icons.arrow).map((path, index) => (
        <path key={index} d={path} />
      ))}
    </svg>
  )
}

function Button({ href, children, secondary = false }) {
  const isExternal = href?.startsWith('http')

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
      data-cursor="active"
      className={`group inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold transition duration-300 sm:w-auto ${
        secondary
          ? 'border border-[#f4efe7]/10 bg-[#080807]/55 text-[#f4efe7] hover:border-[#c7a15a]/40 hover:bg-[#c7a15a]/8'
          : 'bg-[#c7a15a] text-[#080807] shadow-[0_20px_90px_rgba(199,161,90,.18)] hover:bg-[#f4efe7]'
      }`}
    >
      {children}
      <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
    </a>
  )
}

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#f4efe7]/10 bg-[#050505]/96 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-5 py-4 lg:px-8">
        <a href="#top" className="flex min-w-0 items-center gap-3" data-cursor="active">
          <BrandMark />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#f4efe7]">{BRAND.name}</p>
            <p className="mt-1 truncate text-[10px] uppercase tracking-[0.26em] text-[#a89f91]">
              {BRAND.signature}
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-1 rounded-full border border-[#f4efe7]/10 bg-[#f4efe7]/5 p-1 md:flex">
          {nav.map(([label, href]) => (
            <a
              key={href}
              href={href}
              data-cursor="active"
              className="rounded-full px-4 py-2 text-xs font-semibold text-[#a89f91] transition hover:bg-[#c7a15a]/10 hover:text-[#f4efe7]"
            >
              {label}
            </a>
          ))}
        </nav>

        <a
          href={BRAND.whatsapp}
          target="_blank"
          rel="noreferrer"
          data-cursor="active"
          className="hidden rounded-full bg-[#c7a15a] px-5 py-2.5 text-xs font-semibold text-[#080807] transition hover:bg-[#f4efe7] md:inline-flex"
        >
          Vamos conversar
        </a>

        <button
          type="button"
          onClick={() => setOpen(current => !current)}
          className="rounded-full border border-[#f4efe7]/10 bg-[#f4efe7]/5 p-2 md:hidden"
          aria-label="Abrir menu"
          aria-expanded={open}
        >
          <Icon name={open ? 'close' : 'menu'} className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="border-t border-[#f4efe7]/10 bg-[#080807]/98 px-5 py-4 md:hidden">
          {nav.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="mb-2 block rounded-2xl bg-[#f4efe7]/5 px-4 py-3 text-sm font-semibold text-[#f4efe7]"
            >
              {label}
            </a>
          ))}

          <a
            href={BRAND.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-[#c7a15a] px-4 py-3 text-sm font-semibold text-[#080807]"
          >
            Vamos conversar
          </a>
        </div>
      )}
    </header>
  )
}

function Hero() {
  return (
    <SpatialSection
      id="top"
      scene={SCENES.hero}
      className="relative z-10 min-h-screen overflow-hidden px-5 pb-16 pt-24 sm:pt-28 lg:px-8"
      shellClassName="forge-scene-focus"
    >
      <div className="forge-depth-stage relative z-10 mx-auto grid min-h-[calc(100vh-6.5rem)] max-w-[1500px] items-center gap-10 lg:min-h-[calc(100vh-7rem)] lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
        <Scene type="depth" className="relative z-10">
          <div className="relative z-10 max-w-[640px]">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#c7a15a] sm:text-xs sm:tracking-[0.45em]">
              Front-end React · UI Premium · Produto Digital
            </p>

            <h1 style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2.2rem, 4.2vw, 5.8rem)',
              lineHeight: 1.0,
              letterSpacing: '-0.04em',
              color: '#f4efe7',
              maxWidth: '16ch',
              margin: 0,
              position: 'relative',
              zIndex: 10,
            }}>
              Interfaces que resolvem. Front-end com presença.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#d8d0c3] sm:mt-8 sm:text-lg md:text-xl md:leading-9">
              Creative Front-end Developer focado em React, UI premium, dashboards e
              experiências digitais modernas.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {['React', 'Dashboards', 'Landing Pages', 'UI Systems'].map(item => (
                <span
                  key={item}
                  className="rounded-full border border-[#f4efe7]/10 bg-[#f4efe7]/5 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d8d0c3] sm:px-4 sm:text-[11px] sm:tracking-[0.18em]"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button href="#work">Explorar projetos</Button>
              <Button href={BRAND.whatsapp} secondary>
                Falar comigo
              </Button>
            </div>
          </div>
        </Scene>

        <Scene type="left" delay={0.12} className="relative z-10">
          <div className="relative ml-auto w-full max-w-[560px]">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-[#c7a15a]/8 blur-[52px] sm:-inset-8 sm:rounded-[3rem]" />

            <div className="relative overflow-hidden rounded-[3rem] border border-[#f4efe7]/10 bg-[#0b0a08]/70 p-3 shadow-[0_50px_160px_rgba(0,0,0,.55)]">
              <img
                src="/forge-portrait.jpg"
                alt="Mauricio Junior"
                className="h-[420px] w-full rounded-[2.2rem] object-cover object-[50%_20%] saturate-[.85] contrast-[1.08] brightness-[.78] sm:h-[560px] sm:rounded-[2.4rem] lg:h-[620px]"
              />

              <div className="absolute inset-3 rounded-[2.2rem] bg-[linear-gradient(180deg,transparent_35%,rgba(5,5,5,.92)_100%)] sm:rounded-[2.4rem]" />

              <div className="absolute bottom-5 left-5 right-5 rounded-[1.6rem] border border-[#f4efe7]/10 bg-[#050505]/82 p-4 sm:bottom-8 sm:left-8 sm:right-8 sm:rounded-3xl sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c7a15a]">
                  Engineering & Design
                </p>
                <p className="mt-2 text-sm leading-6 text-[#d8d0c3]">
                  React, dashboards, landing pages e sistemas com direção visual e entrega real.
                </p>
              </div>
            </div>
          </div>
        </Scene>
      </div>
    </SpatialSection>
  )
}

function SectionTitle({ eyebrow, title, text, type = 'rise' }) {
  return (
    <Scene type={type} className="mb-14 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#c7a15a]">
          {eyebrow}
        </p>
        <h2 className="max-w-4xl text-4xl font-[Syne] font-semibold leading-[0.98] tracking-[-0.055em] text-[#f4efe7] md:text-6xl">
          {title}
        </h2>
      </div>

      {text && <p className="max-w-2xl text-lg leading-8 text-[#a89f91]">{text}</p>}
    </Scene>
  )
}

function Manifesto() {
  return (
    <div className="relative z-10 bg-[#050505]/80 backdrop-blur-[1px]">
      <SpatialSection
        id="manifesto"
        scene={SCENES.manifesto}
        className="mx-auto max-w-[1500px] px-5 py-20 lg:px-8"
        shellClassName="forge-scene-focus"
      >
        <Scene type="depth">
          <div className="relative overflow-hidden rounded-[3rem] border border-[#f4efe7]/10 bg-[#0b0a08]/88 p-8 shadow-[0_40px_140px_rgba(0,0,0,.45)] md:p-14 lg:p-20">
            <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div>
                <p className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-[#c7a15a]">
                  Manifesto
                </p>
                <h2 className="text-5xl font-[Syne] font-semibold leading-[0.95] tracking-[-0.07em] text-[#f4efe7] md:text-7xl">
                  O site não precisa gritar. Precisa conduzir.
                </h2>
              </div>

              <div>
                <p className="text-xl leading-9 text-[#a89f91]">
                  O Forge parte da ideia de que uma boa interface tem ritmo: silêncio, tensão,
                  respiro, impacto e clareza. Menos efeito aleatório. Mais direção visual.
                </p>

                <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {principles.map((item, index) => (
                    <Scene key={item} type="rise" delay={index * 0.04}>
                      <div className="rounded-2xl border border-[#f4efe7]/10 bg-[#050505]/60 px-4 py-5 text-center text-sm font-semibold text-[#d8d0c3]">
                        {item}
                      </div>
                    </Scene>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Scene>
      </SpatialSection>
    </div>
  )
}

function JourneyScene() {
  const containerRef = useRef(null)
  const trackRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })

  // Import useScroll, useTransform from framer-motion at the top of file
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-66.666%'])

  return (
    <div ref={containerRef} id="journey" style={{ height: '350vh', position: 'relative', zIndex: 10, backgroundColor: 'rgba(5,5,5,0.75)' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <SpatialSection
          scene={SCENES.journey}
          className="h-full px-5 pt-24 lg:px-8"
          shellClassName="forge-scene-focus"
        >
          <div className="mb-10">
            <SectionTitle
              type="left"
              eyebrow="Jornada / ritmo"
              title="A jornada atravessa a tela."
              text={null}
            />
          </div>

          <motion.div
            ref={trackRef}
            style={{ x, display: 'flex', gap: '1.25rem', willChange: 'transform', width: `${milestones.length * (360 + 20)}px` }}
          >
            {milestones.map(([number, time, text], index) => (
              <article
                key={time}
                style={{ width: 360, flexShrink: 0 }}
                className="forge-emerge-card forge-scene-focus relative h-[320px] rounded-[1.6rem] border border-[#f4efe7]/10 bg-[#0c0b09]/88 p-6 shadow-[0_40px_140px_rgba(0,0,0,.42)]"
              >
                <p className="text-[3.5rem] font-[Syne] font-extrabold leading-none tracking-[-0.12em] text-[#c7a15a]/18">
                  {number}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.32em] text-[#c7a15a]">
                  {time}
                </p>
                <p className="mt-5 text-base leading-8 text-[#a89f91]">{text}</p>
              </article>
            ))}
          </motion.div>
        </SpatialSection>
      </div>
    </div>
  )
}

function Work() {
  const performance = usePerformanceProfile()

  return (
    <div className="relative z-10 bg-[#050505]/80 backdrop-blur-[1px]">
      <SpatialSection
        id="work"
        scene={SCENES.work}
        className="mx-auto max-w-[1500px] px-5 py-20 lg:px-8"
        shellClassName="forge-scene-focus"
      >
        <SectionTitle
          type="expand"
          eyebrow="Projetos selecionados"
          title="Projetos com leitura de produto e atmosfera própria."
          text="Três atmosferas com leitura clara de produto: business frio, editorial quente e automação silenciosa."
        />

        <div className="grid gap-8">
          {projects.map((project, index) => (
            <Scene
              key={project.title}
              type={index % 2 === 0 ? 'depth' : 'left'}
              delay={index * 0.08}
            >
              <motion.article
                whileHover={performance.hoverLift ? { y: -Math.max(2, performance.hoverLift - 2) } : undefined}
                data-cursor="active"
                style={PROJECT_TONES[project.slug] ?? PROJECT_TONES.jarvis}
                className="forge-emerge-card forge-project-storyboard overflow-hidden rounded-[2.3rem] border border-[#f4efe7]/10 bg-[#0b0a08]/88 p-3 shadow-[0_40px_140px_rgba(0,0,0,.45)] sm:rounded-[2.8rem] sm:p-4"
              >
                <div className="relative grid gap-8 rounded-[2rem] bg-gradient-to-br from-[#f4efe7]/[0.025] via-transparent to-transparent p-5 sm:rounded-[2.4rem] sm:p-7 md:p-10 lg:grid-cols-[0.5fr_0.72fr_1.14fr] lg:items-start lg:gap-10">
                  <div className="relative z-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#c7a15a]">
                      {project.label}
                    </p>
                    <p className="mt-3 inline-flex rounded-full border border-[#f4efe7]/10 bg-[#0f0f0e]/88 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b7afa3]">
                      {project.status}
                    </p>
                    <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8f877b]">
                      {project.summary}
                    </p>
                    <h3 className="mt-4 text-[2.8rem] font-[Syne] font-semibold tracking-[-0.06em] text-[#f4efe7] md:text-6xl">
                      {project.title}
                    </h3>
                  </div>

                  <div className="relative z-10">
                    <p className="max-w-[42ch] text-base leading-8 text-[#b5ada1] md:text-lg">{project.text}</p>
                    <p className="mt-4 max-w-[42ch] text-sm leading-7 text-[#8f877b]">
                      {project.note}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2.5">
                      {project.tags.map(tag => (
                        <span
                          key={tag}
                          className="rounded-full border border-[#f4efe7]/10 bg-[#f4efe7]/[0.04] px-3.5 py-1.5 text-[11px] font-semibold text-[#d8d0c3]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {(project.demo || project.repo) && (
                      <div className="mt-8 flex flex-wrap gap-3">
                        {project.demo && <Button href={project.demo}>Demo</Button>}
                        {project.repo && (
                          <Button href={project.repo} secondary>
                            GitHub
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  <ProjectMockup index={index} project={project} />
                </div>
              </motion.article>
            </Scene>
          ))}
        </div>
      </SpatialSection>
    </div>
  )
}

function Contact() {
  return (
    <div className="relative z-10 bg-[#050505]/80 backdrop-blur-[1px]">
      <SpatialSection
        id="contato"
        scene={SCENES.contact}
        className="mx-auto max-w-6xl px-5 py-20 text-center lg:px-8"
        shellClassName="forge-scene-focus"
      >
        <Scene type="final">
          <div className="relative overflow-hidden rounded-[3rem] border border-[#f4efe7]/10 bg-[#0b0a08]/86 p-8 md:p-16">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c7a15a] to-transparent" />

            <p style={{ fontFamily: 'Syne', fontSize: 'clamp(80px, 14vw, 180px)', fontWeight: 800, letterSpacing: '-0.08em', color: 'rgba(199,161,90,0.06)', lineHeight: 1, marginBottom: -20 }}>MJR</p>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#c7a15a]">
              Cena final
            </p>
            <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-[Syne] font-semibold tracking-[-0.06em] text-[#f4efe7] md:text-6xl">
              Você tem o problema. Eu tenho a interface.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#a89f91]">
              Disponível para estágio front-end, freelas de produto e colaborações com quem leva interface a sério.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button href={BRAND.whatsapp}>WhatsApp</Button>
              <Button href={`mailto:${BRAND.email}`} secondary>
                E-mail
              </Button>
              <Button href={BRAND.github} secondary>
                GitHub
              </Button>
            </div>
          </div>
        </Scene>
      </SpatialSection>
    </div>
  )
}

function AppShell() {
  const { mode, setMode, resolvedMode } = usePerformanceMode()
  const prefersReducedMotion = useReducedMotion()
  const isCompactViewport = useCompactViewport()
  const [, setActiveSceneKey] = useState('hero')
  const [loaded, setLoaded] = useState(false)
  const handleLoaded = useCallback(() => setLoaded(true), [])
  const performanceProfile = useMemo(
    () =>
      getPerformanceProfile(resolvedMode, {
        prefersReducedMotion,
        isCompactViewport,
      }),
    [isCompactViewport, prefersReducedMotion, resolvedMode],
  )

  useSpatialJourney(performanceProfile, setActiveSceneKey)

  useEffect(() => {
    document.documentElement.dataset.cursorMode = performanceProfile.cursorEnabled ? 'custom' : 'native'
    document.documentElement.dataset.performanceMode = performanceProfile.key
    document.documentElement.dataset.motion = performanceProfile.motionEnabled ? 'full' : 'reduce'

    return () => {
      delete document.documentElement.dataset.cursorMode
      delete document.documentElement.dataset.performanceMode
      delete document.documentElement.dataset.motion
    }
  }, [performanceProfile])

  return (
    <PerformanceProfileContext.Provider value={performanceProfile}>
      <main
        className="forge-root min-h-screen overflow-hidden bg-[#050505] text-[#f4efe7] antialiased"
        data-performance-mode={performanceProfile.key}
        data-motion={performanceProfile.motionEnabled ? 'full' : 'reduce'}
        style={performanceProfile.cssVariables}
      >
        <PageIntroLoader onDone={handleLoaded} />
        <BlackHoleBackground />
        <GravityCursor />

        <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 600ms ease', transitionDelay: '100ms' }}>
          <Header />

          <div className="forge-spatial-orbit">
            <Hero />
            <Manifesto />
            <JourneyScene />
            <Work />
            <Contact />

            <footer className="relative z-10 border-t border-[#f4efe7]/10 px-5 py-8 lg:px-8">
              <div className="mx-auto flex max-w-[1500px] flex-col gap-4 text-sm text-[#766f65] md:flex-row md:items-center md:justify-between">
                <p>
                  &copy; 2026 {BRAND.signature} - {BRAND.name}
                </p>
                <p>React - UI premium - dashboards - automação aplicada à entrega</p>
              </div>
            </footer>
          </div>
        </div>

        <div style={{ display: 'none' }}>
          <PerformanceModeToggle
            mode={mode}
            setMode={setMode}
            resolvedMode={performanceProfile.key}
          />
        </div>
      </main>
    </PerformanceProfileContext.Provider>
  )
}

export default function App() {
  return <AppShell />
}
