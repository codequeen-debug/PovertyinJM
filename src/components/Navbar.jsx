import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider, firebaseReady } from '../firebase.js'

export default function Navbar({ user, onSignIn, onSignOut }) {
  const handleSignIn = async () => {
    if (!firebaseReady || !auth) return
    try {
      const result = await signInWithPopup(auth, googleProvider)
      onSignIn(result.user)
    } catch (error) {
      console.error('Firebase sign-in error', error)
    }
  }

  const handleSignOut = async () => {
    if (!auth) return
    try {
      await signOut(auth)
      onSignOut()
    } catch (error) {
      console.error('Firebase sign-out error', error)
    }
  }

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="flag">
          <div className="stripe" style={{ background: '#009B3A' }} />
          <div className="stripe" style={{ background: '#FED100' }} />
          <div className="stripe" style={{ background: '#000' }} />
        </div>
        <div>
          <div className="nav-title">Jamaica Poverty Dashboard</div>
          <div className="nav-sub">PIOJ Community-Level Data · 829 communities</div>
        </div>
      </div>
      <div className="nav-auth">
        {firebaseReady ? (
          <button className="button-small" onClick={user ? handleSignOut : handleSignIn}>
            {user ? `Sign out ${user.displayName || user.email}` : 'Sign in with Google'}
          </button>
        ) : (
          <span className="auth-note">Firebase not configured. Add env vars to enable Google sign-in.</span>
        )}
      </div>
      <span className="badge">PIOJ 2026</span>
    </nav>
  )
}