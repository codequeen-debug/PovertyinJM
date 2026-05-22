import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList
} from 'recharts'
import { PARISHES } from '../utils/constants.js'

export default function CompareTab({
  rawData,
  compareParishes,
  parish,
  district,
  onCompareParishesChange
}) {
  const compareStats = useMemo(() => {
    return compareParishes.map(par => {
      const rows = rawData.filter(r => r.parish === par && r.poverty !== null)
      const avg = rows.length ? rows.reduce((sum, row) => sum + row.poverty, 0) / rows.length : 0
      const max = rows.length ? Math.max(...rows.map(r => r.poverty)) : 0
      const min = rows.length ? Math.min(...rows.map(r => r.poverty)) : 0
      return {
        parish: par,
        avg: parseFloat(avg.toFixed(1)),
        avgLabel: `${avg.toFixed(1)}%`,
        max: max.toFixed(1),
        min: min.toFixed(1),
        count: rows.length,
      }
    })
  }, [compareParishes, rawData])

  const handleSelectChange = (index, value) => {
    const next = [...compareParishes]
    next[index] = value
    onCompareParishesChange(next)
  }

  const handleAddComparison = () => {
    const available = PARISHES.filter(p => p !== 'All Parishes' && !compareParishes.includes(p))
    if (available.length === 0) return
    onCompareParishesChange([...compareParishes, available[0]])
  }

  const handleRemoveComparison = (index) => {
    if (compareParishes.length <= 2) return
    onCompareParishesChange(compareParishes.filter((_, idx) => idx !== index))
  }

  return (
    <>
      <div className="filter-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="filter-group compare-group">
          <label>Compare parishes</label>
          <div className="compare-selects">
            {compareParishes.map((selected, idx) => (
              <div key={`${selected}-${idx}`} className="compare-select-item">
                <select
                  value={selected}
                  onChange={e => handleSelectChange(idx, e.target.value)}
                >
                  {PARISHES.filter(p => p !== 'All Parishes' && (p === selected || !compareParishes.includes(p))).map(p => (
                    <option key={`${idx}-${p}`} value={p}>{p}</option>
                  ))}
                </select>
                {compareParishes.length > 2 && (
                  <button
                    type="button"
                    className="remove-compare"
                    onClick={() => handleRemoveComparison(idx)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            className="add-compare"
            onClick={handleAddComparison}
            disabled={compareParishes.length >= PARISHES.length - 1}
          >
            Add another parish
          </button>
        </div>
        <div className="filter-group">
          <label>Active filter</label>
          <div className="hint" style={{ wordBreak: 'break-word', maxWidth: 180 }}>Parish: {parish} · District: {district}</div>
        </div>
      </div>

      <div className="compare-grid">
        {compareStats.map((stat, idx) => (
          <div key={idx} className="stat compare-card" style={{ minWidth: 0, wordBreak: 'break-word' }}>
            <div className="stat-label">{stat.parish}</div>
            <div className="stat-val">{stat.avg}%</div>
            <div className="stat-sub">Mean poverty · {stat.count} communities</div>
            <div className="compare-row">High: {stat.max}% · Low: {stat.min}%</div>
          </div>
        ))}
      </div>

      <div className="compare-chart-wrapper">
        <h3 className="compare-chart-title">Graph comparison</h3>
        <div className="compare-chart">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={compareStats} margin={{ top: 20, right: 24, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="parish" interval={0} tick={{ fontSize: 12 }} height={60} angle={-20} textAnchor="end" />
              <YAxis tickFormatter={value => `${value}%`} />
              <Tooltip formatter={(value) => [`${value}%`, 'Average']} />
              <Legend />
              <Bar dataKey="avg" name="Mean poverty" fill="#009b3a">
                <LabelList dataKey="avgLabel" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}