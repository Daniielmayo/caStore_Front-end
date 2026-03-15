'use client';

import { useApiData } from '../../../hooks/useApiData';
import { movementsService } from '../../../services/movements.service';
import { Movement } from '../types/movements.types';
import { MOCK_MOVEMENTS } from '../../../lib/mock-data';
import { useCallback } from 'react';

export function useMovements() {
  const fetcher = useCallback(() => movementsService.getMovements(), []);

  const { data, isLoading, isUsingMock, error, refresh, isEmpty } = useApiData<Movement[]>({
    fetcher,
    mockData: MOCK_MOVEMENTS as Movement[],
  });

  return {
    movements: data,
    isLoading,
    isUsingMock,
    error,
    refresh,
    isEmpty,
  };
}
