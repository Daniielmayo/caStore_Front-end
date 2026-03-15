import api from '../lib/api';
import { Movement } from '../features/movements/types/movements.types';

export const movementsService = {
  async getMovements(): Promise<Movement[] | null> {
    const response = await api.get('/movements');
    return (response.data as any)?.data || null;
  },

  async createMovement(data: any): Promise<Movement | null> {
    const response = await api.post('/movements', data);
    return (response.data as any)?.data || null;
  }
};
