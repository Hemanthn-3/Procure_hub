import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './Login.css';

export default function Login() {
  const { isAuthenticated, isManager, login, signup } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('procurement_manager');

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={isManager ? '/dashboard' : '/marketplace'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await signup(email, password, companyName, role);
      }
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.errors?.join(', ') ||
        'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background decoration */}
      <div className="login-bg">
        <div className="login-bg__orb login-bg__orb--1"></div>
        <div className="login-bg__orb login-bg__orb--2"></div>
        <div className="login-bg__orb login-bg__orb--3"></div>
        <div className="login-bg__grid"></div>
      </div>

      <div className="login-container">
        {/* Branding */}
        <div className="login-brand">
          <div className="login-brand__icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <h1 className="login-brand__title">ProcureHub</h1>
          <p className="login-brand__subtitle">Vendor Procurement Management Platform</p>
        </div>

        {/* Login Card */}
        <div className="login-card">
          {/* Tab toggle */}
          <div className="login-tabs">
            <button
              className={`login-tab ${isLoginMode ? 'login-tab--active' : ''}`}
              onClick={() => { setIsLoginMode(true); setError(''); }}
              id="tab-login"
            >
              Sign In
            </button>
            <button
              className={`login-tab ${!isLoginMode ? 'login-tab--active' : ''}`}
              onClick={() => { setIsLoginMode(false); setError(''); }}
              id="tab-signup"
            >
              Sign Up
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-error" id="login-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form" id="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={isLoginMode ? 'current-password' : 'new-password'}
              />
            </div>

            {!isLoginMode && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="company-name">Company Name</label>
                  <input
                    id="company-name"
                    type="text"
                    className="form-input"
                    placeholder="Acme Corporation"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="role">I am a...</label>
                  <div className="role-selector">
                    <button
                      type="button"
                      className={`role-option ${role === 'procurement_manager' ? 'role-option--active' : ''}`}
                      onClick={() => setRole('procurement_manager')}
                      id="role-manager"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                        <line x1="9" y1="21" x2="9" y2="9" />
                      </svg>
                      <span className="role-option__title">Procurement Manager</span>
                      <span className="role-option__desc">Create RFQs & manage bids</span>
                    </button>
                    <button
                      type="button"
                      className={`role-option ${role === 'vendor' ? 'role-option--active' : ''}`}
                      onClick={() => setRole('vendor')}
                      id="role-vendor"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      <span className="role-option__title">Vendor / Supplier</span>
                      <span className="role-option__desc">Browse tenders & submit bids</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={loading}
              id="btn-submit"
            >
              {loading ? (
                <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div>
              ) : (
                isLoginMode ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
