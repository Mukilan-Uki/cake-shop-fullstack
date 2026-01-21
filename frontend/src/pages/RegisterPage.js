import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});

    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    });
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      setErrors({ general: result.message || 'Registration failed' });
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-cream">
        <div className="glass-card p-5 text-center" style={{ maxWidth: '500px' }}>
          <div className="display-1 text-success mb-3">🎉</div>
          <h2 className="font-script gradient-text mb-3">Welcome to Cube Cake!</h2>
          <p className="lead">Your account has been created successfully!</p>
          <p>Redirecting to homepage...</p>
          <div className="spinner-border text-apricot mt-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-cream py-5">
      <div className="glass-card p-4 p-md-5" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="text-center mb-4">
          <div className="bg-gradient-to-r from-apricot to-strawberry rounded-circle p-3 d-inline-block mb-3">
            <i className="bi bi-cake text-white fs-2"></i>
          </div>
          <h2 className="font-script gradient-text">Join Cube Cake</h2>
          <p className="text-muted">Create your account to track orders and save designs</p>
        </div>

        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {errors.general}
            </div>
          )}

          <div className="row g-3">
            {/* Name Field */}
            <div className="col-12">
              <label className="form-label">Full Name *</label>
              <div className="input-group">
                <span className="input-group-text bg-cream">
                  <i className="bi bi-person text-chocolate"></i>
                </span>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
            </div>

            {/* Email Field */}
            <div className="col-md-6">
              <label className="form-label">Email Address *</label>
              <div className="input-group">
                <span className="input-group-text bg-cream">
                  <i className="bi bi-envelope text-chocolate"></i>
                </span>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
            </div>

            {/* Phone Field */}
            <div className="col-md-6">
              <label className="form-label">Phone Number *</label>
              <div className="input-group">
                <span className="input-group-text bg-cream">
                  <i className="bi bi-phone text-chocolate"></i>
                </span>
                <input
                  type="tel"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  placeholder="07X XXX XXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>
            </div>

            {/* Password Field */}
            <div className="col-md-6">
              <label className="form-label">Password *</label>
              <div className="input-group">
                <span className="input-group-text bg-cream">
                  <i className="bi bi-lock text-chocolate"></i>
                </span>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
              <small className="text-muted">Minimum 6 characters</small>
            </div>

            {/* Confirm Password */}
            <div className="col-md-6">
              <label className="form-label">Confirm Password *</label>
              <div className="input-group">
                <span className="input-group-text bg-cream">
                  <i className="bi bi-lock-fill text-chocolate"></i>
                </span>
                <input
                  type="password"
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
              </div>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="form-check mt-4 mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="terms"
              required
            />
            <label className="form-check-label" htmlFor="terms">
              I agree to the{' '}
              <Link to="/terms" className="text-decoration-none text-apricot">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-decoration-none text-apricot">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-frosting w-100 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Creating Account...
              </>
            ) : (
              <>
                <i className="bi bi-person-plus me-2"></i>
                Create Account
              </>
            )}
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-muted mb-0">
              Already have an account?{' '}
              <Link to="/login" className="text-decoration-none fw-bold text-apricot">
                Sign in here
              </Link>
            </p>
          </div>
        </form>

        {/* Benefits Section */}
        <div className="mt-5 pt-4 border-top">
          <h6 className="text-chocolate mb-3">🎂 Benefits of Creating an Account:</h6>
          <ul className="list-unstyled text-muted">
            <li className="mb-2">
              <i className="bi bi-check-circle text-success me-2"></i>
              Track your orders in real-time
            </li>
            <li className="mb-2">
              <i className="bi bi-check-circle text-success me-2"></i>
              Save your favorite cake designs
            </li>
            <li className="mb-2">
              <i className="bi bi-check-circle text-success me-2"></i>
              Faster checkout process
            </li>
            <li>
              <i className="bi bi-check-circle text-success me-2"></i>
              Exclusive offers and discounts
            </li>
          </ul>
        </div>

        {/* Back Button */}
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

export default RegisterPage;