import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/Images/logo.ico'
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: 'bi-house' },
    { path: '/gallery', label: 'Gallery', icon: 'bi-images' },
    { path: '/create', label: 'Create', icon: 'bi-palette' },
    { path: '/order', label: 'Order', icon: 'bi-cart' },
  ];

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
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
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
            
            {/* Cart Button with Badge */}
            <li className="nav-item ms-3">
              <Link to="/order" className="btn btn-frosting position-relative">
                <i className="bi bi-cart3 me-2"></i>
                Cart
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-lavender">
                  3
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