'use client';

import { useApiData } from '../../../hooks/useApiData';
import { usersService } from '../../../services/users.service';
import { User } from '../types/users.types';
import { MOCK_USERS } from '../../../lib/mock-data';
import { useCallback } from 'react';

export function useUsers() {
  const fetcher = useCallback(() => usersService.getUsers(), []);

  const { data, isLoading, isUsingMock, error, refresh, isEmpty } = useApiData<User[]>({
    fetcher,
    mockData: MOCK_USERS as User[],
  });

  return {
    users: data,
    isLoading,
    isUsingMock,
    error,
    refresh,
    isEmpty,
  };
}
