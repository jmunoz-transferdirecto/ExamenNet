import axios from 'axios';
import { Product,  CreateOrderDTO, OrderResponse } from '../interfaces/types';

const API_URL = 'http://localhost:5038/api';

const axiosInstance = axios.create({
    baseURL: API_URL
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
  (response) => {
      const token = response.headers['x-auth-token'];
      if (token) {
          localStorage.setItem('token', token);
      }
      return response;
  },
  async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
              const response = await axios.get(`${API_URL}/auth/token`);
              const token = response.headers['x-auth-token'];
              if (token) {
                  localStorage.setItem('token', token);
                  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                  return axiosInstance(originalRequest);
              }
          } catch (refreshError) {
              console.error('Error refreshing token:', refreshError);
          }
      }
      return Promise.reject(error);
  }
);

const api = {
    getProducts: async () => {
        const response = await axiosInstance.get('/products');
        return response.data;
    },

    getProduct: async (id: number) => {
        const response = await axiosInstance.get(`/products/${id}`);
        return response.data;
    },

    createProduct: async (product: Omit<Product, 'id'>) => {
        const response = await axiosInstance.post('/products', product);
        return response.data;
    },

    updateProduct: async (id: number, product: Product) => {
        const response = await axiosInstance.put(`/products/${id}`, product);
        return response.data;
    },

    deleteProduct: async (id: number) => {
        await axiosInstance.delete(`/products/${id}`);
    },

    createOrder: async (orderData: CreateOrderDTO): Promise<OrderResponse> => {
      const response = await axiosInstance.post('/orders', orderData);
      return response.data;
  },

  getOrders: async (): Promise<OrderResponse[]> => {
      const response = await axiosInstance.get('/orders');
      return response.data;
  }
};

export default api;