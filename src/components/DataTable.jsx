import { tier, downloadFilteredCsv } from '../utils/helpers.js'

export default function DataTable({ data, sortKey, onSortChange, downloadLabel }) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Community data table</div>
          <div className="card-desc">
            Sort by:{' '}
            <span
              style={{
                cursor: 'pointer',
                color: sortKey === 'poverty' ? '#009B3A' : '#aaa',
                fontWeight: 600
              }}
              onClick={() => onSortChange('poverty')}
            >
              Poverty
            </span>
            {' · '}
            <span
              style={{
                cursor: 'pointer',
                color: sortKey === 'gini' ? '#009B3A' : '#aaa',
                fontWeight: 600
              }}
              onClick={() => onSortChange('gini')}
            >
              GINI
            </span>
            {' · top 25 shown'}
          </div>
        </div>
        <div className="card-actions">
          <button className="button-small" onClick={() => downloadFilteredCsv(data, downloadLabel)}>
            Download CSV
          </button>
        </div>
      </div>
      <div style={{ overflowY: 'auto', maxHeight: 226 }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Community</th>
              <th>Parish</th>
              <th>Poverty</th>
              <th>GINI</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i}>
                <td>{r.community}</td>
                <td style={{ color: '#888' }}>{r.parish}</td>
                <td>
                  <span className={`pill-tag ${tier(r.poverty)}`}>
                    {r.poverty.toFixed(1)}%
                  </span>
                </td>
                <td>{r.gini.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}