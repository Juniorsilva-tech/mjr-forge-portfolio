export default function FilmGrain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[2] overflow-hidden opacity-60"
    >
      <div className="forge-film-grain absolute inset-[-12%]" />
      <div className="forge-film-grain forge-film-grain--soft absolute inset-0" />
    </div>
  )
}
