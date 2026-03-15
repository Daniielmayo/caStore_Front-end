import axios from 'axios';
import { getStoredToken, clearAuth } from '../lib/auth';
import { LoginCredentials, LoginResponse, AuthUser } from '../features/auth/types/auth.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const authClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT
authClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar 401
authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await authClient.post('/auth/login', credentials);
      return (response.data as any).data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  },

  async getMe(): Promise<AuthUser> {
    try {
      const response = await authClient.get('/auth/me');
      return (response.data as any).data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener datos del usuario');
    }
  },

  async recoverPassword(email: string): Promise<void> {
    try {
      await authClient.post('/auth/recover-password', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al recuperar contraseña');
    }
  },

  async resetPassword(data: {
    token: string;
    password: string;
    confirm: string;
  }): Promise<void> {
    try {
      await authClient.post('/auth/reset-password', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al restablecer contraseña');
    }
  }
};
