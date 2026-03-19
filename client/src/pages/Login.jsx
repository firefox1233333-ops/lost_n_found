import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const ROLES = ['Admin', 'Security', 'User'];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState('Admin');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success && result.user) {
      const role = result.user.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'security') navigate('/security');
      else navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="auth-split">
      {/* Left: dark navy panel */}
      <div className="auth-split-left">
        <div className="auth-split-brand">
          <div className="auth-split-logo">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <span className="auth-split-brand-name">Lost &amp; Found</span>
        </div>
        <div className="auth-split-hero">
          <h2 className="auth-split-tagline">Your campus lost &amp; found management system.</h2>
          <p className="auth-split-sub">Report, track and recover lost items on campus with ease.</p>
        </div>
      </div>

      {/* Right: login form */}
      <div className="auth-split-right">
        <div className="auth-form-wrapper">
          <h2 className="auth-form-title">Welcome</h2>
          <p className="auth-form-subtitle">Please select your role to log in</p>

          {/* Role tabs */}
          <div className="auth-role-tabs">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                className={`auth-role-tab${activeRole === r ? ' auth-role-tab-active' : ''}`}
                onClick={() => setActiveRole(r)}
              >
                {r}
              </button>
            ))}
          </div>

          {error && <div className="auth-error" role="alert">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="login-email" className="auth-label">Email</label>
              <input
                id="login-email"
                type="email"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="login-password" className="auth-label">Password</label>
              <input
                id="login-password"
                type="password"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
            <button type="submit" disabled={loading} className="auth-btn">
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="auth-link">
            Don&apos;t have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
