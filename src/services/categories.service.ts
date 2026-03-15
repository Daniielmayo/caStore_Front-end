import api from '../lib/api';
import { Category } from '../features/categories/types/categories.types';

export const categoriesService = {
  async getCategories(): Promise<Category[] | null> {
    const response = await api.get('/categories');
    return (response.data as any)?.data || null;
  }
};
