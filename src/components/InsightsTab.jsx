import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, CartesianGrid, Cell } from 'recharts'
import { PARISHES, PAR_COLORS } from '../utils/constants.js'
import { downloadSvg } from '../utils/helpers.js'
import ChatWidget from './ChatWidget.jsx'
import DataTable from './DataTable.jsx'

export default function InsightsTab({
  rawData,
  parish,
  district,
  sortKey,
  downloadLabel,
  savedStats,
  onParishChange,
  onDistrictChange,
  onDownloadLabelChange,
  onSortKeyChange
}) {
  const parishData = useMemo(() => {
    return parish === 'All Parishes'
      ? rawData
      : rawData.filter(r => r.parish === parish)
  }, [parish, rawData])

  const districtOptions = useMemo(() => {
    const set = new Set()
    parishData.forEach(r => {
      if (r.community) set.add(r.community)
    })
    return ['All Districts', ...[...set].sort()]
  }, [parishData])

  const data = useMemo(() => {
    let d = district === 'All Districts' ? parishData : parishData.filter(r => r.community === district)
    return d.filter(r => r.poverty !== null && r.gini !== null)
  }, [parishData, district])

  const stats = useMemo(() => {
    if (!data.length) return {}
    const povs = data.map(r => r.poverty)
    const ginis = data.map(r => r.gini)
    const pops = data.map(r => r.population || 0)
    const maxPov = Math.max(...povs)
    return {
      mean: (povs.reduce((a, b) => a + b, 0) / povs.length).toFixed(1),
      max: maxPov.toFixed(1),
      maxCom: data.find(r => r.poverty === maxPov)?.community || '',
      giniMean: (ginis.reduce((a, b) => a + b, 0) / ginis.length).toFixed(3),
      count: data.length,
      pop: pops.reduce((a, b) => a + b, 0).toLocaleString(),
    }
  }, [data])

  const top10 = useMemo(() => {
    return [...data].sort((a, b) => b.poverty - a.poverty).slice(0, 10).map(r => ({
      name: r.community.length > 14 ? r.community.slice(0, 13) + '…' : r.community,
      fullName: r.community,
      poverty: parseFloat(r.poverty.toFixed(1)),
      parish: r.parish,
    }))
  }, [data])

  const tableData = useMemo(() => {
    return [...data].sort((a, b) => sortKey === 'poverty' ? b.poverty - a.poverty : b.gini - a.gini).slice(0, 25)
  }, [data, sortKey])

  const parishAvg = useMemo(() => {
    const map = {}
    rawData.forEach(r => {
      if (!r.parish || r.parish === 'Unknown' || !r.poverty) return
      if (!map[r.parish]) map[r.parish] = []
      map[r.parish].push(r.poverty)
    })
    return Object.entries(map).map(([name, vals]) => ({
      name: name.replace('St. ', 'St. '),
      fullName: name,
      avg: parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)),
    })).sort((a, b) => b.avg - a.avg)
  }, [rawData])

  const scatterData = useMemo(() =>
    data.map(r => ({ ...r, poverty: parseFloat(r.poverty.toFixed(2)), gini: parseFloat(r.gini.toFixed(4)) }))
  , [data])

  return (
    <>
      <div className="filter-grid">
        <div className="filter-group">
          <label>Parish</label>
          <select
            value={parish}
            onChange={e => {
              onParishChange(e.target.value)
              onDistrictChange('All Districts')
            }}
          >
            {PARISHES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>District</label>
          <select
            value={district}
            onChange={e => onDistrictChange(e.target.value)}
            disabled={parish === 'All Parishes'}
          >
            {districtOptions.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Download file name</label>
          <input
            value={downloadLabel}
            onChange={e => onDownloadLabelChange(e.target.value)}
            placeholder="filtered-data"
          />
          <div className="hint">Use this label for SVG and CSV downloads.</div>
        </div>
      </div>

      <div className="personalization-card card">
        <div className="card-header">
          <div>
            <div className="card-title">Personalization stats</div>
            <div className="card-desc">Your browser remembers the last parish, district and export name.</div>
          </div>
        </div>
        <div className="stats" style={{ marginBottom: 0 }}>
          <div className="stat">
            <div className="stat-label">Saved parish</div>
            <div className="stat-val">{savedStats.lastParish}</div>
            <div className="stat-sub">Current selection</div>
          </div>
          <div className="stat">
            <div className="stat-label">Saved district</div>
            <div className="stat-val">{savedStats.lastDistrict}</div>
            <div className="stat-sub">Current district</div>
          </div>
          <div className="stat">
            <div className="stat-label">Download name</div>
            <div className="stat-val">{downloadLabel}</div>
            <div className="stat-sub">Editable export label</div>
          </div>
          <div className="stat">
            <div className="stat-label">Visits</div>
            <div className="stat-val">{savedStats.visits}</div>
            <div className="stat-sub">Times opened in this browser</div>
          </div>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-label">Mean poverty rate</div>
          <div className="stat-val" style={{ color: '#009B3A' }}>{stats.mean}%</div>
          <div className="stat-sub">across filtered communities</div>
        </div>
        <div className="stat">
          <div className="stat-label">Highest poverty</div>
          <div className="stat-val" style={{ color: '#c0392b' }}>{stats.max}%</div>
          <div className="stat-sub">{stats.maxCom}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Mean GINI index</div>
          <div className="stat-val" style={{ color: '#d35400' }}>{stats.giniMean}</div>
          <div className="stat-sub">income inequality</div>
        </div>
        <div className="stat">
          <div className="stat-label">Communities</div>
          <div className="stat-val">{stats.count}</div>
          <div className="stat-sub">Pop: {stats.pop}</div>
        </div>
      </div>

      <div className="row2">
        <div id="chart-top10" className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Top 10 communities by poverty rate</div>
              <div className="card-desc">{parish === 'All Parishes' ? 'Across all parishes — color by parish' : parish}</div>
            </div>
            <div className="card-actions">
              <button
                className="button-small"
                onClick={() => downloadSvg('chart-top10', `${downloadLabel || 'filtered-data'}-top10`)}
              >
                Download
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={top10} layout="vertical" margin={{ left: 8, right: 32, top: 0, bottom: 0 }}>
              <XAxis type="number" domain={[0, 70]} tickFormatter={v => `${v}%`} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v, n, p) => [`${v}% — ${p.payload.parish}`, 'Poverty rate']} />
              <Bar dataKey="poverty" radius={[0, 4, 4, 0]}>
                {top10.map((entry, i) => (
                  <Cell key={i} fill={PAR_COLORS[entry.parish] || '#009B3A'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div id="chart-parishavg" className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Average poverty rate by parish</div>
              <div className="card-desc">All 14 parishes ranked highest to lowest</div>
            </div>
            <div className="card-actions">
              <button
                className="button-small"
                onClick={() => downloadSvg('chart-parishavg', `${downloadLabel || 'filtered-data'}-parish-average`)}
              >
                Download
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={parishAvg} layout="vertical" margin={{ left: 4, right: 32, top: 0, bottom: 0 }}>
              <XAxis type="number" domain={[0, 40]} tickFormatter={v => `${v}%`} tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" width={76} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v, n, p) => [`${v}%`, `Avg — ${p.payload.fullName}`]} />
              <Bar dataKey="avg" radius={[0, 4, 4, 0]}>
                {parishAvg.map((entry, i) => (
                  <Cell key={i} fill={PAR_COLORS[entry.fullName] || '#888'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="row3">
        <div id="chart-scatter" className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Poverty rate vs GINI index</div>
              <div className="card-desc">Each dot = one community · hover for details · color = parish</div>
            </div>
            <div className="card-actions">
              <button
                className="button-small"
                onClick={() => downloadSvg('chart-scatter', `${downloadLabel || 'filtered-data'}-poverty-gini`)}
              >
                Download
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart margin={{ top: 8, right: 16, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="poverty"
                name="Poverty"
                tickFormatter={v => `${v}%`}
                tick={{ fontSize: 10 }}
                label={{ value: 'poverty rate →', position: 'insideBottom', offset: -10, fontSize: 10 }}
              />
              <YAxis
                dataKey="gini"
                name="GINI"
                tick={{ fontSize: 10 }}
                label={{ value: 'GINI →', angle: -90, position: 'insideLeft', offset: 10, fontSize: 10 }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const d = payload[0]?.payload
                  return (
                    <div style={{
                      background: '#fff',
                      border: '1px solid #eee',
                      borderRadius: 6,
                      padding: '6px 10px',
                      fontSize: 11
                    }}>
                      <strong>{d.community}</strong><br />{d.parish}<br />
                      Poverty: {d.poverty?.toFixed(1)}%<br />GINI: {d.gini?.toFixed(3)}
                    </div>
                  )
                }}
              />
              <Scatter data={scatterData} opacity={0.65}>
                {scatterData.map((entry, i) => (
                  <Cell key={i} fill={PAR_COLORS[entry.parish] || '#999'} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <ChatWidget />
      </div>

      <div className="row3">
        <DataTable
          data={tableData}
          sortKey={sortKey}
          onSortChange={onSortKeyChange}
          downloadLabel={downloadLabel}
        />
      </div>

      <p style={{ fontSize: 11, color: '#bbb', textAlign: 'center', marginTop: 20, paddingBottom: 20 }}>
        Data source: Poverty Maps (PIOJ) · Jamaica Open Data Portal · Built with React + Recharts
      </p>
    </>
  )
}