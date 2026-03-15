'use client';

import { useApiData } from '../../../hooks/useApiData';
import { alertsService } from '../../../services/alerts.service';
import { Alert } from '../types/alerts.types';
import { MOCK_ALERTS } from '../../../lib/mock-data';
import { useCallback } from 'react';

export function useAlerts() {
  const fetcher = useCallback(() => alertsService.getAlerts(), []);

  const { data, isLoading, isUsingMock, error, refresh, isEmpty } = useApiData<Alert[]>({
    fetcher,
    mockData: MOCK_ALERTS as Alert[],
  });

  return {
    alerts: data,
    isLoading,
    isUsingMock,
    error,
    refresh,
    isEmpty,
  };
}
