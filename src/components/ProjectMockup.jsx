import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePerformanceProfile } from '../lib/performance.js'

const mockups = {
  princessmel: {
    title: 'Princessmel Editorial',
    subtitle: 'moda crista / WhatsApp / vitrine',
    stats: [
      ['01', 'brand'],
      ['24h', 'lead'],
      ['CTA', 'direct'],
    ],
    lines: ['Curadoria visual', 'Produtos em destaque', 'Contato sem friccao'],
  },
  retailflow: {
    title: 'RetailFlow SaaS',
    subtitle: 'clientes / pedidos / financeiro',
    stats: [
      ['03', 'views'],
      ['real', 'shots'],
      ['SaaS', 'ready'],
    ],
    lines: ['Dashboard operacional', 'Visao comercial clara', 'Fluxo de produto legivel'],
  },
  jarvis: {
    title: 'Jarvis Workflow',
    subtitle: 'generate / QA / repair',
    stats: [
      ['90', 'score'],
      ['06', 'steps'],
      ['PASS', 'build'],
    ],
    lines: ['Planner cria direcao', 'QA valida interface', 'Repair corrige falhas'],
  },
}

const screenshotMeta = {
  'retailflow-dashboard-01': {
    label: 'Overview',
    caption: 'Visao principal com metricas, atalhos e leitura rapida do estado da operacao.',
    featured: true,
  },
  'retailflow-dashboard-02': {
    label: 'Clientes',
    caption: 'Gestao de clientes com foco em organizacao de base e consulta direta.',
    featured: false,
  },
  'retailflow-dashboard-03': {
    label: 'Pedidos',
    caption: 'Fluxo de pedidos desenhado para acompanhar andamento, volume e prioridade.',
    featured: true,
  },
  'retailflow-dashboard-04': {
    label: 'Financeiro',
    caption: 'Camada financeira clara para acompanhar receitas, pagamentos e status.',
    featured: false,
  },
  'retailflow-dashboard-05': {
    label: 'Relatorios',
    caption: 'Painel analitico para leitura de performance e tomada de decisao.',
    featured: true,
  },
}

function getScreenshotMeta(source) {
  const fileName = source.split('/').pop()?.replace('.png', '') ?? ''

  return screenshotMeta[fileName] ?? {
    label: 'Painel',
    caption: 'Interface em destaque.',
    featured: false,
  }
}

function getFeaturedShots(shots) {
  if (shots.length <= 3) return shots

  const featuredShots = shots.filter(shot => shot.featured)
  return featuredShots.length > 0 ? featuredShots.slice(0, 3) : shots.slice(0, 3)
}

function PlaceholderTile({ label }) {
  return (
    <div className="rounded-[1.3rem] border border-[#f4efe7]/10 bg-[#050505]/55 p-4">
      <div className="h-20 rounded-[1rem] border border-dashed border-[#f4efe7]/10 bg-[linear-gradient(135deg,rgba(244,239,231,.05),transparent_55%)]" />
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a89f91]">
        {label}
      </p>
    </div>
  )
}

function FallbackLayout({ item, motionEnabled }) {
  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        {item.lines.map((line, lineIndex) => (
          <motion.div
            key={line}
            initial={motionEnabled ? { opacity: 0, y: 12 } : false}
            whileInView={motionEnabled ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: motionEnabled ? lineIndex * 0.06 : 0 }}
            className="rounded-full border border-[#f4efe7]/10 bg-[#050505]/65 px-3 py-2 text-xs font-semibold text-[#d8d0c3]"
          >
            {line}
          </motion.div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[1.8rem] border border-[#f4efe7]/10 bg-[linear-gradient(145deg,rgba(199,161,90,.11),rgba(5,5,5,.12)_36%,rgba(5,5,5,.82)_100%)] p-5">
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#c7a15a]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#f4efe7]/25" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#9b5e32]/70" />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#c7a15a]">
              portfolio artifact
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <div className="h-10 w-3/4 rounded-full bg-[#f4efe7]/10" />
            <div className="h-3 w-full rounded-full bg-[#f4efe7]/10" />
            <div className="h-3 w-5/6 rounded-full bg-[#f4efe7]/8" />
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="h-28 rounded-[1.4rem] border border-[#f4efe7]/10 bg-[#050505]/45" />
              <div className="h-28 rounded-[1.4rem] border border-[#f4efe7]/10 bg-[#050505]/65" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <PlaceholderTile label="Main panel" />
          <PlaceholderTile label="Data card" />
          <PlaceholderTile label="Metric state" />
          <PlaceholderTile label="Action bar" />
        </div>
      </div>
    </div>
  )
}

function ScreenshotLayout({ screenshots, motionEnabled }) {
  const normalizedShots = useMemo(
    () =>
      screenshots.map(source => ({
        source,
        ...getScreenshotMeta(source),
      })),
    [screenshots],
  )
  const featuredShots = useMemo(() => getFeaturedShots(normalizedShots), [normalizedShots])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setActiveIndex(0)
  }, [featuredShots])

  const activeShot = featuredShots[activeIndex] ?? featuredShots[0]

  return (
    <div className="mt-6 space-y-4">
      <div className="overflow-hidden rounded-[2rem] border border-[#f4efe7]/10 bg-[#050505]/78 shadow-[0_24px_80px_rgba(0,0,0,.34)]">
        <div className="p-3 sm:p-4">
          <div className="relative overflow-hidden rounded-[1.55rem] border border-[#f4efe7]/10 bg-[radial-gradient(circle_at_top,rgba(244,239,231,.06),rgba(5,5,5,.92)_72%)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeShot.source}
                initial={motionEnabled ? { opacity: 0.7, scale: 1.015 } : false}
                animate={{ opacity: 1, scale: 1 }}
                exit={motionEnabled ? { opacity: 0.7, scale: 0.995 } : undefined}
                transition={{ duration: motionEnabled ? 0.32 : 0 }}
                className="relative aspect-[16/9] p-2 sm:p-3"
              >
                <img
                  src={activeShot.source}
                  alt={`RetailFlow ${activeShot.label}`}
                  className="h-full w-full object-contain object-top"
                  loading="eager"
                  decoding="async"
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0)_44%,rgba(5,5,5,.9)_100%)]" />
            <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
              <span className="rounded-full border border-[#f4efe7]/10 bg-[#050505]/65 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c7a15a] backdrop-blur-[var(--forge-panel-blur)]">
                RetailFlow interface
              </span>
              <span className="rounded-full border border-[#f4efe7]/10 bg-[#050505]/65 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d8d0c3] backdrop-blur-[var(--forge-panel-blur)]">
                {activeShot.label}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <p className="max-w-2xl text-sm font-semibold text-[#f4efe7] sm:text-base">
                {activeShot.caption}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {featuredShots.map((shot, shotIndex) => {
          const selected = shotIndex === activeIndex

          return (
            <button
              key={shot.source}
              type="button"
              onClick={() => setActiveIndex(shotIndex)}
              className={`overflow-hidden rounded-[1.45rem] border bg-[#050505]/74 text-left shadow-[0_18px_60px_rgba(0,0,0,.22)] transition ${
                selected
                  ? 'border-[#c7a15a]/35 bg-[#0d0b08]'
                  : 'border-[#f4efe7]/10 hover:border-[#f4efe7]/20'
              }`}
              aria-label={`Abrir screenshot ${shot.label}`}
            >
              <div className="border-b border-[#f4efe7]/10 bg-[radial-gradient(circle_at_top,rgba(244,239,231,.05),rgba(5,5,5,.92)_74%)] p-2">
                <img
                  src={shot.source}
                  alt={shot.label}
                  className="aspect-[16/10] w-full object-contain object-top"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8f877b]">
                  {String(shotIndex + 1).padStart(2, '0')}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c7a15a]">
                  {shot.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#d8d0c3]">{shot.caption}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function ProjectMockup({ project, index = 0 }) {
  const performance = usePerformanceProfile()
  const item = mockups[project?.slug] ?? mockups.jarvis
  const screenshots = project?.screenshots ?? []
  const hasRealScreenshots = screenshots.length > 0

  return (
    <motion.div
      initial={performance.motionEnabled ? { opacity: 0, y: 28, scale: 0.98 } : false}
      whileInView={performance.motionEnabled ? { opacity: 1, y: 0, scale: 1 } : undefined}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: performance.sceneDuration,
        delay: performance.motionEnabled ? 0.08 : 0,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={
        performance.hoverLift
          ? {
              y: -performance.hoverLift,
              rotateX: performance.mockupTilt ? 2 : 0,
              rotateY: performance.mockupTilt ? (index % 2 === 0 ? -3 : 3) : 0,
              scale: performance.hoverScale,
            }
          : undefined
      }
      className="relative min-h-[320px] overflow-hidden rounded-[2.2rem] border border-[#f4efe7]/10 bg-[#050505]/80 p-4 shadow-[0_45px_140px_rgba(0,0,0,.62)] [transform-style:preserve-3d]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(244,239,231,.05),transparent_34%,rgba(199,161,90,.08))]" />
      <div className="absolute right-[-18%] top-[-20%] h-56 w-56 rounded-full bg-[#c7a15a]/10 opacity-[var(--forge-decorative-opacity)]" />
      <div className="absolute bottom-[-22%] left-[-10%] h-56 w-56 rounded-full bg-[#9b5e32]/10 opacity-[var(--forge-decorative-opacity)]" />

      <div className="relative rounded-[1.7rem] border border-[#f4efe7]/10 bg-[#0b0a08]/84 p-5 backdrop-blur-[var(--forge-panel-blur)]">
        <div className="flex items-center justify-between border-b border-[#f4efe7]/10 pb-4">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#c7a15a]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#f4efe7]/35" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#9b5e32]/80" />
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#c7a15a]">
            {hasRealScreenshots ? 'real visuals' : 'concept frame'}
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-2xl font-semibold tracking-[-0.06em] text-[#f4efe7]">{item.title}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#a89f91]">
              {item.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 md:min-w-[220px]">
            {item.stats.map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-[#f4efe7]/10 bg-[#050505]/55 p-3 text-center"
              >
                <p className="text-lg font-semibold text-[#f4efe7]">{value}</p>
                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#c7a15a]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {hasRealScreenshots ? (
          <ScreenshotLayout screenshots={screenshots} motionEnabled={performance.motionEnabled} />
        ) : (
          <FallbackLayout item={item} motionEnabled={performance.motionEnabled} />
        )}
      </div>
    </motion.div>
  )
}
