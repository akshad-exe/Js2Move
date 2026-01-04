import axios, { type AxiosInstance, type AxiosError } from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth tokens if needed
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle errors with toast notifications
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = (error.response.data as any)?.message || 'An error occurred';

      switch (status) {
        case 400:
          toast.error(`Bad Request: ${message}`);
          break;
        case 401:
          toast.error('Unauthorized. Please login again.');
          // Clear auth token and redirect to login
          localStorage.removeItem('authToken');
          break;
        case 403:
          toast.error('Forbidden. You do not have permission.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(`Error: ${message}`);
      }
    } else if (error.request) {
      // Request made but no response
      toast.error('No response from server. Please check your connection.');
    } else {
      // Error in request setup
      toast.error('Error: ' + error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
