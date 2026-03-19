import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    const result = await register(formData);

    if (result.success && result.user) {
      const role = result.user.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'security') navigate('/security');
      else navigate('/');
    } else {
      setError(result.error || 'Registration failed');
    }

    setLoading(false);
  };

  return (
    <div className="auth-split">
      {/* Left panel */}
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
          <h2 className="auth-split-tagline">Create your account to get started.</h2>
          <p className="auth-split-sub">Join your campus lost &amp; found community today.</p>
        </div>
      </div>

      {/* Right: register form */}
      <div className="auth-split-right">
        <div className="auth-form-wrapper">
        <h2 className="auth-form-title">Create Account</h2>
        <p className="auth-form-subtitle">Fill in your details to register</p>
        {error && <div className="auth-error" role="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-row">
            <label htmlFor="register-name" className="auth-label">Name</label>
            <input
              id="register-name"
              type="text"
              name="name"
              className="auth-input"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              autoComplete="name"
            />
          </div>
          <div className="auth-row">
            <label htmlFor="register-email" className="auth-label">Email</label>
            <input
              id="register-email"
              type="email"
              name="email"
              className="auth-input"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>
          <div className="auth-row">
            <label htmlFor="register-password" className="auth-label">Password</label>
            <input
              id="register-password"
              type="password"
              name="password"
              className="auth-input"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password (min 6 characters)"
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <div className="auth-row">
            <label htmlFor="register-role" className="auth-label">Role</label>
            <select
              id="register-role"
              name="role"
              className="auth-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="security">Security Officer</option>
              <option value="admin">Admin</option>
            </select>
            <span className="auth-hint">For demo purposes, you can register as User, Security Officer, or Admin.</span>
          </div>
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Registering…' : 'Register'}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
