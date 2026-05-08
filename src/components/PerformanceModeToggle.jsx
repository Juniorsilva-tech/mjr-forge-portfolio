import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import {
  AUTO_PERFORMANCE_CONFIG,
  clampAutoMode,
  getAutoPerformanceTarget,
  getInitialAutoMode,
  isMeaningfulAutoShift,
  readPerformanceSignals,
} from '../lib/performance.js'

const STORAGE_KEY = 'mjr-performance-mode'
const FPS_SERVER_SNAPSHOT = () => null

const MODES = [
  { value: 'auto', label: 'Auto' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Med' },
  { value: 'high', label: 'High' },
]

export function detectPerformanceMode() {
  return clampAutoMode(getInitialAutoMode())
}

const fpsMonitorStore = {
  fps: null,
  frameCount: 0,
  frameSum: 0,
  lastFrameAt: 0,
  listeners: new Set(),
  rafId: 0,
  sampleStartedAt: 0,
}

function getFpsSnapshot() {
  return fpsMonitorStore.fps
}

function emitFps(nextFps) {
  if (fpsMonitorStore.fps === nextFps) return
  fpsMonitorStore.fps = nextFps
  fpsMonitorStore.listeners.forEach(listener => listener())
}

function resetFpsMonitorState() {
  fpsMonitorStore.frameCount = 0
  fpsMonitorStore.frameSum = 0
  fpsMonitorStore.lastFrameAt = 0
  fpsMonitorStore.sampleStartedAt = 0
}

function stopFpsMonitor() {
  if (fpsMonitorStore.rafId) {
    window.cancelAnimationFrame(fpsMonitorStore.rafId)
    fpsMonitorStore.rafId = 0
  }

  resetFpsMonitorState()

  if (fpsMonitorStore.fps !== null) {
    emitFps(null)
  }
}

function stepFpsMonitor(now) {
  if (!fpsMonitorStore.sampleStartedAt) {
    fpsMonitorStore.sampleStartedAt = now
    fpsMonitorStore.lastFrameAt = now
    fpsMonitorStore.rafId = window.requestAnimationFrame(stepFpsMonitor)
    return
  }

  const delta = now - fpsMonitorStore.lastFrameAt
  fpsMonitorStore.lastFrameAt = now

  if (delta > 0 && delta < 1000) {
    fpsMonitorStore.frameSum += 1000 / delta
    fpsMonitorStore.frameCount += 1
  }

  if (now - fpsMonitorStore.sampleStartedAt >= AUTO_PERFORMANCE_CONFIG.measurementIntervalMs) {
    const nextFps =
      fpsMonitorStore.frameCount > 0
        ? Math.round(fpsMonitorStore.frameSum / fpsMonitorStore.frameCount)
        : null

    emitFps(nextFps)
    fpsMonitorStore.sampleStartedAt = now
    fpsMonitorStore.frameSum = 0
    fpsMonitorStore.frameCount = 0
  }

  fpsMonitorStore.rafId = window.requestAnimationFrame(stepFpsMonitor)
}

function ensureFpsMonitor() {
  if (typeof window === 'undefined') return
  if (fpsMonitorStore.rafId || fpsMonitorStore.listeners.size === 0) return

  resetFpsMonitorState()
  fpsMonitorStore.rafId = window.requestAnimationFrame(stepFpsMonitor)
}

function subscribeToFps(listener) {
  fpsMonitorStore.listeners.add(listener)
  ensureFpsMonitor()

  return () => {
    fpsMonitorStore.listeners.delete(listener)
    if (fpsMonitorStore.listeners.size === 0) {
      stopFpsMonitor()
    }
  }
}

export function usePerformanceFps(enabled) {
  const subscribe = useMemo(() => (enabled ? subscribeToFps : () => () => {}), [enabled])
  const getSnapshot = useMemo(() => (enabled ? getFpsSnapshot : FPS_SERVER_SNAPSHOT), [enabled])

  return useSyncExternalStore(subscribe, getSnapshot, FPS_SERVER_SNAPSHOT)
}

export function usePerformanceMode() {
  const [mode, setModeState] = useState(() => {
    if (typeof window === 'undefined') return 'auto'
    return localStorage.getItem(STORAGE_KEY) || 'auto'
  })
  const [resolvedMode, setResolvedMode] = useState(() => detectPerformanceMode())
  const resolvedModeRef = useRef(resolvedMode)
  const switchCooldownRef = useRef(0)
  const streakModeRef = useRef(null)
  const streakCountRef = useRef(0)

  useEffect(() => {
    resolvedModeRef.current = resolvedMode
  }, [resolvedMode])

  useEffect(() => {
    if (mode !== 'auto') {
      streakModeRef.current = null
      streakCountRef.current = 0
      switchCooldownRef.current = 0
      setResolvedMode(current => (current === mode ? current : mode))
      return undefined
    }

    if (typeof window === 'undefined') return undefined

    const applyResolvedMode = nextMode => {
      setResolvedMode(current => {
        if (current === nextMode) return current
        resolvedModeRef.current = nextMode
        return nextMode
      })
    }

    const syncSignals = () => {
      const signals = readPerformanceSignals()
      const current = resolvedModeRef.current
      const next = clampAutoMode(current, signals)

      streakModeRef.current = null
      streakCountRef.current = 0
      applyResolvedMode(next)
    }

    const handleMeasurement = () => {
      const fps = getFpsSnapshot()
      const signals = readPerformanceSignals()
      const currentMode = clampAutoMode(
        resolvedModeRef.current || getInitialAutoMode(signals),
        signals,
      )

      if (currentMode !== resolvedModeRef.current) {
        streakModeRef.current = null
        streakCountRef.current = 0
        applyResolvedMode(currentMode)
        return
      }

      const nextTarget = clampAutoMode(getAutoPerformanceTarget(fps), signals)

      if (
        !nextTarget ||
        nextTarget === currentMode ||
        !isMeaningfulAutoShift(currentMode, nextTarget, fps)
      ) {
        streakModeRef.current = null
        streakCountRef.current = 0
        return
      }

      if (
        performance.now() - switchCooldownRef.current <
        AUTO_PERFORMANCE_CONFIG.switchCooldownMs
      ) {
        streakModeRef.current = null
        streakCountRef.current = 0
        return
      }

      if (streakModeRef.current === nextTarget) {
        streakCountRef.current += 1
      } else {
        streakModeRef.current = nextTarget
        streakCountRef.current = 1
      }

      const requiredSamples = AUTO_PERFORMANCE_CONFIG.requiredSamples[nextTarget]
      if (streakCountRef.current < requiredSamples) return

      streakModeRef.current = null
      streakCountRef.current = 0
      switchCooldownRef.current = performance.now()
      applyResolvedMode(nextTarget)
    }

    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    switchCooldownRef.current = 0
    applyResolvedMode(clampAutoMode(getInitialAutoMode(readPerformanceSignals())))

    const unsubscribe = subscribeToFps(handleMeasurement)

    window.addEventListener('resize', syncSignals, { passive: true })
    media?.addEventListener?.('change', syncSignals)

    return () => {
      unsubscribe()
      window.removeEventListener('resize', syncSignals)
      media?.removeEventListener?.('change', syncSignals)
    }
  }, [mode])

  const setMode = nextMode => {
    setModeState(nextMode)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, nextMode)
    }
  }

  return { mode, setMode, resolvedMode }
}

export default function PerformanceModeToggle({ mode, setMode, resolvedMode }) {
  const [open, setOpen] = useState(false)
  const fps = usePerformanceFps(mode === 'auto')
  const isAutoLow = mode === 'auto' && resolvedMode === 'low'

  return (
    <div className="fixed bottom-4 right-4 z-[80] max-w-[calc(100vw-2rem)]">
      {isAutoLow && (
        <div className="mb-2 max-w-[280px] rounded-[1.35rem] border border-[#f4efe7]/10 bg-[#0a0907]/96 px-3.5 py-2.5 text-[11px] font-semibold text-[#d8d0c3] shadow-[0_18px_45px_rgba(0,0,0,.35)]">
          Auto priorizou fluidez neste dispositivo.
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(current => !current)}
        className="ml-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#f4efe7]/10 bg-[#0a0907]/96 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f4efe7] shadow-[0_18px_45px_rgba(0,0,0,.35)] md:hidden"
        aria-label="Alternar modo de performance"
        aria-expanded={open}
      >
        {resolvedMode.slice(0, 1).toUpperCase()}
      </button>

      <div
        className={`${open ? 'mt-2 block' : 'hidden'} rounded-[1.6rem] border border-[#f4efe7]/10 bg-[#0a0907]/96 px-3 py-3 shadow-[0_22px_60px_rgba(0,0,0,.4)] md:block`}
      >
        <div className="mb-3 flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8f877b]">
          <span>Performance</span>
          <span className="rounded-full border border-[#f4efe7]/10 bg-[#f4efe7]/5 px-2.5 py-1 text-[#c7a15a]">
            {resolvedMode}
            {fps ? ` - ${fps}fps` : ''}
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
