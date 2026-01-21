import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../utils/api';
import { Navigate } from 'react-router-dom';

const MyOrdersPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchMyOrders();
  }, [isAuthenticated, navigate]);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const result = await apiService.getMyOrders();
      
      if (result.success) {
        setOrders(result.orders || []);
      } else {
        setError('Failed to load orders');
        setOrders([]);
      }
    } catch (error) {
      setError('Network error');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'pending') return order.status === 'Pending';
    if (filter === 'preparing') return order.status === 'Preparing';
    if (filter === 'ready') return order.status === 'Ready';
    if (filter === 'completed') return order.status === 'Completed';
    if (filter === 'cancelled') return order.status === 'Cancelled';
    return true;
  });

  const getStatusBadge = (status) => {
    const statusColors = {
      'Pending': 'warning',
      'Preparing': 'info',
      'Ready': 'primary',
      'Completed': 'success',
      'Cancelled': 'danger'
    };
    
    return (
      <span className={`badge bg-${statusColors[status] || 'secondary'}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getOrderTotal = (order) => {
    return `$${order.totalPrice?.toFixed(2) || '0.00'}`;
  };

  const handleReorder = (order) => {
    // Save order details to localStorage for reorder
    const reorderData = {
      base: order.base,
      frosting: order.frosting,
      size: order.size,
      layers: order.layers,
      toppings: order.toppings || [],
      message: order.message || '',
      colors: order.colors || {
        cake: '#D2691E',
        frosting: '#FFF5E6',
        decorations: '#FF6B8B'
      }
    };
    
    localStorage.setItem('cakeDesign', JSON.stringify(reorderData));
    navigate('/create');
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="font-script display-4 gradient-text">My Orders</h1>
        <p className="lead text-chocolate">
          Track and manage your cake orders
        </p>
      </div>

      {/* Stats Cards */}
      <div className="row mb-5">
        <div className="col-md-3 col-6 mb-3">
          <div className="glass-card p-3 text-center">
            <div className="fs-4 fw-bold text-apricot">{orders.length}</div>
            <div className="text-muted">Total Orders</div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="glass-card p-3 text-center">
            <div className="fs-4 fw-bold text-warning">
              {orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length}
            </div>
            <div className="text-muted">Active</div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="glass-card p-3 text-center">
            <div className="fs-4 fw-bold text-success">
              {orders.filter(o => o.status === 'Completed').length}
            </div>
            <div className="text-muted">Completed</div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="glass-card p-3 text-center">
            <div className="fs-4 fw-bold text-strawberry">
              ${orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0).toFixed(2)}
            </div>
            <div className="text-muted">Total Spent</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-4">
        <div className="row align-items-center">
          <div className="col-md-6 mb-3 mb-md-0">
            <h5 className="mb-0 text-chocolate">Order History</h5>
            <small className="text-muted">
              {filteredOrders.length} of {orders.length} orders
            </small>
          </div>
          <div className="col-md-6">
            <div className="d-flex flex-wrap gap-2">
              {['all', 'pending', 'preparing', 'ready', 'completed', 'cancelled'].map((filterType) => (
                <button
                  key={filterType}
                  className={`btn btn-sm ${filter === filterType ? 'btn-apricot' : 'btn-outline-apricot'}`}
                  onClick={() => setFilter(filterType)}
                >
                  {filterType === 'all' ? 'All Orders' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-apricot" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="text-center py-5">
          <div className="glass-card p-5">
            <i className="bi bi-exclamation-triangle text-warning fs-1 mb-3"></i>
            <h3>Error Loading Orders</h3>
            <p className="text-muted">{error}</p>
            <button 
              className="btn btn-frosting"
              onClick={fetchMyOrders}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Try Again
            </button>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-5">
          <div className="glass-card p-5">
            <i className="bi bi-bag text-muted fs-1 mb-3"></i>
            <h3 className="text-chocolate">No Orders Found</h3>
            <p className="text-muted mb-4">
              {filter === 'all' 
                ? "You haven't placed any orders yet. Start designing your first cake!"
                : `No ${filter} orders found`}
            </p>
            {filter === 'all' && (
              <button 
                className="btn btn-frosting"
                onClick={() => navigate('/create')}
              >
                <i className="bi bi-palette me-2"></i>
                Design Your First Cake
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Orders List */
        <div className="row">
          {filteredOrders.map((order) => (
            <div key={order._id || order.orderId} className="col-12 mb-4">
              <div className="glass-card p-4">
                <div className="row align-items-center">
                  {/* Order Info */}
                  <div className="col-md-4 mb-3 mb-md-0">
                    <h5 className="fw-bold text-chocolate">#{order.orderId}</h5>
                    <p className="mb-1">
                      <strong>Placed:</strong> {formatDate(order.createdAt)}
                    </p>
                    <p className="mb-1">
                      <strong>Delivery:</strong> {formatDate(order.deliveryDate)}
                    </p>
                    <p className="mb-0">
                      <strong>Type:</strong> {order.deliveryType === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
                    </p>
                  </div>

                  {/* Cake Details */}
                  <div className="col-md-4 mb-3 mb-md-0">
                    <h6 className="fw-bold">Cake Details</h6>
                    <p className="mb-1">
                      <strong>Base:</strong> {order.base || 'Custom'}
                    </p>
                    <p className="mb-1">
                      <strong>Size:</strong> {order.size || 'Medium'}
                    </p>
                    <p className="mb-0">
                      <strong>Layers:</strong> {order.layers || 2}
                    </p>
                  </div>

                  {/* Status & Actions */}
                  <div className="col-md-4">
                    <div className="d-flex flex-column align-items-md-end">
                      <div className="mb-2">
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="fs-4 fw-bold text-apricot mb-3">
                        {getOrderTotal(order)}
                      </div>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-sm btn-outline-apricot"
                          onClick={() => {
                            // View order details
                            alert(`Order Details:\n\nID: ${order.orderId}\nStatus: ${order.status}\nCustomer: ${order.customerName}\nTotal: $${order.totalPrice}\nDelivery: ${order.deliveryType}`);
                          }}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-strawberry"
                          onClick={() => handleReorder(order)}
                        >
                          <i className="bi bi-arrow-repeat"></i>
                        </button>
                        {order.status === 'Ready' && (
                          <button className="btn btn-sm btn-success">
                            <i className="bi bi-check-circle me-1"></i>
                            Pickup
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar for Active Orders */}
                {(order.status === 'Pending' || order.status === 'Preparing' || order.status === 'Ready') && (
                  <div className="mt-4">
                    <div className="d-flex justify-content-between mb-2">
                      <small>Order Placed</small>
                      <small>Preparing</small>
                      <small>Ready</small>
                      <small>Completed</small>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar bg-success" 
                        style={{ 
                          width: order.status === 'Pending' ? '25%' : 
                                 order.status === 'Preparing' ? '50%' : 
                                 order.status === 'Ready' ? '75%' : '100%' 
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Section */}
      <div className="glass-card p-4 mt-5">
        <h5 className="text-chocolate mb-3">Need Help With Your Order?</h5>
        <div className="row">
          <div className="col-md-6">
            <div className="d-flex align-items-start mb-3">
              <i className="bi bi-question-circle fs-4 text-apricot me-3"></i>
              <div>
                <h6>Order Status Questions</h6>
                <p className="text-muted mb-0">
                  Contact us at 0743086099 for updates on your order status.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex align-items-start mb-3">
              <i className="bi bi-clock fs-4 text-apricot me-3"></i>
              <div>
                <h6>Pickup & Delivery</h6>
                <p className="text-muted mb-0">
                  Store hours: 8AM - 8PM daily. Delivery: 10AM - 6PM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;