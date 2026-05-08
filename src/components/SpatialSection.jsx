const SCENE_DIRECTIONS = {
  left: -1,
  right: 1,
  center: 0,
  deep: 0,
}

function getDirectionAngle(direction, fallback) {
  if (fallback) return fallback
  if (direction === 'right') return '244deg'
  if (direction === 'center' || direction === 'deep') return '180deg'

  return '118deg'
}

export default function SpatialSection({
  id,
  scene,
  className = '',
  trackClassName = '',
  shellClassName = '',
  children,
}) {
  const direction = scene?.direction ?? 'center'
  const sceneSide = SCENE_DIRECTIONS[direction] ?? 0

  return (
    <section
      id={id}
      data-forge-scene=""
      data-scene-key={scene?.sceneKey ?? id}
      data-scene-direction={direction}
      data-camera-x={scene?.cameraX ?? 0}
      data-camera-y={scene?.cameraY ?? 0}
      data-camera-scale={scene?.cameraScale ?? 1}
      className={`forge-spatial-scene relative z-10 ${className}`}
      style={{
        '--scene-side': sceneSide,
        '--scene-accent': scene?.accent ?? 'rgba(199, 161, 90, 0.16)',
        '--scene-secondary': scene?.secondary ?? 'rgba(244, 239, 231, 0.06)',
        '--scene-grid-line': scene?.gridLine ?? 'rgba(244, 239, 231, 0.05)',
        '--scene-grid-glow': scene?.gridGlow ?? 'rgba(199, 161, 90, 0.18)',
        '--scene-highlight-x': scene?.highlightX ?? '50%',
        '--scene-highlight-y': scene?.highlightY ?? '18%',
        '--scene-gradient-angle': getDirectionAngle(direction, scene?.gradientAngle),
        '--scene-dissolve-angle':
          scene?.dissolveAngle ?? getDirectionAngle(direction, scene?.gradientAngle),
        '--scene-structure-angle': scene?.structureAngle ?? getDirectionAngle(direction, scene?.gradientAngle),
      }}
    >
      <div className={`forge-spatial-track ${trackClassName}`}>
        <div className="forge-scene-environment" aria-hidden="true">
          <div className="forge-scene-atmosphere" />
          <div className="forge-scene-fog" />
        </div>

        <div className="forge-scene-structure" aria-hidden="true">
          <span className="forge-scene-grid" />
          <span className="forge-scene-frame" />
          <span className="forge-scene-vanishing-line" />
        </div>

        <div className={`forge-scene-content ${shellClassName}`}>{children}</div>

        <div className="forge-scene-transition" aria-hidden="true">
          <span className="forge-scene-transition-mask" />
          <span className="forge-scene-transition-noise" />
        </div>
      </div>
    </section>
  )
}
