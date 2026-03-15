import api from '../lib/api';
import { User } from '../features/users/types/users.types';

export const usersService = {
  async getUsers(): Promise<User[] | null> {
    const response = await api.get('/users');
    return (response.data as any)?.data || null;
  }
};
