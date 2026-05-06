import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'mjr-performance-mode'
const FPS_LOW_THRESHOLD = 42
const FPS_SAMPLE_SIZE = 90

const MODES = [
  { value: 'auto', label: 'Auto' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Med' },
  { value: 'high', label: 'High' },
]

export function detectPerformanceMode(fps = null) {
  if (typeof window === 'undefined') return 'medium'

  const memory = navigator.deviceMemory || 4
  const cores = navigator.hardwareConcurrency || 4
  const width = window.innerWidth || 1024
  const dpr = window.devicePixelRatio || 1
  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

  if (reducedMotion) return 'low'
  if (fps && fps < FPS_LOW_THRESHOLD) return 'low'
  if (isMobile) return 'low'
  if (memory <= 4 || cores <= 4) return 'low'
  if (isTablet || dpr > 2.5) return 'medium'
  if (memory >= 8 && cores >= 8 && width >= 1200 && (!fps || fps >= 52)) return 'high'

  return 'medium'
}

function useFpsMonitor(enabled) {
  const [fps, setFps] = useState(null)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return undefined

    let raf = 0
    let last = performance.now()
    const samples = []

    const tick = now => {
      const delta = now - last
      last = now

      if (delta > 0) samples.push(1000 / delta)

      if (samples.length >= FPS_SAMPLE_SIZE) {
        const avg = Math.round(samples.reduce((sum, value) => sum + value, 0) / samples.length)
        setFps(avg)
        samples.length = 0
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [enabled])

  return fps
}

export function usePerformanceMode() {
  const [mode, setModeState] = useState(() => {
    if (typeof window === 'undefined') return 'auto'
    return localStorage.getItem(STORAGE_KEY) || 'auto'
  })

  const fps = useFpsMonitor(mode === 'auto')
  const [autoMode, setAutoMode] = useState(() => detectPerformanceMode())

  useEffect(() => {
    const update = () => setAutoMode(detectPerformanceMode(fps))
    update()

    window.addEventListener('resize', update, { passive: true })

    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    media?.addEventListener?.('change', update)

    return () => {
      window.removeEventListener('resize', update)
      media?.removeEventListener?.('change', update)
    }
  }, [fps])

  const setMode = nextMode => {
    setModeState(nextMode)
    localStorage.setItem(STORAGE_KEY, nextMode)
  }

  const resolvedMode = useMemo(() => {
    return mode === 'auto' ? autoMode : mode
  }, [mode, autoMode])

  return { mode, setMode, resolvedMode, autoMode, fps }
}

export default function PerformanceModeToggle({ mode, setMode, resolvedMode, fps }) {
  const [open, setOpen] = useState(false)
  const lowAuto = mode === 'auto' && resolvedMode === 'low'

  return (
    <div className="fixed bottom-4 right-4 z-[80] max-w-[calc(100vw-2rem)]">
      {lowAuto && (
        <div className="mb-2 rounded-2xl border border-cyan-300/20 bg-black/55 px-3 py-2 text-[11px] font-bold text-cyan-100 shadow-2xl shadow-black/40 backdrop-blur-xl">
          Modo Low ativado para melhor fluidez.
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        className="ml-auto flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/25 bg-black/55 text-xs font-black uppercase text-cyan-100 shadow-2xl shadow-black/40 backdrop-blur-xl md:hidden"
        aria-label="Alternar modo de performance"
      >
        {resolvedMode.slice(0, 1).toUpperCase()}
      </button>

      <div className={`${open ? 'mt-2 block' : 'hidden'} rounded-2xl border border-white/10 bg-black/50 px-3 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl md:block`}>
        <div className="mb-2 flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/55">
          <span>Performance</span>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-cyan-200">
            {resolvedMode}{fps ? ` · ${fps}fps` : ''}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {MODES.map(item => {
            const active = mode === item.value
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setMode(item.value)}
                className={`rounded-xl px-2.5 py-1.5 text-xs font-black transition ${active ? 'border border-cyan-300/40 bg-cyan-300/15 text-cyan-100 shadow-lg shadow-cyan-500/10' : 'border border-white/10 bg-white/[0.03] text-white/55 hover:border-white/20 hover:bg-white/[0.07] hover:text-white/80'}`}
                aria-pressed={active}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
