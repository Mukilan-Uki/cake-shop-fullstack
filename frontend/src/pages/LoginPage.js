import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password, formData.rememberMe);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-cream py-5">
      <div className="glass-card p-4 p-md-5" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="text-center mb-4">
          <div className="bg-gradient-to-r from-apricot to-strawberry rounded-circle p-3 d-inline-block mb-3">
            <i className="bi bi-cake text-white fs-2"></i>
          </div>
          <h2 className="font-script gradient-text">Welcome Back!</h2>
          <p className="text-muted">Sign in to your Cube Cake account</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-cream">
                <i className="bi bi-envelope text-chocolate"></i>
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-cream">
                <i className="bi bi-lock text-chocolate"></i>
              </span>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="mb-4 d-flex justify-content-between align-items-center">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="text-decoration-none text-apricot">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="btn btn-frosting w-100 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Signing In...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Sign In
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-muted mb-0">
              Don't have an account?{' '}
              <Link to="/register" className="text-decoration-none fw-bold text-apricot">
                Sign up here
              </Link>
            </p>
          </div>
        </form>

        <div className="text-center mt-4">
          <button 
            onClick={() => navigate('/')}
            className="btn btn-link text-decoration-none"
          >
            <i className="bi bi-arrow-left me-1"></i>
            Back to Cake Shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;