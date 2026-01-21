import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: 'admin@cubecake.com',
    password: 'admin123'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('Checking...');

  // Check backend status on component mount
  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      console.log('🔍 Checking backend at http://localhost:5001/health');
      const response = await fetch('http://localhost:5001/health', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        mode: 'cors' // Explicitly set CORS mode
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Backend health data:', data);
        setBackendStatus(`✅ Backend is running (Port: 5001, DB: ${data.database})`);
      } else {
        setBackendStatus(`❌ Backend responded with error: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error('Backend check failed:', err);
      setBackendStatus(`❌ Cannot connect to backend: ${err.message}`);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    console.log('🔐 Attempting login with:', credentials);
    
    try {
      // Test backend first
      await checkBackendStatus();
      
      // Attempt login
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          rememberMe: true
        }),
        mode: 'cors'
      });
      
      console.log('Login response status:', response.status);
      
      let result;
      try {
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error(`Server returned invalid JSON. Check if backend is returning proper JSON.`);
      }
      
      if (response.ok && result.success) {
        console.log('✅ Login successful:', result);
        
        // Check if user is admin
        const user = result.user || result.data?.user;
        if (user && user.role === 'admin') {
          // Store session
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('isAdmin', 'true');
          
          // Navigate to admin page
          navigate('/admin');
        } else {
          setError('❌ This account is not an administrator.');
          localStorage.clear();
        }
      } else {
        setError(`❌ Login failed: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(`❌ Network error: ${error.message}. Make sure:
        1. Backend is running on port 5001
        2. No firewall blocking connections
        3. MongoDB is running`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-cream py-5">
      <div className="glass-card p-4 p-md-5" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="text-center mb-4">
          <div className="bg-gradient-to-r from-apricot to-strawberry rounded-circle p-3 d-inline-block mb-3">
            <i className="bi bi-shield-lock text-white fs-2"></i>
          </div>
          <h2 className="font-script gradient-text">Admin Login</h2>
          <p className="text-muted">Cube Cake Administration Panel</p>
        </div>

        {/* Backend Status */}
        <div className={`alert ${backendStatus.includes('✅') ? 'alert-success' : 'alert-danger'} mb-4`}>
          <i className={`bi ${backendStatus.includes('✅') ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
          {backendStatus}
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Admin Email</label>
            <div className="input-group">
              <span className="input-group-text bg-cream">
                <i className="bi bi-envelope text-chocolate"></i>
              </span>
              <input
                type="email"
                className="form-control"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                required
                disabled={loading}
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
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-frosting w-100 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Authenticating...
              </>
            ) : (
              <>
                <i className="bi bi-shield-lock me-2"></i>
                Login as Administrator
              </>
            )}
          </button>

          <div className="text-center mb-3">
            <small className="text-muted">
              Default admin: <strong>admin@cubecake.com</strong> / <strong>admin123</strong>
            </small>
          </div>
        </form>

        {/* Debug Buttons */}
        <div className="mt-4">
          <button 
            onClick={checkBackendStatus}
            className="btn btn-outline-secondary w-100 mb-2"
            disabled={loading}
          >
            <i className="bi bi-arrow-repeat me-2"></i>
            Re-check Backend Status
          </button>
          
          <button 
            onClick={() => window.open('http://localhost:5001', '_blank')}
            className="btn btn-outline-primary w-100 mb-2"
          >
            <i className="bi bi-box-arrow-up-right me-2"></i>
            Open Backend Dashboard
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="btn btn-link text-decoration-none w-100"
            disabled={loading}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Back to Cake Shop
          </button>
        </div>

        {/* Troubleshooting Guide */}
        <div className="mt-4 p-3 bg-cream rounded">
          <h6 className="text-chocolate mb-2">Troubleshooting Steps:</h6>
          <ol className="text-muted small mb-0">
            <li>Check if backend terminal shows "Server started on port 5001"</li>
            <li>Test manually: Open <a href="http://localhost:5001" target="_blank" rel="noreferrer">http://localhost:5001</a></li>
            <li>Check MongoDB is running: <code>sudo systemctl status mongodb</code></li>
            <li>Check console (F12) for detailed errors</li>
            <li>Make sure all frontend files use port 5001</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;