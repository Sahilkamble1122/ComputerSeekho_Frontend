// API Configuration
export const API_CONFIG = {
  // Replace with your Spring Boot backend URL
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  
  // API Endpoints
  ENDPOINTS: {
    STUDENTS: '/api/students',
    PAYMENT_HISTORY: '/api/receipts',
    PAYMENT_TYPES: '/api/payment-types',
    PROCESS_PAYMENT: '/api/payment-with-type',
    PLACEMENTS: '/api/placements',
    BATCHES: '/api/batches',
    COURSES: '/api/courses',
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
