
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import logoImage from '../image/lsm_logo.jpeg';
import { login } from '../services/login';

function Login() {
  const [formData, setFormData] = useState({
    user_id: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(formData);
      // Store user data and token if available
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('An error occurred. Please check your connection.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Logo Section */}
        <div className="login-header">
          <img src={logoImage} alt="LSM Logo" className="login-logo" />
          <h1 className="login-title">LSM IBMS</h1>
          <p className="login-subtitle">Integrated Business Management System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">
          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* User ID Input */}
          <div className="form-group">
            <label htmlFor="user_id" className="form-label">
              User ID
            </label>
            <div className="input-wrapper">
              {/* <span className="input-icon">👤</span> */}
              <input
                type="text"
                id="user_id"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                placeholder="Enter your user ID"
                className="form-input"
                required
                disabled={loading}
              />
              
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="form-input"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="eye-icon-btn"
                onClick={togglePasswordVisibility}
                disabled={loading}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p className="footer-text">
            © 2026 LSM ERP. All rights reserved.
          </p>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="login-background">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
      </div>
    </div>
  );
}

export default Login;