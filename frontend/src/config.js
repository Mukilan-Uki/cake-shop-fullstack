// Central configuration for all API URLs
const API_BASE_URL = 'http://localhost:5001/api';
const BACKEND_URL = 'http://localhost:5001';
const FRONTEND_URL = 'http://localhost:3000';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  BACKEND_URL: BACKEND_URL,
  FRONTEND_URL: FRONTEND_URL,
  
  // Auth endpoints
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
    ADMIN_LOGIN: `${API_BASE_URL}/auth/admin/login`,
    VERIFY_ADMIN: `${API_BASE_URL}/auth/verify-admin`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
    ME: `${API_BASE_URL}/auth/me`,
    PROFILE_TEST: `${API_BASE_URL}/auth/profile-test`,
    TEST_POST: `${API_BASE_URL}/auth/test-post`
  },
  
  // Order endpoints
  ORDERS: {
    BASE: `${API_BASE_URL}/orders`,
    MY_ORDERS: `${API_BASE_URL}/orders/my-orders`,
    UPDATE_STATUS: (orderId) => `${API_BASE_URL}/orders/${orderId}/status`,
    DELETE: (orderId) => `${API_BASE_URL}/orders/${orderId}`,
    BY_STATUS: (status) => `${API_BASE_URL}/orders/status/${status}`
  },
  
  // Cake endpoints
  CAKES: `${API_BASE_URL}/cakes`,
  CAKES_SEED: `${API_BASE_URL}/cakes/seed`,
  
  // Stats endpoint
  STATS: `${API_BASE_URL}/stats`,
  
  // Email endpoints
  EMAIL: {
    TEST: `${API_BASE_URL}/email/test-email`,
    CONFIG: `${API_BASE_URL}/email/config`
  },
  
  // Test endpoints
  TEST: `${API_BASE_URL}/test`,
  TEST_AUTH: `${API_BASE_URL}/test-auth`
};