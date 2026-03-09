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
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
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
  );
};

export default Register;
