import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simple authentication (for demo)
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      setError('Invalid credentials. Try: admin / admin123');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-cream">
      <div className="glass-card p-5" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <div className="bg-gradient-to-r from-apricot to-strawberry rounded-circle p-3 d-inline-block mb-3">
            <i className="bi bi-shield-lock text-white fs-2"></i>
          </div>
          <h2 className="font-script gradient-text">Admin Login</h2>
          <p className="text-muted">Enter your credentials to access the dashboard</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Username</label>
            <div className="input-group">
              <span className="input-group-text bg-cream">
                <i className="bi bi-person text-chocolate"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Enter username"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-cream">
                <i className="bi bi-key text-chocolate"></i>
              </span>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-frosting w-100 mb-3">
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Login
          </button>

          <div className="text-center">
            <small className="text-muted">
              Demo credentials: <strong>admin</strong> / <strong>admin123</strong>
            </small>
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

export default AdminLogin;