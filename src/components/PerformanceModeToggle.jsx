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
  if (isTablet || dpr > 2.2) return 'medium'
  if (memory >= 8 && cores >= 8 && width >= 1280 && (!fps || fps >= 52)) return 'high'

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
        const average = Math.round(samples.reduce((sum, value) => sum + value, 0) / samples.length)
        setFps(average)
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
    if (typeof window === 'undefined') return undefined

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
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, nextMode)
    }
  }

  const resolvedMode = useMemo(() => (mode === 'auto' ? autoMode : mode), [mode, autoMode])

  return { mode, setMode, resolvedMode, autoMode, fps }
}

export default function PerformanceModeToggle({ mode, setMode, resolvedMode, fps }) {
  const [open, setOpen] = useState(false)
  const isAutoLow = mode === 'auto' && resolvedMode === 'low'

  return (
    <div className="fixed bottom-4 right-4 z-[80] max-w-[calc(100vw-2rem)]">
      {isAutoLow && (
        <div className="mb-2 max-w-[280px] rounded-[1.35rem] border border-[#f4efe7]/10 bg-[#0a0907]/88 px-3.5 py-2.5 text-[11px] font-semibold text-[#d8d0c3] shadow-[0_18px_45px_rgba(0,0,0,.35)] backdrop-blur-[var(--forge-panel-blur)]">
          Auto priorizou fluidez neste dispositivo.
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(current => !current)}
        className="ml-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#f4efe7]/10 bg-[#0a0907]/88 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f4efe7] shadow-[0_18px_45px_rgba(0,0,0,.35)] backdrop-blur-[var(--forge-panel-blur)] md:hidden"
        aria-label="Alternar modo de performance"
        aria-expanded={open}
      >
        {resolvedMode.slice(0, 1).toUpperCase()}
      </button>

      <div
        className={`${open ? 'mt-2 block' : 'hidden'} rounded-[1.6rem] border border-[#f4efe7]/10 bg-[#0a0907]/90 px-3 py-3 shadow-[0_22px_60px_rgba(0,0,0,.4)] backdrop-blur-[var(--forge-panel-blur)] md:block`}
      >
        <div className="mb-3 flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8f877b]">
          <span>Performance</span>
          <span className="rounded-full border border-[#f4efe7]/10 bg-[#f4efe7]/5 px-2.5 py-1 text-[#c7a15a]">
            {resolvedMode}
            {fps ? ` · ${fps}fps` : ''}
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
                className={`rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'border-[#c7a15a]/35 bg-[#c7a15a]/12 text-[#f4efe7]'
                    : 'border-[#f4efe7]/10 bg-[#f4efe7]/[0.03] text-[#8f877b] hover:border-[#f4efe7]/20 hover:bg-[#f4efe7]/[0.05] hover:text-[#d8d0c3]'
                }`}
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
