import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/Images/logo.ico';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  
  const navItems = [
    { path: '/', label: 'Home', icon: 'bi-house' },
    { path: '/gallery', label: 'Gallery', icon: 'bi-images' },
    { path: '/create', label: 'Create', icon: 'bi-palette' },
  ];

  const handleLogout = () => {
  logout();
  navigate('/');
};

  return (
    <nav className="navbar navbar-expand-lg glass-card mx-3 mt-3 sticky-top">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="bg-gradient-to-r from-apricot to-strawberry rounded-circle p-2 me-2">
            <i className="fs-4">
              <img src={logo} alt="Logo" className="img-fluid" />
            </i>
          </div>
          <span className="font-script fs-3 gradient-text">Cube Cake</span>
        </Link>

        {/* Mobile Toggle */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item mx-2">
                <Link 
                  to={item.path}
                  className={`nav-link d-flex align-items-center ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <i className={`bi ${item.icon} me-1`}></i>
                  {item.label}
                </Link>
              </li>
            ))}
            
            {/* Auth Links */}
            {isAuthenticated ? (
              <>
                <li className="nav-item mx-2">
                  <Link to="/my-orders" className="nav-link d-flex align-items-center">
                    <i className="bi bi-bag-check me-1"></i>
                    My Orders
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
                    <i className="bi bi-person-circle me-1"></i>
                    {user?.name?.split(' ')[0] || 'Account'}
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person me-2"></i>
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/my-orders">
                        <i className="bi bi-bag-check me-2"></i>
                        My Orders
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item mx-2">
                  <Link to="/login" className="nav-link d-flex align-items-center">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Login
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <Link to="/register" className="btn btn-outline-apricot">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
            
            {/* Cart Button */}
            <li className="nav-item ms-3">
              <Link to="/order" className="btn btn-frosting position-relative">
                <i className="bi bi-cart3 me-2"></i>
                Cart
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-lavender">
                  0
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;