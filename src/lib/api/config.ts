import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Get API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage or Redux store
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // For FormData, let the browser set Content-Type with boundary
    // Don't override if it's already set to multipart/form-data
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear auth data and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            // Optionally redirect to login page
            // window.location.href = '/auth/sign-in';
          }
          break;
        case 403:
          // Forbidden
          break;
        case 404:
          // Not found
          break;
        case 500:
          // Server error
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

