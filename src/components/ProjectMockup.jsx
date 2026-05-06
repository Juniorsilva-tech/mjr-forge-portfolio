import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const mockups = {
  princessmel: {
    title: 'Princessmel Editorial',
    subtitle: 'moda cristã • WhatsApp • vitrine',
    stats: [
      ['01', 'brand'],
      ['24h', 'lead'],
      ['CTA', 'direct'],
    ],
    lines: ['Curadoria visual', 'Produtos em destaque', 'Contato sem fricção'],
  },
  retailflow: {
    title: 'RetailFlow SaaS',
    subtitle: 'clientes • pedidos • financeiro',
    stats: [
      ['5', 'areas'],
      ['real', 'shots'],
      ['SaaS', 'flow'],
    ],
    lines: ['Dashboard operacional', 'Visão comercial clara', 'Painéis prontos para uso real'],
  },
  jarvis: {
    title: 'Jarvis Workflow',
    subtitle: 'generate • QA • repair',
    stats: [
      ['90', 'score'],
      ['6', 'shots'],
      ['PASS', 'build'],
    ],
    lines: ['Planner cria direção', 'QA valida interface', 'Repair corrige falhas'],
  },
}

const screenshotLabels = {
  overview: 'Overview',
  clientes: 'Clientes',
  pedidos: 'Pedidos',
  financeiro: 'Financeiro',
  relatorios: 'Relatorios',
}

function useAvailableScreenshots(sources) {
  const [availableSources, setAvailableSources] = useState([])

  useEffect(() => {
    if (typeof window === 'undefined' || sources.length === 0) {
      setAvailableSources([])
      return undefined
    }

    let cancelled = false

    Promise.all(
      sources.map(
        source =>
          new Promise(resolve => {
            const image = new window.Image()

            image.onload = () => resolve({ source, ok: true })
            image.onerror = () => resolve({ source, ok: false })
            image.src = source
          }),
      ),
    ).then(results => {
      if (!cancelled) {
        setAvailableSources(results.filter(result => result.ok).map(result => result.source))
      }
    })

    return () => {
      cancelled = true
    }
  }, [sources])

  return availableSources
}

function getScreenshotLabel(source) {
  const name = source.split('/').pop()?.replace('.png', '') ?? ''
  return screenshotLabels[name] ?? 'Painel'
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

function FallbackLayout({ item }) {
  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        {item.lines.map((line, lineIndex) => (
          <motion.div
            key={line}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: lineIndex * 0.08 }}
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
              cinematic fallback
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

function ScreenshotLayout({ screenshots }) {
  const secondaryShots = screenshots.slice(1, 4)
  const placeholderCount = Math.max(0, 3 - secondaryShots.length)

  return (
    <div className="mt-6 grid gap-3 xl:grid-cols-[minmax(0,1.22fr)_minmax(220px,.72fr)]">
      <div className="relative overflow-hidden rounded-[1.9rem] border border-[#f4efe7]/10 bg-[#050505]/70 shadow-[0_24px_80px_rgba(0,0,0,.38)]">
        <img
          src={screenshots[0]}
          alt="RetailFlow overview"
          className="aspect-[16/10] h-full w-full object-cover object-top"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0)_42%,rgba(5,5,5,.82)_100%)]" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#c7a15a]">
              live interface
            </p>
            <p className="mt-2 text-sm font-semibold text-[#f4efe7]">
              Painel principal com visão operacional e leitura rápida.
            </p>
          </div>
          <span className="rounded-full border border-[#f4efe7]/10 bg-[#050505]/65 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d8d0c3]">
            {getScreenshotLabel(screenshots[0])}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-1">
        {secondaryShots.map((shot, shotIndex) => (
          <motion.div
            key={shot}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: shotIndex * 0.08 }}
            className={`overflow-hidden rounded-[1.35rem] border border-[#f4efe7]/10 bg-[#050505]/72 shadow-[0_18px_60px_rgba(0,0,0,.32)] ${
              shotIndex === 1 ? 'xl:-translate-x-4' : shotIndex === 2 ? 'xl:translate-x-3' : 'xl:translate-x-5'
            }`}
          >
            <img
              src={shot}
              alt={`RetailFlow ${getScreenshotLabel(shot)}`}
              className="aspect-[16/11] w-full object-cover object-top"
              loading="lazy"
            />
            <div className="border-t border-[#f4efe7]/10 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c7a15a]">
                {getScreenshotLabel(shot)}
              </p>
            </div>
          </motion.div>
        ))}

        {Array.from({ length: placeholderCount }).map((_, placeholderIndex) => (
          <PlaceholderTile
            key={`placeholder-${placeholderIndex}`}
            label={placeholderIndex === 0 ? 'RetailFlow data' : 'RetailFlow state'}
          />
        ))}
      </div>
    </div>
  )
}

export default function ProjectMockup({ project, index = 0 }) {
  const prefersReducedMotion = useReducedMotion()
  const item = mockups[project?.slug] ?? mockups.jarvis
  const availableScreenshots = useAvailableScreenshots(project?.screenshots ?? [])
  const hasRealScreenshots = availableScreenshots.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={
        prefersReducedMotion
          ? undefined
          : {
              y: -8,
              rotateX: 2.5,
              rotateY: index % 2 === 0 ? -3.5 : 3.5,
              scale: 1.01,
            }
      }
      className="relative min-h-[320px] overflow-hidden rounded-[2.2rem] border border-[#f4efe7]/10 bg-[#050505]/80 p-4 shadow-[0_45px_140px_rgba(0,0,0,.62)] [transform-style:preserve-3d]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(244,239,231,.05),transparent_34%,rgba(199,161,90,.08))]" />
      <div className="absolute right-[-18%] top-[-20%] h-56 w-56 rounded-full bg-[#c7a15a]/10" />
      <div className="absolute bottom-[-22%] left-[-10%] h-56 w-56 rounded-full bg-[#9b5e32]/10" />

      <div className="relative rounded-[1.7rem] border border-[#f4efe7]/10 bg-[#0b0a08]/84 p-5">
        <div className="flex items-center justify-between border-b border-[#f4efe7]/10 pb-4">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#c7a15a]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#f4efe7]/35" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#9b5e32]/80" />
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#c7a15a]">
            {hasRealScreenshots ? 'real visuals' : 'artifact'}
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
          <ScreenshotLayout screenshots={availableScreenshots} />
        ) : (
          <FallbackLayout item={item} />
        )}
      </div>
    </motion.div>
  )
}
