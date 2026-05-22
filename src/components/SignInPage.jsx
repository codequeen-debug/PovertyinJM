import { useState } from 'react'
import './SignInPage.css'
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, firebaseReady } from '../firebase.js';

export default function SignInPage({ onSignIn }) {
  const [mode, setMode] = useState('signIn')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')


  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'signUp' && password !== confirmPassword) {
      setError('Passwords must match');
      return;
    }
    setError('');
    onSignIn();
  };

  const handleGoogleSignIn = async () => {
    if (!firebaseReady || !auth) {
      setError('Google sign-in is not available.');
      return;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onSignIn(result.user);
    } catch (error) {
      setError('Google sign-in failed.');
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <div className="map-section">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/e/eb/Jamaica_%28orthographic_projection%29.svg"
            alt="Jamaica Map"
            className="jamaica-map"
          />
          <h1 className="welcome-title">Welcome to Jamaica Poverty Dashboard</h1>
        </div>
        <div className="form-section">
          <div className="form-card">
            <h2 className="signin-title">
              {mode === 'signIn' ? 'Sign In' : 'Sign Up'}
            </h2>
            <form onSubmit={handleSubmit} className="signin-form">
              {mode === 'signUp' && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
              )}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              {mode === 'signUp' && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
              )}
              {error && <div className="form-error">{error}</div>}
              <button type="submit" className="signin-button">
                {mode === 'signIn' ? 'Sign In' : 'Create Account'}
              </button>
              <div style={{ textAlign: 'center', margin: '16px 0' }}>or</div>
              <button
                type="button"
                className="signin-button google"
                style={{ background: '#4285F4', color: '#fff', marginBottom: 8 }}
                onClick={handleGoogleSignIn}
                disabled={!firebaseReady}
              >
                <span style={{ marginRight: 8, verticalAlign: 'middle' }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" style={{ verticalAlign: 'middle' }}>
                    <g fill="none" fillRule="evenodd">
                      <path fill="#4285F4" d="M17.64 9.2045c0-.638-.0573-1.2518-.1636-1.8409H9v3.4818h4.8445c-.2082 1.1245-.8345 2.0782-1.7764 2.7191v2.2582h2.8727c1.6827-1.5518 2.6591-3.8373 2.6591-6.6182z"/>
                      <path fill="#34A853" d="M9 18c2.43 0 4.4673-.8064 5.9564-2.1864l-2.8727-2.2582c-.7973.5345-1.8145.8518-3.0837.8518-2.3727 0-4.3846-1.6036-5.1046-3.7646H.8828v2.3218C2.3646 16.3455 5.4546 18 9 18z"/>
                      <path fill="#FBBC05" d="M3.8954 10.6427c-.1818-.5345-.2864-1.1045-.2864-1.6927 0-.5882.1046-1.1582.2864-1.6927V4.9355H.8828C.3205 6.1455 0 7.5227 0 9c0 1.4773.3205 2.8545.8828 4.0645l3.0126-2.4218z"/>
                      <path fill="#EA4335" d="M9 3.5791c1.3227 0 2.5045.4545 3.4364 1.3455l2.5773-2.5773C13.4646.8064 11.4273 0 9 0 5.4546 0 2.3646 1.6545.8828 4.9355l3.0126 2.3218C4.6154 5.1827 6.6273 3.5791 9 3.5791z"/>
                    </g>
                  </svg>
                </span>
                Sign in with Google
              </button>
            </form>
            <div className="mode-toggle">
              {mode === 'signIn' ? (
                <>
                  New here?{' '}
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => setMode('signUp')}
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => setMode('signIn')}
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
