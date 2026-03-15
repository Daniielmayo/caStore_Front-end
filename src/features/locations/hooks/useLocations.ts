'use client';

import { useApiData } from '../../../hooks/useApiData';
import { locationsService } from '../../../services/locations.service';
import { Location } from '../types/locations.types';
import { MOCK_LOCATIONS } from '../../../lib/mock-data';
import { useCallback } from 'react';

export function useLocations() {
  const fetcher = useCallback(() => locationsService.getLocations(), []);

  const { data, isLoading, isUsingMock, error, refresh, isEmpty } = useApiData<Location[]>({
    fetcher,
    mockData: MOCK_LOCATIONS as any[],
  });

  return {
    locations: data,
    isLoading,
    isUsingMock,
    error,
    refresh,
    isEmpty,
  };
}
