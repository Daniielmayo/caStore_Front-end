import api from '../lib/api';
import { Alert } from '../features/alerts/types/alerts.types';

export const alertsService = {
  async getAlerts(): Promise<Alert[] | null> {
    const response = await api.get('/alerts');
    return (response.data as any)?.data || null;
  },

  async resolveAlert(id: string): Promise<boolean> {
    const response = await api.patch(`/alerts/${id}/resolve`);
    return response.status === 200;
  }
};
