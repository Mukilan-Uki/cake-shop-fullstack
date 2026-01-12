import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../utils/api';

const AdminPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Status options
  const statusOptions = ['all', 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
  
  // Status badge colors
  const statusColors = {
    'Pending': 'warning',
    'Preparing': 'info',
    'Ready': 'primary',
    'Completed': 'success',
    'Cancelled': 'danger'
  };

  // Fetch data from API
  useEffect(() => {
    fetchAdminData();
  }, []);

  // Function to fetch orders and stats
  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch orders from API
      const ordersResult = await apiService.getOrders();
      if (ordersResult.success) {
        setOrders(ordersResult.orders || []);
      } else {
        console.error('Failed to fetch orders:', ordersResult.message);
        setOrders([]);
      }
      
      // Fetch stats from API
      const statsResult = await apiService.getStats();
      if (statsResult.success) {
        setStats(statsResult.stats || {
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          totalRevenue: 0
        });
      } else {
        console.error('Failed to fetch stats:', statsResult.message);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      alert('Failed to load data. Please check if backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const result = await apiService.updateOrderStatus(orderId, newStatus);
      
      if (result.success) {
        // Update local orders array
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.orderId === orderId 
              ? { ...order, status: newStatus, updatedAt: new Date() }
              : order
          )
        );
        
        // Refresh stats
        const statsResult = await apiService.getStats();
        if (statsResult.success) {
          setStats(statsResult.stats);
        }
        
        alert(`✅ Order ${orderId} status updated to ${newStatus}`);
      } else {
        alert(`❌ Failed to update order: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('❌ Error updating order. Please try again.');
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    if (window.confirm(`Are you sure you want to delete order ${orderId}?\nThis action cannot be undone.`)) {
      try {
        // For now, we'll simulate deletion since we don't have delete endpoint
        // In a real app, you would call: await apiService.deleteOrder(orderId);
        setOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderId));
        
        // Update stats
        const updatedStats = {
          ...stats,
          totalOrders: stats.totalOrders - 1
        };
        
        // Update pending/completed counts
        const deletedOrder = orders.find(o => o.orderId === orderId);
        if (deletedOrder) {
          if (deletedOrder.status === 'Pending') {
            updatedStats.pendingOrders = Math.max(0, stats.pendingOrders - 1);
          } else if (deletedOrder.status === 'Completed') {
            updatedStats.completedOrders = Math.max(0, stats.completedOrders - 1);
          }
          updatedStats.totalRevenue = Math.max(0, stats.totalRevenue - (deletedOrder.totalPrice || 0));
        }
        
        setStats(updatedStats);
        alert(`🗑️ Order ${orderId} deleted successfully`);
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('❌ Error deleting order');
      }
    }
  };

  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter(order => {
    // Apply status filter
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.orderId?.toLowerCase().includes(searchLower) ||
        order.customerName?.toLowerCase().includes(searchLower) ||
        order.email?.toLowerCase().includes(searchLower) ||
        order.phone?.includes(searchTerm)
      );
    }
    
    return true;
  });

  // Calculate today's stats from orders
  const calculateTodaysStats = () => {
    const today = new Date().toDateString();
    const todaysOrders = orders.filter(order => 
      new Date(order.createdAt).toDateString() === today
    );
    
    return {
      newOrders: todaysOrders.length,
      cakesToPrepare: todaysOrders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length,
      deliveriesToday: todaysOrders.filter(o => 
        new Date(o.deliveryDate).toDateString() === today
      ).length,
      revenueToday: todaysOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
    };
  };

  const todaysStats = calculateTodaysStats();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Refresh data
  const handleRefresh = () => {
    fetchAdminData();
  };

  // Logout admin
  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  return (
    <div className="container-fluid px-0">
      {/* Admin Header */}
      <div className="bg-chocolate text-cream py-4">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="font-script fs-2 mb-0">
                <i className="bi bi-speedometer2 me-2"></i>
                Cake Shop Admin Dashboard
              </h1>
              <p className="mb-0 opacity-75">Manage orders and monitor performance in real-time</p>
            </div>
            <div className="d-flex gap-2">
              <button 
                onClick={handleRefresh}
                className="btn btn-outline-cream"
                disabled={isLoading}
              >
                <i className={`bi ${isLoading ? 'bi-arrow-clockwise spin' : 'bi-arrow-clockwise'} me-2`}></i>
                Refresh
              </button>
              <button 
                onClick={handleLogout}
                className="btn btn-outline-cream"
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {/* Stats Cards */}
        <div className="row mb-5">
          <div className="col-md-3 mb-4">
            <div className="glass-card p-4 text-center">
              <div className="display-6 fw-bold text-apricot">{stats.totalOrders}</div>
              <p className="text-muted mb-0">Total Orders</p>
              <small className="text-success">
                <i className="bi bi-arrow-up me-1"></i>
                +{todaysStats.newOrders} today
              </small>
            </div>
          </div>
          
          <div className="col-md-3 mb-4">
            <div className="glass-card p-4 text-center">
              <div className="display-6 fw-bold text-warning">{stats.pendingOrders}</div>
              <p className="text-muted mb-0">Pending Orders</p>
              <small className="text-warning">
                <i className="bi bi-clock me-1"></i>
                Needs attention
              </small>
            </div>
          </div>
          
          <div className="col-md-3 mb-4">
            <div className="glass-card p-4 text-center">
              <div className="display-6 fw-bold text-success">{stats.completedOrders}</div>
              <p className="text-muted mb-0">Completed</p>
              <small className="text-success">
                <i className="bi bi-check-circle me-1"></i>
                Delivered successfully
              </small>
            </div>
          </div>
          
          <div className="col-md-3 mb-4">
            <div className="glass-card p-4 text-center">
              <div className="display-6 fw-bold text-strawberry">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-muted mb-0">Total Revenue</p>
              <small className="text-success">
                <i className="bi bi-currency-dollar me-1"></i>
                +${todaysStats.revenueToday.toFixed(2)} today
              </small>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="glass-card p-4 mb-4">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-cream">
                  <i className="bi bi-search text-chocolate"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search orders by ID, name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            <div className="col-md-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Statuses' : `Status: ${status}`}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-md-2">
              <button 
                className="btn btn-frosting w-100"
                onClick={() => {
                  // Add new order functionality
                  alert('Add new order feature would open a form');
                }}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add Order
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="glass-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="mb-0">
              Orders ({filteredOrders.length})
              {searchTerm && <span className="text-muted fs-6 ms-2">for "{searchTerm}"</span>}
            </h3>
            
            <div className="d-flex align-items-center gap-2">
              <small className="text-muted">
                Showing {filteredOrders.length} of {orders.length} orders
              </small>
              {statusFilter !== 'all' && (
                <span className="badge bg-primary">
                  Filtered by: {statusFilter}
                </span>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-apricot" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading orders from database...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
              <h4 className="mt-3 text-chocolate">No Orders Found</h4>
              <p className="text-muted">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try changing your search or filter criteria'
                  : 'No orders in the system yet. Orders will appear here when customers place them.'}
              </p>
              {searchTerm || statusFilter !== 'all' ? (
                <button 
                  className="btn btn-outline-apricot"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Clear Filters
                </button>
              ) : null}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Cake Details</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Delivery Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.orderId || order._id}>
                      <td>
                        <strong className="text-primary">{order.orderId}</strong>
                        <br />
                        <small className="text-muted">
                          {formatDate(order.createdAt)}
                        </small>
                      </td>
                      <td>
                        <div className="fw-medium">{order.customerName}</div>
                        <small className="text-muted d-block">{order.email}</small>
                        <small className="text-muted">{order.phone}</small>
                      </td>
                      <td>
                        <div>
                          <small className="d-block">
                            <strong>Base:</strong> {order.base || 'Custom'}
                          </small>
                          <small className="d-block">
                            <strong>Size:</strong> {order.size || 'Medium'}
                          </small>
                          <small className="d-block">
                            <strong>Layers:</strong> {order.layers || 2}
                          </small>
                        </div>
                      </td>
                      <td className="fw-bold text-apricot">
                        ${order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}
                      </td>
                      <td>
                        <span className={`badge bg-${statusColors[order.status] || 'secondary'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        {formatDate(order.deliveryDate)}
                        <br />
                        <small className={`badge ${order.deliveryType === 'delivery' ? 'bg-info' : 'bg-secondary'}`}>
                          {order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              // View order details
                              alert(`Order Details:\n\nID: ${order.orderId}\nCustomer: ${order.customerName}\nStatus: ${order.status}\nTotal: $${order.totalPrice}\nDelivery: ${order.deliveryType}`);
                            }}
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          
                          <div className="dropdown">
                            <button 
                              className="btn btn-sm btn-outline-warning dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                              title="Change Status"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <ul className="dropdown-menu">
                              {Object.keys(statusColors).map(status => (
                                <li key={status}>
                                  <button 
                                    className="dropdown-item"
                                    onClick={() => updateOrderStatus(order.orderId, status)}
                                    disabled={order.status === status}
                                  >
                                    {order.status === status ? (
                                      <i className="bi bi-check-circle me-2 text-success"></i>
                                    ) : null}
                                    {status}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteOrder(order.orderId)}
                            title="Delete Order"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Stats & Actions */}
        <div className="row mt-5">
          <div className="col-md-4 mb-4">
            <div className="glass-card p-4 h-100">
              <h5 className="mb-3">
                <i className="bi bi-graph-up text-success me-2"></i>
                Today's Summary
              </h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="bi bi-cart-plus text-success me-2"></i>
                  New orders: <strong>{todaysStats.newOrders}</strong>
                </li>
                <li className="mb-2">
                  <i className="bi bi-clock text-warning me-2"></i>
                  Cakes to prepare: <strong>{todaysStats.cakesToPrepare}</strong>
                </li>
                <li className="mb-2">
                  <i className="bi bi-truck text-info me-2"></i>
                  Deliveries today: <strong>{todaysStats.deliveriesToday}</strong>
                </li>
                <li>
                  <i className="bi bi-cash-stack text-primary me-2"></i>
                  Revenue today: <strong>${todaysStats.revenueToday.toFixed(2)}</strong>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="glass-card p-4 h-100">
              <h5 className="mb-3">
                <i className="bi bi-bell text-warning me-2"></i>
                Recent Activity
              </h5>
              <div className="alert alert-warning mb-2 d-flex align-items-center">
                <i className="bi bi-exclamation-triangle me-2"></i>
                <div>
                  <strong>{stats.pendingOrders} pending orders</strong>
                  <small className="d-block">Need immediate attention</small>
                </div>
              </div>
              <div className="alert alert-info mb-2 d-flex align-items-center">
                <i className="bi bi-check-circle me-2"></i>
                <div>
                  <strong>{stats.completedOrders} orders completed</strong>
                  <small className="d-block">Ready for customer review</small>
                </div>
              </div>
              <div className="alert alert-success d-flex align-items-center">
                <i className="bi bi-cash-coin me-2"></i>
                <div>
                  <strong>${stats.totalRevenue.toFixed(2)} total revenue</strong>
                  <small className="d-block">Keep up the great work!</small>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="glass-card p-4 h-100">
              <h5 className="mb-3">
                <i className="bi bi-lightning text-purple me-2"></i>
                Quick Actions
              </h5>
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-outline-apricot"
                  onClick={() => window.print()}
                >
                  <i className="bi bi-printer me-2"></i>
                  Print Today's Orders
                </button>
                <button 
                  className="btn btn-outline-strawberry"
                  onClick={() => {
                    // Email functionality
                    alert('Email summary would be sent to admin');
                  }}
                >
                  <i className="bi bi-envelope me-2"></i>
                  Send Daily Summary
                </button>
                <button 
                  className="btn btn-outline-lavender"
                  onClick={handleRefresh}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Refresh All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for spinner animation */}
      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .table th {
          background-color: var(--cream);
          border-bottom: 2px solid var(--apricot);
        }
        
        .table td {
          vertical-align: middle;
        }
        
        .badge {
          font-size: 0.75em;
          padding: 0.35em 0.65em;
        }
      `}</style>
    </div>
  );
};

export default AdminPage;