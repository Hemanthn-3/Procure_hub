import { useState } from 'react';
import './login.css';

const FEATURES = [
  'Create & publish RFQs instantly',
  'Invite vendors with one click',
  'Receive & compare quotations',
  'Evaluate bids side-by-side',
  'Generate Purchase Orders',
];

export default function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole]               = useState('procurement_manager');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // replace with your auth call
      await new Promise((r) => setTimeout(r, 1200));
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        err?.response?.data?.errors?.join(', ') ||
        'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Left branding panel */}
      <div className="login-left">
        <div className="login-left-inner">

          <div className="company-logo">
            <div className="company-logo__icon">
              <svg width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <span className="company-logo__name">ProcureHub</span>
          </div>

          <div style={{ flex: 1 }}>
            <p className="login-eyebrow">Vendor Procurement Management</p>
            <h1 className="login-headline">
              One platform.<br />
              Every procurement<br />
              <span>decision.</span>
            </h1>
            <p className="login-subtext">
              Simplify the end-to-end procurement cycle — from issuing RFQs
              to comparing bids and generating purchase orders — all in a
              single workspace.
            </p>

            <ul className="feature-list">
              {FEATURES.map((f) => (
                <li key={f} className="feature">
                  <span className="feature__check">
                    <svg width="10" height="10" viewBox="0 0 12 12"
                      fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="2 6 5 9 10 3" />
                    </svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <p className="login-footer-text">
            © 2025 ProcureHub Inc. · Enterprise Procurement Solutions
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-right">
        <div className="login-card">

          <div className="login-card__heading">
            <h2 className="login-card__title">
              {isLoginMode ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="login-card__subtitle">
              {isLoginMode
                ? 'Sign in to your workspace'
                : 'Join thousands of procurement teams'}
            </p>
          </div>

          <div className="login-tabs">
            <button
              className={`login-tab ${isLoginMode ? 'login-tab--active' : ''}`}
              onClick={() => { setIsLoginMode(true); setError(''); }}
            >Sign In</button>
            <button
              className={`login-tab ${!isLoginMode ? 'login-tab--active' : ''}`}
              onClick={() => { setIsLoginMode(false); setError(''); }}
            >Sign Up</button>
          </div>

          {error && (
            <div className="alert-error">
              <svg width="15" height="15" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
              <input id="email" type="email" className="form-input"
                placeholder="you@company.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                required autoComplete="email" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input id="password" type="password" className="form-input"
                placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)}
                required minLength={6}
                autoComplete={isLoginMode ? 'current-password' : 'new-password'} />
            </div>

            {isLoginMode && (
              <div className="login-forgot">
                <button type="button">Forgot password?</button>
              </div>
            )}

            {!isLoginMode && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="company-name">Company name</label>
                  <input id="company-name" type="text" className="form-input"
                    placeholder="Acme Corporation" value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="form-label">I am a…</label>
                  <div className="role-selector">

                    <button type="button"
                      className={`role-option ${role === 'procurement_manager' ? 'role-option--active' : ''}`}
                      onClick={() => setRole('procurement_manager')}>
                      <span className="role-option__icon">
                        <svg width="16" height="16" viewBox="0 0 24 24"
                          fill="none" stroke="currentColor" strokeWidth="1.75">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <line x1="3" y1="9" x2="21" y2="9" />
                          <line x1="9" y1="21" x2="9" y2="9" />
                        </svg>
                      </span>
                      <span className="role-option__title">Procurement Manager</span>
                      <span className="role-option__desc">Create RFQs &amp; manage bids</span>
                    </button>

                    <button type="button"
                      className={`role-option ${role === 'vendor' ? 'role-option--active' : ''}`}
                      onClick={() => setRole('vendor')}>
                      <span className="role-option__icon">
                        <svg width="16" height="16" viewBox="0 0 24 24"
                          fill="none" stroke="currentColor" strokeWidth="1.75">
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                      </span>
                      <span className="role-option__title">Vendor / Supplier</span>
                      <span className="role-option__desc">Browse tenders &amp; submit bids</span>
                    </button>

                  </div>
                </div>
              </>
            )}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <><div className="spinner" />Processing…</>
              ) : (
                <>
                  {isLoginMode ? 'Sign In' : 'Create Account'}
                  <svg width="13" height="13" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </>
              )}
            </button>

          </form>

          <div className="login-card__footer">
            By continuing you agree to our{' '}
            <a>Terms of Service</a> and <a>Privacy Policy</a>.
          </div>

        </div>
      </div>

    </div>
  );
}