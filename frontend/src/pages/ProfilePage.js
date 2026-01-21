import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../utils/api';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await apiService.updateProfile(profileForm);
      
      if (result.success) {
        // Update localStorage
        const updatedUser = { ...user, ...profileForm };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update context
        if (updateProfile) {
          await updateProfile(profileForm);
        }
        
        setMessage({ 
          type: 'success', 
          text: 'Profile updated successfully!' 
        });
        
        // Update form state with new data
        setProfileForm({
          name: result.data?.user?.name || profileForm.name,
          phone: result.data?.user?.phone || profileForm.phone
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: result.message || 'Failed to update profile' 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Network error. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMessage({ type: 'error', text: 'Not authenticated' });
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5001/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const testBackendConnection = async () => {
    const result = await apiService.checkBackendHealth();
    alert(`Backend Status: ${result.success ? '✅ Connected' : '❌ Disconnected'}\nMessage: ${result.message}`);
  };

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-card p-5">
          <h2>Please login to view your profile</h2>
          <button 
            className="btn btn-frosting mt-3"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-4">
          <div className="glass-card p-4">
            <div className="text-center mb-4">
              <div className="bg-gradient-to-r from-apricot to-strawberry rounded-circle p-3 d-inline-block mb-3">
                <i className="bi bi-person-circle text-white fs-2"></i>
              </div>
              <h5 className="fw-bold">{user.name}</h5>
              <p className="text-muted mb-0">{user.email}</p>
              <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-lavender'} mt-2`}>
                {user.role === 'admin' ? 'Administrator' : 'Customer'}
              </span>
            </div>

            <nav className="nav flex-column">
              <button
                className={`nav-link text-start mb-2 ${activeTab === 'profile' ? 'active text-apricot fw-bold' : 'text-chocolate'}`}
                onClick={() => setActiveTab('profile')}
              >
                <i className="bi bi-person me-2"></i>
                My Profile
              </button>
              <button
                className={`nav-link text-start mb-2 ${activeTab === 'password' ? 'active text-apricot fw-bold' : 'text-chocolate'}`}
                onClick={() => setActiveTab('password')}
              >
                <i className="bi bi-shield-lock me-2"></i>
                Change Password
              </button>
              <button
                className="nav-link text-start mb-2 text-chocolate"
                onClick={() => navigate('/my-orders')}
              >
                <i className="bi bi-bag-check me-2"></i>
                My Orders
              </button>
              {user.role === 'admin' && (
                <button
                  className="nav-link text-start mb-2 text-chocolate"
                  onClick={() => navigate('/admin')}
                >
                  <i className="bi bi-speedometer2 me-2"></i>
                  Admin Dashboard
                </button>
              )}
              <button
                className="nav-link text-start text-danger"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          <div className="glass-card p-4">
            {/* Message Alert */}
            {message.text && (
              <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>
                <i className={`bi ${message.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                {message.text}
              </div>
            )}

            {/* Test Connection Button */}
            <button 
              type="button"
              className="btn btn-outline-secondary mb-3"
              onClick={testBackendConnection}
            >
              <i className="bi bi-wrench me-2"></i>
              Test Backend Connection
            </button>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <>
                <h3 className="text-chocolate mb-4">My Profile</h3>
                <form onSubmit={handleProfileUpdate}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        value={user.email}
                        disabled
                      />
                      <small className="text-muted">Email cannot be changed</small>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Member Since</label>
                      <input
                        type="text"
                        className="form-control"
                        value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-frosting"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Update Profile
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Change Password Tab */}
            {activeTab === 'password' && (
              <>
                <h3 className="text-chocolate mb-4">Change Password</h3>
                <form onSubmit={handlePasswordChange}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Current Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        required
                      />
                      <small className="text-muted">Minimum 6 characters</small>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-frosting"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Changing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-shield-lock me-2"></i>
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="alert alert-info mt-4">
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>Password Tips:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Use at least 6 characters</li>
                    <li>Include numbers and letters</li>
                    <li>Avoid common words</li>
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Account Info Card */}
          <div className="glass-card p-4 mt-4">
            <h5 className="text-chocolate mb-3">Account Information</h5>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Account Type:</strong> {user.role === 'admin' ? 'Administrator' : 'Customer'}</p>
                <p><strong>Member Since:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Last Updated:</strong> {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Status:</strong> <span className="badge bg-success">Active</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;