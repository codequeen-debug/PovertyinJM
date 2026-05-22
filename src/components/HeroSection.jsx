export default function HeroSection({ onParishSelect }) {
  const PARISHES = [
    { name: 'Kingston', color: '#2980b9', x: 10, y: 10 },
    { name: 'St. Andrew', color: '#1abc9c', x: 140, y: 10 },
    { name: 'St. Thomas', color: '#f39c12', x: 270, y: 10 },
    { name: 'Clarendon', color: '#e74c3c', x: 10, y: 100 },
    { name: 'Manchester', color: '#2ecc71', x: 140, y: 100 },
    { name: 'St. Elizabeth', color: '#3498db', x: 270, y: 100 },
    { name: 'Trelawny', color: '#9b59b6', x: 10, y: 190 },
    { name: 'St. Ann', color: '#16a085', x: 140, y: 190 },
    { name: 'Westmoreland', color: '#c0392b', x: 270, y: 190 }
  ]

  const handleKeyDown = (event, parish) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onParishSelect?.(parish)
    }
  }

  return (
    <div className="hero">
      <div className="hero-copy">
        <h1>Parish and district insights for Jamaica</h1>
        <p>Filter by parish and district, compare parish-level metrics, download charts, and explore data in a richer dashboard.</p>
      </div>
      <div className="hero-map">
        <svg viewBox="0 0 420 280" role="img" aria-label="Jamaica parish map">
          {PARISHES.map((parish) => (
            <g
              key={parish.name}
              className="hero-parish"
              tabIndex="0"
              role="button"
              onClick={() => onParishSelect?.(parish.name)}
              onKeyDown={(e) => handleKeyDown(e, parish.name)}
            >
              <rect x={parish.x} y={parish.y} width="120" height="80" fill={parish.color} rx="14" />
              <text x={parish.x + 12} y={parish.y + 35} fill="#fff" fontSize="12">
                {parish.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}
