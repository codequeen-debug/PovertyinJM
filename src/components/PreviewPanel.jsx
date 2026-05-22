export default function PreviewPanel({ onSignIn }) {
  return (
    <div className="preview-panel card">
      <div className="card-title">Preview mode</div>
      <div className="card-desc">Sign in with Google to unlock the full interactive dashboard, compare tab, and downloads.</div>
      <div className="preview-copy">
        <p>Guest preview includes:</p>
        <ul>
          <li>Basic parish and district summary</li>
          <li>Saved personalization overview</li>
          <li>Download name editing teaser</li>
        </ul>
      </div>
      <div className="preview-action">
        <button className="button-small" onClick={onSignIn}>Sign in to continue</button>
      </div>
    </div>
  )
}