import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'mjr-performance-mode'

const MODES = [
  { value: 'auto', label: 'Auto' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

export function detectPerformanceMode() {
  if (typeof window === 'undefined') return 'medium'

  const memory = navigator.deviceMemory || 4
  const cores = navigator.hardwareConcurrency || 4
  const width = window.innerWidth || 1024
  const dpr = window.devicePixelRatio || 1
  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

  if (reducedMotion) return 'low'
  if (isMobile) return 'low'
  if (memory <= 4 || cores <= 4) return 'low'
  if (isTablet || dpr > 2.5) return 'medium'
  if (memory >= 8 && cores >= 8 && width >= 1200) return 'high'

  return 'medium'
}

export function usePerformanceMode() {
  const [mode, setModeState] = useState(() => {
    if (typeof window === 'undefined') return 'auto'
    return localStorage.getItem(STORAGE_KEY) || 'auto'
  })

  const [autoMode, setAutoMode] = useState(() => detectPerformanceMode())

  useEffect(() => {
    const update = () => setAutoMode(detectPerformanceMode())
    update()

    window.addEventListener('resize', update, { passive: true })

    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    media?.addEventListener?.('change', update)

    return () => {
      window.removeEventListener('resize', update)
      media?.removeEventListener?.('change', update)
    }
  }, [])

  const setMode = nextMode => {
    setModeState(nextMode)
    localStorage.setItem(STORAGE_KEY, nextMode)
  }

  const resolvedMode = useMemo(() => {
    return mode === 'auto' ? autoMode : mode
  }, [mode, autoMode])

  return { mode, setMode, resolvedMode, autoMode }
}

export default function PerformanceModeToggle({ mode, setMode, resolvedMode }) {
  return (
    <div className="fixed bottom-4 right-4 z-[80] max-w-[calc(100vw-2rem)]">
      <div className="rounded-2xl border border-white/10 bg-black/45 px-3 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="mb-2 flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/55">
          <span>Performance</span>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-cyan-200">
            {resolvedMode}
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
