'use client';

import { useApiData } from '../../../hooks/useApiData';
import { rolesService } from '../../../services/roles.service';
import { Role } from '../types/roles.types';
import { MOCK_ROLES } from '../../../lib/mock-data';
import { useCallback } from 'react';

export function useRoles() {
  const fetcher = useCallback(() => rolesService.getRoles(), []);

  const { data, isLoading, isUsingMock, error, refresh, isEmpty } = useApiData<Role[]>({
    fetcher,
    mockData: MOCK_ROLES as Role[],
  });

  return {
    roles: data,
    isLoading,
    isUsingMock,
    error,
    refresh,
    isEmpty,
  };
}
