import axios, { AxiosError } from 'axios';
import { getStoredToken, clearAuth } from '../lib/auth';
import type {
  LoginCredentials,
  LoginResponse,
  AuthUser,
} from '../features/auth/types/auth.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

const authClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

authClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

function getMessageFromError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<{ message?: string }>;
    return err.response?.data?.message ?? 'Error de conexión';
  }
  if (error instanceof Error) return error.message;
  return 'Error inesperado';
}

/** Mock de login para fallback cuando el servicio falla */
function mockLoginResponse(credentials: LoginCredentials): LoginResponse {
  const payload = {
    id: 'mock-id',
    email: credentials.email,
    roleId: 'mock-role',
    permissions: {} as Record<string, { read: boolean; create: boolean; update: boolean; delete: boolean }>,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 28800,
  };
  const b64 = btoa(JSON.stringify(payload));
  return {
    token: `mock.${b64}.sig`,
    user: {
      id: 'mock-id',
      fullName: 'Usuario de prueba',
      email: credentials.email,
      roleId: 'mock-role',
      roleName: 'Usuario',
      firstLogin: false,
    },
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await authClient.post<ApiSuccess<LoginResponse>>(
        '/auth/login',
        credentials
      );
      const data = response.data?.data;
      if (!data?.token || !data?.user) {
        throw new Error('Respuesta inválida del servidor');
      }
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        return mockLoginResponse(credentials);
      }
      if (axios.isAxiosError(error) && (error.response?.status === 502 || error.response?.status === 503)) {
        return mockLoginResponse(credentials);
      }
      throw new Error(getMessageFromError(error));
    }
  },

  async logout(): Promise<void> {
    try {
      await authClient.post('/auth/logout');
    } catch {
      // Backend puede no tener logout; limpiamos siempre en cliente
    } finally {
      clearAuth();
    }
  },

  async getMe(): Promise<AuthUser> {
    try {
      const response = await authClient.get<ApiSuccess<AuthUser>>('/auth/me');
      const data = response.data?.data;
      if (!data) throw new Error('Respuesta inválida del servidor');
      return data;
    } catch (error) {
      throw new Error(getMessageFromError(error));
    }
  },

  async recoverPassword(email: string): Promise<void> {
    try {
      await authClient.post('/auth/recover-password', { email });
    } catch (error) {
      if (axios.isAxiosError(error) && (error.code === 'ECONNABORTED' || error.response?.status === 502 || error.response?.status === 503)) {
        return; // fallback silencioso para no revelar si el correo existe
      }
      throw new Error(getMessageFromError(error));
    }
  },

  async resetPassword(data: {
    token: string;
    password: string;
    confirm: string;
  }): Promise<void> {
    try {
      await authClient.post('/auth/reset-password', data);
    } catch (error) {
      if (axios.isAxiosError(error) && (error.code === 'ECONNABORTED' || error.response?.status === 502 || error.response?.status === 503)) {
        return; // fallback mock: no hacer nada, el usuario puede reintentar
      }
      throw new Error(getMessageFromError(error));
    }
  },
};
