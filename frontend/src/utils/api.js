const API_BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  // Orders API
  async getOrders() {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      return { success: false, orders: [] };
    }
  },

  async createOrder(orderData) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      return { success: false, message: 'Failed to create order' };
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating order:', error);
      return { success: false, message: 'Failed to update order' };
    }
  },

  // Cakes API
  async getCakes() {
    try {
      const response = await fetch(`${API_BASE_URL}/cakes`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching cakes:', error);
      return { success: false, cakes: [] };
    }
  },

  // Stats API
  async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { success: false, stats: {} };
    }
  },

  // In your api.js file, add:

async deleteOrder(orderId) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting order:', error);
    return { success: false, message: 'Failed to delete order' };
  }
},

async getOrdersByStatus(status) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/status/${status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    return { success: false, orders: [] };
  }
}
};