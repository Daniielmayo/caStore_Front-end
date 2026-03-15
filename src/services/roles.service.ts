import api from '../lib/api';
import { Role } from '../features/roles/types/roles.types';

export const rolesService = {
  async getRoles(): Promise<Role[] | null> {
    const response = await api.get('/roles');
    return (response.data as any)?.data || null;
  }
};
