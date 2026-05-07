import { createContext, useContext } from 'react'

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
    grainEnabled: true,
    grainOpacity: 0.22,
    grainSoftOpacity: 0.12,
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
    grainEnabled: true,
    grainOpacity: 0.38,
    grainSoftOpacity: 0.24,
    dynamicLight: true,
    cursorEnabled: true,
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
