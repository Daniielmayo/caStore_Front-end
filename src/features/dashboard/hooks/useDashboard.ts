'use client';

import { useCallback } from 'react';
import { useApiData } from '../../../hooks/useApiData';
import { dashboardService } from '../../../services/dashboard.service';
import { DashboardData } from '../types/dashboard.types';
import { MOCK_DASHBOARD } from '../../../lib/mock-data';

export function useDashboard() {
  const fetcher = useCallback(() => dashboardService.getDashboard(), []);

  const result = useApiData<DashboardData>({
    fetcher,
    mockData: MOCK_DASHBOARD,
    refreshInterval: 5 * 60 * 1000 // 5 minutos
  });

  return {
    data: result.data,
    isLoading: result.isLoading,
    error: result.error,
    isUsingMock: result.isUsingMock,
    isEmpty: result.isEmpty,
    refresh: result.refresh,
  };
}
