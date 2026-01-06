// Helper functions for Gallery
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(price);
};

export const getCategoryIcon = (category) => {
  const icons = {
    'Birthday': 'bi-balloon',
    'Wedding': 'bi-heart',
    'Anniversary': 'bi-calendar-heart',
    'Special': 'bi-star',
    'Spring': 'bi-flower1',
    'All': 'bi-grid'
  };
  return icons[category] || 'bi-cake';
};

export const simulateApiCall = (delay = 500) => {
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Local storage helper for cart
export const saveToCart = (cake) => {
  const cart = JSON.parse(localStorage.getItem('cakeCart') || '[]');
  cart.push({ ...cake, quantity: 1, addedAt: new Date().toISOString() });
  localStorage.setItem('cakeCart', JSON.stringify(cart));
  return cart.length;
};