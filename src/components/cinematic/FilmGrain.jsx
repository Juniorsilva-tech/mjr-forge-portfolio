import { usePerformanceProfile } from '../../lib/performance.js'

export default function FilmGrain() {
  const performance = usePerformanceProfile()

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
      <div
        className="forge-film-grain absolute inset-[-12%]"
        style={{ opacity: performance.grainEnabled ? performance.grainOpacity : 0 }}
      />
      <div
        className="forge-film-grain forge-film-grain--soft absolute inset-0"
        style={{ opacity: performance.grainEnabled ? performance.grainSoftOpacity : 0 }}
      />
    </div>
  )
}
