import { API_CONFIG } from '../config';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const apiService = {
  // ========== AUTH API ==========
  async register(userData) {
    try {
      console.log('📝 Registering user at:', API_CONFIG.AUTH.REGISTER);
      const response = await fetch(API_CONFIG.AUTH.REGISTER, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Registration error:', error);
      return { 
        success: false, 
        message: 'Network error. Check if backend is running on port 5001.' 
      };
    }
  },

  async login(credentials) {
    try {
      console.log('🔐 Logging in at:', API_CONFIG.AUTH.LOGIN);
      const response = await fetch(API_CONFIG.AUTH.LOGIN, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Login error:', error);
      return { 
        success: false, 
        message: 'Cannot connect to server on port 5001.' 
      };
    }
  },

  async adminLogin(credentials) {
    try {
      const response = await fetch(API_CONFIG.AUTH.ADMIN_LOGIN, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(credentials)
      });
      
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: 'Cannot connect to admin server' 
      };
    }
  },

  async verifyAdmin() {
    try {
      const response = await fetch(API_CONFIG.AUTH.VERIFY_ADMIN, {
        headers: getAuthHeaders()
      });
      
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Admin verification failed' };
    }
  },

  async getProfile() {
    try {
      const response = await fetch(API_CONFIG.AUTH.ME, {
        headers: getAuthHeaders()
      });
      
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await fetch(API_CONFIG.AUTH.PROFILE, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData)
      });
      
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  },

  // ========== ORDERS API ==========
  async getOrders() {
    try {
      const response = await fetch(API_CONFIG.ORDERS.BASE, {
        headers: getAuthHeaders()
      });
      
      return await response.json();
    } catch (error) {
      return { success: false, orders: [] };
    }
  },

  async getMyOrders() {
    try {
      const response = await fetch(API_CONFIG.ORDERS.MY_ORDERS, {
        headers: getAuthHeaders()
      });
      
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  },

  async createOrder(orderData) {
    try {
      const response = await fetch(API_CONFIG.ORDERS.BASE, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData)
      });
      
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: 'Failed to create order' 
      };
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const response = await fetch(API_CONFIG.ORDERS.UPDATE_STATUS(orderId), {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Failed to update order' };
    }
  },

  async deleteOrder(orderId) {
    try {
      const response = await fetch(API_CONFIG.ORDERS.DELETE(orderId), {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Failed to delete order' };
    }
  },

  async getOrdersByStatus(status) {
    try {
      const response = await fetch(API_CONFIG.ORDERS.BY_STATUS(status), {
        headers: getAuthHeaders()
      });
      
      return await response.json();
    } catch (error) {
      return { success: false, orders: [] };
    }
  },

  // ========== CAKES API ==========
  async getCakes() {
    try {
      const response = await fetch(API_CONFIG.CAKES, {
        headers: getAuthHeaders()
      });
      
      return await response.json();
    } catch (error) {
      return { success: false, cakes: [] };
    }
  },

  // ========== STATS API ==========
  async getStats() {
    try {
      const response = await fetch(API_CONFIG.STATS, {
        headers: getAuthHeaders()
      });
      
      return await response.json();
    } catch (error) {
      return { success: false, stats: {} };
    }
  },

  // ========== TEST & HEALTH ==========
  async checkBackendHealth() {
    try {
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/health`, {
        headers: { 'Accept': 'application/json' }
      });
      
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: 'Backend is not responding on port 5001' 
      };
    }
  },

  async testConnection() {
    try {
      const response = await fetch(API_CONFIG.TEST, {
        headers: { 'Accept': 'application/json' }
      });
      
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Cannot connect to API' };
    }
  },

  async testAuth() {
    try {
      const response = await fetch(API_CONFIG.TEST_AUTH, {
        headers: getAuthHeaders()
      });
      
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Auth test failed' };
    }
  }
};