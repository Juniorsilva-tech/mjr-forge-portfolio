import { useEffect, useRef } from 'react'

const ROOT_SCENE_VARIABLES = [
  '--forge-camera-pan-x',
  '--forge-camera-pan-y',
  '--forge-camera-scale',
  '--forge-journey-progress',
  '--forge-camera-environment-x',
  '--forge-camera-environment-y',
  '--forge-camera-structure-x',
  '--forge-camera-structure-y',
]

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function setCssNumber(node, name, value) {
  node.style.setProperty(name, value.toFixed(4))
}

function readNumberAttribute(node, name, fallback = 0) {
  const rawValue = Number.parseFloat(node.dataset[name] ?? '')

  return Number.isFinite(rawValue) ? rawValue : fallback
}

export function useSpatialJourney(performanceProfile, onSceneChange) {
  const activeSceneRef = useRef('')

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const root = document.documentElement
    let rafId = 0
    let scenes = Array.from(document.querySelectorAll('[data-forge-scene]'))
    let resizeObserver = null
    let observedScenes = []

    const syncNodes = () => {
      scenes = Array.from(document.querySelectorAll('[data-forge-scene]'))
    }

    const handleResize = () => {
      syncNodes()
      queueUpdate()
    }

    const update = () => {
      rafId = 0

      if (scenes.length === 0) return

      const viewportHeight = window.innerHeight || 1
      const focusLine = viewportHeight * 0.52
      const docMax = Math.max(document.documentElement.scrollHeight - viewportHeight, 1)
      let strongestScene = scenes[0]
      let strongestPresence = 0
      let cameraWeight = 0
      let cameraX = 0
      let cameraY = 0
      let cameraScale = 0

      for (const scene of scenes) {
        const rect = scene.getBoundingClientRect()
        const sceneHeight = Math.max(rect.height, viewportHeight * 0.7)
        const sceneCenter = rect.top + rect.height / 2
        const normalizedDistance = (sceneCenter - focusLine) / (viewportHeight * 0.92)
        const presenceBase = clamp(1 - Math.abs(normalizedDistance), 0, 1)
        const verticalProgress = clamp((focusLine - rect.top) / sceneHeight, 0, 1)
        const signedFocus = clamp((focusLine - sceneCenter) / (viewportHeight * 0.85), -1, 1)
        const edgePresence = clamp((viewportHeight * 1.08 - rect.top) / (sceneHeight + viewportHeight * 0.18), 0, 1)
        const visibility = rect.bottom > -viewportHeight * 0.3 && rect.top < viewportHeight * 1.2

        if (!visibility && performanceProfile.key === 'low') {
          setCssNumber(scene, '--scene-presence', 0)
          setCssNumber(scene, '--scene-progress', verticalProgress)
          setCssNumber(scene, '--scene-signed', signedFocus)
          setCssNumber(scene, '--scene-depth-progress', 1)
          continue
        }

        const presence = performanceProfile.key === 'low' ? edgePresence : presenceBase
        const depthProgress = 1 - presence

        setCssNumber(scene, '--scene-presence', presence)
        setCssNumber(scene, '--scene-progress', verticalProgress)
        setCssNumber(scene, '--scene-signed', signedFocus)
        setCssNumber(scene, '--scene-depth-progress', depthProgress)

        if (presence > strongestPresence) {
          strongestPresence = presence
          strongestScene = scene
        }

        const weight = Math.max(presence, 0.001)
        cameraWeight += weight
        cameraX += readNumberAttribute(scene, 'cameraX', 0) * weight
        cameraY += readNumberAttribute(scene, 'cameraY', 0) * weight
        cameraScale += readNumberAttribute(scene, 'cameraScale', 1) * weight
      }

      const journeyProgress = clamp(window.scrollY / docMax, 0, 1)
      root.style.setProperty('--forge-journey-progress', journeyProgress.toFixed(4))

      if (cameraWeight > 0) {
        const averageCameraX = cameraX / cameraWeight
        const averageCameraY = cameraY / cameraWeight

        root.style.setProperty('--forge-camera-pan-x', `${(averageCameraX * 0.18).toFixed(2)}px`)
        root.style.setProperty('--forge-camera-pan-y', `${(averageCameraY * 0.18).toFixed(2)}px`)
        root.style.setProperty('--forge-camera-environment-x', `${averageCameraX.toFixed(2)}px`)
        root.style.setProperty('--forge-camera-environment-y', `${averageCameraY.toFixed(2)}px`)
        root.style.setProperty('--forge-camera-structure-x', `${(averageCameraX * 0.62).toFixed(2)}px`)
        root.style.setProperty('--forge-camera-structure-y', `${(averageCameraY * 0.62).toFixed(2)}px`)
        root.style.setProperty('--forge-camera-scale', (cameraScale / cameraWeight).toFixed(4))
      }

      if (strongestScene) {
        const nextSceneKey = strongestScene.dataset.sceneKey || ''

        if (nextSceneKey && activeSceneRef.current !== nextSceneKey) {
          activeSceneRef.current = nextSceneKey
          root.dataset.activeScene = nextSceneKey
          onSceneChange?.(nextSceneKey)
        }
      }
    }

    const queueUpdate = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(update)
    }

    syncNodes()
    queueUpdate()

    window.addEventListener('scroll', queueUpdate, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        syncNodes()
        queueUpdate()
      })
      observedScenes = [...scenes]
      observedScenes.forEach(scene => resizeObserver.observe(scene))
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', queueUpdate)
      window.removeEventListener('resize', handleResize)
      observedScenes.forEach(scene => resizeObserver?.unobserve(scene))
      resizeObserver?.disconnect()
      delete root.dataset.activeScene
      ROOT_SCENE_VARIABLES.forEach(variable => root.style.removeProperty(variable))
    }
  }, [onSceneChange, performanceProfile.key])
}
