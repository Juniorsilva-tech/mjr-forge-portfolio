import { createContext, useContext } from 'react'

export const AUTO_PERFORMANCE_CONFIG = {
  measurementIntervalMs: 2000,
  switchCooldownMs: 4000,
  thresholds: {
    low: 35,
    mediumMax: 50,
    high: 55,
  },
  requiredSamples: {
    low: 3,
    medium: 3,
    high: 4,
  },
  transitionGuard: {
    lowToMediumMin: 38,
    mediumToLowMax: 33,
    mediumToHighMin: 58,
    highToMediumMax: 48,
  },
}

export function readPerformanceSignals() {
  if (typeof window === 'undefined') {
    return {
      cores: 4,
      dpr: 1,
      isMobile: false,
      isTablet: false,
      memory: 4,
      prefersReducedMotion: false,
      width: 1024,
    }
  }

  const width = window.innerWidth || 1024

  return {
    memory: navigator.deviceMemory || 4,
    cores: navigator.hardwareConcurrency || 4,
    width,
    dpr: window.devicePixelRatio || 1,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    prefersReducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false,
  }
}

export function getInitialAutoMode(signals = readPerformanceSignals()) {
  if (signals.prefersReducedMotion) return 'low'

  if (signals.isMobile) {
    if (signals.memory >= 6 && signals.cores >= 6 && signals.dpr <= 3) {
      return 'medium'
    }

    return 'low'
  }

  if (signals.memory <= 4 || signals.cores <= 4) return 'low'
  if (signals.isTablet || signals.dpr > 2.2) return 'medium'
  if (signals.memory >= 8 && signals.cores >= 8 && signals.width >= 1280) return 'high'

  return 'medium'
}

export function clampAutoMode(mode, signals = readPerformanceSignals()) {
  if (signals.prefersReducedMotion) return 'low'
  if (signals.isMobile && mode === 'high') return 'medium'

  return mode
}

export function getAutoPerformanceTarget(fps) {
  if (typeof fps !== 'number') return null

  if (fps < AUTO_PERFORMANCE_CONFIG.thresholds.low) return 'low'
  if (fps <= AUTO_PERFORMANCE_CONFIG.thresholds.mediumMax) return 'medium'
  if (fps > AUTO_PERFORMANCE_CONFIG.thresholds.high) return 'high'

  return null
}

export function isMeaningfulAutoShift(currentMode, nextMode, fps) {
  if (!currentMode || !nextMode || currentMode === nextMode || typeof fps !== 'number') {
    return false
  }

  const { transitionGuard } = AUTO_PERFORMANCE_CONFIG

  if (currentMode === 'low' && nextMode === 'medium') return fps >= transitionGuard.lowToMediumMin
  if (currentMode === 'medium' && nextMode === 'low') return fps <= transitionGuard.mediumToLowMax
  if (currentMode === 'medium' && nextMode === 'high') return fps >= transitionGuard.mediumToHighMin
  if (currentMode === 'high' && nextMode === 'medium') return fps <= transitionGuard.highToMediumMax

  return true
}

export const PERFORMANCE_PROFILES = {
  low: {
    key: 'low',
    motionEnabled: false,
    sceneDuration: 0.01,
    sceneDelayFactor: 0,
    viewportAmount: 0.12,
    overlayOpacity: 0.72,
    decorativeOpacity: 0.42,
    grainEnabled: false,
    grainOpacity: 0,
    grainSoftOpacity: 0,
    dynamicLight: false,
    cursorEnabled: false,
    hoverLift: 0,
    hoverScale: 1,
    mockupTilt: false,
    atmosphereMotion: false,
    cssVariables: {
      '--forge-panel-blur': '10px',
      '--forge-depth-blur-far': '10px',
      '--forge-depth-blur-near': '6px',
      '--forge-depth-shadow': '0 0 88px rgba(0, 0, 0, 0.38)',
      '--forge-card-shadow': '0 28px 82px rgba(0, 0, 0, 0.32)',
      '--forge-card-hover-shadow': '0 34px 88px rgba(0, 0, 0, 0.34)',
      '--forge-hover-lift': '0px',
      '--forge-hover-scale': '1',
      '--forge-light-orb-opacity': '0',
      '--forge-light-orb-blur': '0px',
      '--forge-light-secondary-opacity': '0.12',
      '--forge-light-secondary-blur': '10px',
      '--forge-grain-opacity': '0',
      '--forge-grain-soft-opacity': '0',
      '--forge-section-line-opacity': '0.05',
      '--forge-decorative-opacity': '0.42',
      '--forge-surface-glow-opacity': '0.03',
      '--forge-shadow-strength': '0.84',
      '--forge-camera-pan-x': '0px',
      '--forge-camera-pan-y': '0px',
      '--forge-camera-scale': '1',
      '--forge-journey-progress': '0',
      '--forge-scene-shift': '0px',
      '--forge-scene-travel-y': '0px',
      '--forge-scene-travel-z': '12px',
      '--forge-scene-rotate-y': '0deg',
      '--forge-scene-rotate-x': '0deg',
      '--forge-scene-blur': '2px',
      '--forge-scene-dissolve-strength': '0.05',
    },
  },
  medium: {
    key: 'medium',
    motionEnabled: true,
    sceneDuration: 0.54,
    sceneDelayFactor: 0.72,
    viewportAmount: 0.18,
    overlayOpacity: 0.84,
    decorativeOpacity: 0.68,
    grainEnabled: false,
    grainOpacity: 0,
    grainSoftOpacity: 0,
    dynamicLight: true,
    cursorEnabled: false,
    hoverLift: 4,
    hoverScale: 1.004,
    mockupTilt: false,
    atmosphereMotion: false,
    cssVariables: {
      '--forge-panel-blur': '18px',
      '--forge-depth-blur-far': '16px',
      '--forge-depth-blur-near': '8px',
      '--forge-depth-shadow': '0 0 120px rgba(0, 0, 0, 0.44)',
      '--forge-card-shadow': '0 36px 108px rgba(0, 0, 0, 0.38)',
      '--forge-card-hover-shadow': '0 48px 124px rgba(0, 0, 0, 0.44)',
      '--forge-hover-lift': '-6px',
      '--forge-hover-scale': '1.008',
      '--forge-light-orb-opacity': '0.48',
      '--forge-light-orb-blur': '12px',
      '--forge-light-secondary-opacity': '0.28',
      '--forge-light-secondary-blur': '14px',
      '--forge-grain-opacity': '0.22',
      '--forge-grain-soft-opacity': '0.12',
      '--forge-section-line-opacity': '0.07',
      '--forge-decorative-opacity': '0.68',
      '--forge-surface-glow-opacity': '0.06',
      '--forge-shadow-strength': '1',
      '--forge-camera-pan-x': '0px',
      '--forge-camera-pan-y': '0px',
      '--forge-camera-scale': '1',
      '--forge-journey-progress': '0',
      '--forge-scene-shift': '18px',
      '--forge-scene-travel-y': '14px',
      '--forge-scene-travel-z': '42px',
      '--forge-scene-rotate-y': '1deg',
      '--forge-scene-rotate-x': '0.45deg',
      '--forge-scene-blur': '8px',
      '--forge-scene-dissolve-strength': '0.18',
    },
  },
  high: {
    key: 'high',
    motionEnabled: true,
    sceneDuration: 0.72,
    sceneDelayFactor: 1,
    viewportAmount: 0.22,
    overlayOpacity: 1,
    decorativeOpacity: 1,
    grainEnabled: false,
    grainOpacity: 0,
    grainSoftOpacity: 0,
    dynamicLight: true,
    cursorEnabled: false,
    hoverLift: 8,
    hoverScale: 1.012,
    mockupTilt: true,
    atmosphereMotion: true,
    cssVariables: {
      '--forge-panel-blur': '24px',
      '--forge-depth-blur-far': '20px',
      '--forge-depth-blur-near': '10px',
      '--forge-depth-shadow': '0 0 180px rgba(0, 0, 0, 0.55)',
      '--forge-card-shadow': '0 42px 120px rgba(0, 0, 0, 0.42)',
      '--forge-card-hover-shadow': '0 56px 150px rgba(0, 0, 0, 0.55)',
      '--forge-hover-lift': '-8px',
      '--forge-hover-scale': '1.01',
      '--forge-light-orb-opacity': '0.72',
      '--forge-light-orb-blur': '14px',
      '--forge-light-secondary-opacity': '0.55',
      '--forge-light-secondary-blur': '22px',
      '--forge-grain-opacity': '0.38',
      '--forge-grain-soft-opacity': '0.24',
      '--forge-section-line-opacity': '0.08',
      '--forge-decorative-opacity': '1',
      '--forge-surface-glow-opacity': '0.08',
      '--forge-shadow-strength': '1.08',
      '--forge-camera-pan-x': '0px',
      '--forge-camera-pan-y': '0px',
      '--forge-camera-scale': '1',
      '--forge-journey-progress': '0',
      '--forge-scene-shift': '28px',
      '--forge-scene-travel-y': '20px',
      '--forge-scene-travel-z': '76px',
      '--forge-scene-rotate-y': '1.75deg',
      '--forge-scene-rotate-x': '0.7deg',
      '--forge-scene-blur': '12px',
      '--forge-scene-dissolve-strength': '0.26',
    },
  },
}

export function getPerformanceProfile(
  resolvedMode,
  { prefersReducedMotion = false, isCompactViewport = false } = {},
) {
  if (prefersReducedMotion) {
    return PERFORMANCE_PROFILES.low
  }

  if (isCompactViewport && resolvedMode === 'high') {
    return PERFORMANCE_PROFILES.medium
  }

  return PERFORMANCE_PROFILES[resolvedMode] ?? PERFORMANCE_PROFILES.medium
}

export const PerformanceProfileContext = createContext(PERFORMANCE_PROFILES.medium)

export function usePerformanceProfile() {
  return useContext(PerformanceProfileContext)
}
