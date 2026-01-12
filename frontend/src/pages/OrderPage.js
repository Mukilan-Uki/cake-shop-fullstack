import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../utils/api';

const OrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const design = location.state?.design || JSON.parse(localStorage.getItem('cakeDesign')) || {};

  const [orderDetails, setOrderDetails] = useState({
    customerName: '',
    phone: '',
    email: '',
    deliveryDate: '',
    deliveryAddress: '',
    deliveryType: 'pickup',
    specialInstructions: '',
    paymentMethod: 'cash'
  });

  

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  const orderData = {
    ...design,
    ...orderDetails,
    status: 'Pending',
    totalPrice: calculateTotalPrice()
  };

  // Remove sensitive fields if needed
  delete orderData.password;
  
  try {
    const result = await apiService.createOrder(orderData);
    
    if (result.success) {
        // Clear draft design
        localStorage.removeItem('cakeDesignDraft');
        localStorage.setItem('currentOrder', JSON.stringify(result.order));
        navigate('/success', { state: { order: result.order } });
      } else {
        alert('Failed to create order: ' + result.message);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order. Please try again.');
    }
  };

const calculateTotalPrice = () => {
  // Use actual design pricing
  const basePrice = 39.99;
  const customizationPrice = design.layers * 5 + (design.toppings?.length || 0) * 2;
  const deliveryPrice = orderDetails.deliveryType === 'delivery' ? 5.00 : 0;
  
  return basePrice + customizationPrice + deliveryPrice;
};


  return (
    <div className="container py-5">
      <h1 className="text-center mb-5 font-script display-4 gradient-text">
        Place Your Order
      </h1>

      <div className="row">
        {/* Order Summary */}
        <div className="col-lg-4 mb-4">
          <div className="glass-card p-4 sticky-top">
            <h4 className="mb-4">Order Summary</h4>
            
            {/* Design Preview */}
            <div className="mb-4">
              <h6>Your Cake Design:</h6>
              <p className="mb-1"><strong>Base:</strong> {design.base}</p>
              <p className="mb-1"><strong>Frosting:</strong> {design.frosting}</p>
              <p className="mb-1"><strong>Size:</strong> {design.size}</p>
              <p className="mb-1"><strong>Layers:</strong> {design.layers}</p>
              <p className="mb-1"><strong>Toppings:</strong> {design.toppings?.length || 0}</p>
            </div>

            {/* Price Breakdown */}
            <div className="border-top pt-3">
              <div className="d-flex justify-content-between mb-2">
                <span>Cake Base</span>
                <span>$39.99</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Customizations</span>
                <span>$15.00</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery</span>
                <span>{orderDetails.deliveryType === 'delivery' ? '$5.00' : 'FREE'}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold fs-5 mt-3 pt-3 border-top">
  <span>Total</span>
  <span className="text-apricot">${calculateTotalPrice().toFixed(2)}</span>
</div>
            </div>

            <button 
              type="submit" 
              form="orderForm"
              className="btn btn-frosting w-100 mt-4"
            >
              Place Order & Pay
            </button>
          </div>
        </div>

        {/* Order Form */}
        <div className="col-lg-8">
          <form id="orderForm" onSubmit={handleSubmit} className="glass-card p-4">
            <h4 className="mb-4">Customer Details</h4>
            
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={orderDetails.customerName}
                  onChange={(e) => setOrderDetails({...orderDetails, customerName: e.target.value})}
                />
              </div>
              
              <div className="col-md-6">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  className="form-control"
                  required
                  value={orderDetails.phone}
                  onChange={(e) => setOrderDetails({...orderDetails, phone: e.target.value})}
                />
              </div>
              
              <div className="col-md-6">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={orderDetails.email}
                  onChange={(e) => setOrderDetails({...orderDetails, email: e.target.value})}
                />
              </div>
              
              <div className="col-md-6">
                <label className="form-label">Delivery Date *</label>
                <input
                  type="date"
                  className="form-control"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={orderDetails.deliveryDate}
                  onChange={(e) => setOrderDetails({...orderDetails, deliveryDate: e.target.value})}
                />
              </div>

              {/* Delivery Type */}
              <div className="col-12">
                <label className="form-label">Delivery Method</label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="deliveryType"
                      value="pickup"
                      checked={orderDetails.deliveryType === 'pickup'}
                      onChange={(e) => setOrderDetails({...orderDetails, deliveryType: e.target.value})}
                    />
                    <label className="form-check-label">
                      <i className="bi bi-shop me-2"></i>
                      Store Pickup (FREE)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="deliveryType"
                      value="delivery"
                      checked={orderDetails.deliveryType === 'delivery'}
                      onChange={(e) => setOrderDetails({...orderDetails, deliveryType: e.target.value})}
                    />
                    <label className="form-check-label">
                      <i className="bi bi-truck me-2"></i>
                      Home Delivery ($5.00)
                    </label>
                  </div>
                </div>
              </div>

              {orderDetails.deliveryType === 'delivery' && (
                <div className="col-12">
                  <label className="form-label">Delivery Address *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    required
                    value={orderDetails.deliveryAddress}
                    onChange={(e) => setOrderDetails({...orderDetails, deliveryAddress: e.target.value})}
                    placeholder="Enter complete address"
                  />
                </div>
              )}

              <div className="col-12">
                <label className="form-label">Special Instructions</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Any special requests or allergies..."
                  value={orderDetails.specialInstructions}
                  onChange={(e) => setOrderDetails({...orderDetails, specialInstructions: e.target.value})}
                />
              </div>

              {/* Payment Method */}
              <div className="col-12">
                <label className="form-label">Payment Method</label>
                <select
                  className="form-select"
                  value={orderDetails.paymentMethod}
                  onChange={(e) => setOrderDetails({...orderDetails, paymentMethod: e.target.value})}
                >
                  <option value="cash">Cash on Delivery/Pickup</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="online">Online Payment</option>
                </select>
              </div>
            </div>
          </form>

          {/* Order Progress */}
          <div className="mt-4">
            <div className="d-flex justify-content-between mb-2">
              <span className={`badge ${design.base ? 'bg-success' : 'bg-secondary'}`}>
                1. Design Cake
              </span>
              <span className="badge bg-success">2. Order Details</span>
              <span className="badge bg-secondary">3. Confirmation</span>
            </div>
            <div className="progress" style={{ height: '8px' }}>
              <div 
                className="progress-bar bg-success" 
                style={{ width: '66%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;