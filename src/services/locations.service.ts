import api from '../lib/api';
import { Location } from '../features/locations/types/locations.types';

export const locationsService = {
  async getLocations(): Promise<Location[] | null> {
    const response = await api.get('/locations');
    return (response.data as any)?.data || null;
  }
};
