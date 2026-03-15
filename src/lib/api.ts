import axios from 'axios';
import { getStoredToken, clearAuth } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 segundos timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuesta para manejo de errores y fallback
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Manejo de Timeout
    if (error.code === 'ECONNABORTED') {
      console.warn('⚠️ API timeout - Fallback a datos mock activado');
      return Promise.resolve({ data: null }); // Retornamos null para que el hook use el mock
    }

    // 2. Manejo de autenticación expirada
    if (error.response?.status === 401) {
      clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // 3. Otros errores en desarrollo: retornar null silenciosamente
    // En producción, podrías querer lanzar el error para el ErrorBoundary
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error silenciado para fallback:', error.message);
      return Promise.resolve({ data: null });
    }

    return Promise.reject(error);
  }
);

export default api;
