import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePerformanceProfile } from '../lib/performance.js'

const mockups = {
  princessmel: {
    title: 'Princessmel Editorial',
    subtitle: 'moda cristã / WhatsApp / vitrine',
    stats: [
      ['01', 'brand'],
      ['24h', 'lead'],
      ['CTA', 'direct'],
    ],
    lines: ['Curadoria visual', 'Produtos em destaque', 'Contato sem fricção'],
  },
  retailflow: {
    title: 'RetailFlow SaaS',
    subtitle: 'clientes / pedidos / financeiro',
    stats: [
      ['03', 'views'],
      ['real', 'shots'],
      ['SaaS', 'ready'],
    ],
    lines: ['Dashboard operacional', 'Visão comercial clara', 'Fluxo de produto legível'],
  },
  jarvis: {
    title: 'Jarvis Workflow',
    subtitle: 'generate / QA / repair',
    stats: [
      ['90', 'score'],
      ['06', 'steps'],
      ['PASS', 'build'],
    ],
    lines: ['Planner cria direção', 'QA valida interface', 'Repair corrige falhas'],
  },
}

const screenshotMeta = {
  'retailflow-dashboard-01': {
    label: 'Visão geral',
    caption: 'Visão principal com métricas, atalhos e leitura rápida do estado da operação.',
    featured: true,
  },
  'retailflow-dashboard-02': {
    label: 'Clientes',
    caption: 'Gestão de clientes com foco em organização de base e consulta direta.',
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
    label: 'Relatórios',
    caption: 'Painel analítico para leitura de performance e tomada de decisão.',
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
              artefato de portfólio
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

function ScreenshotLightbox({ shots, activeIndex, onClose, onSelect }) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = event => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onSelect((activeIndex + 1) % shots.length)
      if (event.key === 'ArrowLeft') onSelect((activeIndex - 1 + shots.length) % shots.length)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, onClose, onSelect, shots.length])

  const activeShot = shots[activeIndex]

  if (!activeShot) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(3,3,4,.92)] px-4 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.992 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={event => event.stopPropagation()}
          className="relative w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[#f4efe7]/10 bg-[#090909]"
        >
          <div className="flex items-center justify-between border-b border-[#f4efe7]/10 px-5 py-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#c7a15a]">
                Prévia expandida
              </p>
              <p className="mt-2 text-lg font-semibold text-[#f4efe7]">{activeShot.label}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#f4efe7]/10 bg-[#111111] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d8d0c3] transition hover:border-[#c7a15a]/35 hover:text-[#f4efe7]"
            >
              Fechar
            </button>
          </div>

          <div className="grid gap-4 p-4 lg:grid-cols-[1.25fr_0.34fr]">
            <div className="overflow-hidden rounded-[1.65rem] border border-[#f4efe7]/10 bg-[radial-gradient(circle_at_top,rgba(244,239,231,.04),rgba(5,5,5,.96)_68%)] p-4">
              <img
                src={activeShot.source}
                alt={activeShot.label}
                className="max-h-[72vh] w-full rounded-[1.2rem] object-contain object-top"
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="rounded-[1.5rem] border border-[#f4efe7]/10 bg-[#101010] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8f877b]">
                  Contexto
                </p>
                <p className="mt-3 text-sm leading-7 text-[#d8d0c3]">{activeShot.caption}</p>
              </div>

              <div className="grid gap-3">
                {shots.map((shot, shotIndex) => {
                  const selected = shotIndex === activeIndex

                  return (
                    <button
                      key={shot.source}
                      type="button"
                      onClick={() => onSelect(shotIndex)}
                      className={`overflow-hidden rounded-[1.3rem] border text-left transition ${
                        selected
                          ? 'border-[#c7a15a]/35 bg-[#12110f]'
                          : 'border-[#f4efe7]/10 bg-[#0d0d0d] hover:border-[#f4efe7]/20'
                      }`}
                    >
                      <div className="border-b border-[#f4efe7]/10 bg-[#090909] p-2">
                        <img
                          src={shot.source}
                          alt={shot.label}
                          className="aspect-[16/10] w-full rounded-[0.9rem] object-contain object-top"
                        />
                      </div>
                      <div className="px-3 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c7a15a]">
                          {shot.label}
                        </p>
                        <p className="mt-2 text-xs leading-6 text-[#a89f91]">{shot.caption}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    setActiveIndex(0)
    setLightboxOpen(false)
  }, [featuredShots])

  const activeShot = featuredShots[activeIndex] ?? featuredShots[0]

  return (
    <>
      <div className="mt-6 space-y-4">
        <div className="overflow-hidden rounded-[2rem] border border-[#f4efe7]/10 bg-[#070707] shadow-[0_24px_80px_rgba(0,0,0,.34)]">
          <div className="grid gap-0 lg:grid-cols-[1.18fr_0.48fr]">
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="group border-b border-[#f4efe7]/10 bg-[radial-gradient(circle_at_top,rgba(244,239,231,.04),rgba(5,5,5,.96)_72%)] p-3 text-left transition hover:bg-[radial-gradient(circle_at_top,rgba(244,239,231,.06),rgba(5,5,5,.96)_72%)] lg:border-b-0 lg:border-r"
              aria-label={`Expandir screenshot ${activeShot.label}`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeShot.source}
                  initial={motionEnabled ? { opacity: 0.82, scale: 1.01 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={motionEnabled ? { opacity: 0.84, scale: 0.995 } : undefined}
                  transition={{ duration: motionEnabled ? 0.28 : 0 }}
                  className="relative aspect-[16/10] overflow-hidden rounded-[1.55rem] border border-[#f4efe7]/10 bg-[#080808] p-3"
                >
                  <img
                    src={activeShot.source}
                    alt={`RetailFlow ${activeShot.label}`}
                    className="h-full w-full rounded-[1rem] object-contain object-top transition duration-500 group-hover:scale-[1.012]"
                    loading="eager"
                    decoding="async"
                  />
                </motion.div>
              </AnimatePresence>
            </button>

            <div className="flex flex-col justify-between gap-5 px-5 py-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#c7a15a]">
                  Interface RetailFlow
                </p>
                <h4 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#f4efe7]">
                  {activeShot.label}
                </h4>
                <p className="mt-4 text-sm leading-7 text-[#d8d0c3]">{activeShot.caption}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="rounded-full border border-[#f4efe7]/10 bg-[#121212] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f4efe7] transition hover:border-[#c7a15a]/35 hover:bg-[#171512]"
                >
                  Expandir
                </button>
                <span className="rounded-full border border-[#f4efe7]/10 bg-[#0d0d0d] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8f877b]">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(featuredShots.length).padStart(2, '0')}
                </span>
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
                className={`overflow-hidden rounded-[1.45rem] border bg-[#090909] text-left shadow-[0_18px_60px_rgba(0,0,0,.22)] transition ${
                  selected
                    ? 'border-[#c7a15a]/35 bg-[#0e0d0b]'
                    : 'border-[#f4efe7]/10 hover:border-[#f4efe7]/20'
                }`}
                aria-label={`Abrir screenshot ${shot.label}`}
              >
                <div className="border-b border-[#f4efe7]/10 bg-[#070707] p-2">
                  <img
                    src={shot.source}
                    alt={shot.label}
                    className="aspect-[16/10] w-full rounded-[1rem] object-contain object-top"
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

      {lightboxOpen && (
        <ScreenshotLightbox
          shots={featuredShots}
          activeIndex={activeIndex}
          onClose={() => setLightboxOpen(false)}
          onSelect={setActiveIndex}
        />
      )}
    </>
  )
}

export default function ProjectMockup({ project, index = 0 }) {
  const performance = usePerformanceProfile()
  const item = mockups[project?.slug] ?? mockups.jarvis
  const screenshots = project?.screenshots ?? []
  const hasRealScreenshots = screenshots.length > 0
  const frameGlowStyle = {
    background:
      'radial-gradient(circle at 84% 16%, var(--project-accent), transparent 24%), radial-gradient(circle at 14% 84%, var(--project-secondary), transparent 26%), linear-gradient(145deg, rgba(244,239,231,0.02), transparent 36%, var(--project-tint))',
  }
  const shellStyle = {
    background:
      'linear-gradient(180deg, rgba(11,10,8,0.95), rgba(6,6,6,0.96)), radial-gradient(circle at top right, var(--project-tint), transparent 42%)',
  }

  return (
    <motion.div
      initial={performance.motionEnabled ? { opacity: 0, y: 20, scale: 0.99 } : false}
      whileInView={performance.motionEnabled ? { opacity: 1, y: 0, scale: 1 } : undefined}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: performance.sceneDuration,
        delay: performance.motionEnabled ? 0.08 : 0,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={
        performance.hoverLift
          ? {
              y: -Math.max(2, performance.hoverLift - 3),
              rotateX: performance.mockupTilt ? 1.2 : 0,
              rotateY: performance.mockupTilt ? (index % 2 === 0 ? -1.6 : 1.6) : 0,
              scale: performance.hoverScale,
            }
          : undefined
      }
      className="relative min-h-[360px] overflow-hidden rounded-[2.2rem] border border-[#f4efe7]/10 bg-[#050505]/90 p-4 shadow-[0_45px_140px_rgba(0,0,0,.62)] [transform-style:preserve-3d]"
    >
      <div className="absolute inset-0" style={frameGlowStyle} />

      <div className="relative rounded-[1.7rem] border border-[#f4efe7]/10 p-5 sm:p-6" style={shellStyle}>
        <div className="flex items-center justify-between border-b border-[#f4efe7]/10 pb-4">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#c7a15a]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#f4efe7]/35" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#9b5e32]/80" />
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#c7a15a]">
            {hasRealScreenshots ? 'visuais reais' : 'frame conceitual'}
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
                className="rounded-2xl border border-[#f4efe7]/10 bg-[#050505]/72 p-3 text-center"
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
