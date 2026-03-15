import api from '../lib/api';
import { Supplier } from '../features/suppliers/types/suppliers.types';

export const suppliersService = {
  async getSuppliers(): Promise<Supplier[] | null> {
    const response = await api.get('/suppliers');
    return (response.data as any)?.data || null;
  }
};
