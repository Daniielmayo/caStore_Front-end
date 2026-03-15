'use client';

import { useApiData } from '../../../hooks/useApiData';
import { suppliersService } from '../../../services/suppliers.service';
import { Supplier } from '../types/suppliers.types';
import { MOCK_SUPPLIERS } from '../../../lib/mock-data';
import { useCallback } from 'react';

export function useSuppliers() {
  const fetcher = useCallback(() => suppliersService.getSuppliers(), []);

  const { data, isLoading, isUsingMock, error, refresh, isEmpty } = useApiData<Supplier[]>({
    fetcher,
    mockData: MOCK_SUPPLIERS as any[], // Coerción temporal si los campos no coinciden 100%
  });

  return {
    suppliers: data,
    isLoading,
    isUsingMock,
    error,
    refresh,
    isEmpty,
  };
}
