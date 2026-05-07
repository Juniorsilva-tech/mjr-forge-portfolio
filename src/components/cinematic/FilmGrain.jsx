import { usePerformanceProfile } from '../../lib/performance.js'

export default function FilmGrain() {
  const performance = usePerformanceProfile()

  if (!performance.grainEnabled) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
      <div
        className="forge-film-grain absolute inset-[-12%]"
        style={{ opacity: performance.grainOpacity }}
      />
      <div
        className="forge-film-grain forge-film-grain--soft absolute inset-0"
        style={{ opacity: performance.grainSoftOpacity }}
      />
    </div>
  )
}
