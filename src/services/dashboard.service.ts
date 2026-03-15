import api from '../lib/api';
import { DashboardData } from '../features/dashboard/types/dashboard.types';

export const dashboardService = {
  async getDashboard(): Promise<DashboardData | null> {
    const response = await api.get('/dashboard');
    return (response.data as any)?.data || null;
  },

  async getKPIs() {
    const response = await api.get('/dashboard/kpis');
    return (response.data as any)?.data || null;
  },

  async getCharts() {
    const response = await api.get('/dashboard/charts');
    return (response.data as any)?.data || null;
  },

  async getWidgets() {
    const response = await api.get('/dashboard/widgets');
    return (response.data as any)?.data || null;
  }
};
