'use client';

import { useApiData } from '../../../hooks/useApiData';
import { categoriesService } from '../../../services/categories.service';
import { Category } from '../types/categories.types';
import { MOCK_CATEGORIES } from '../../../lib/mock-data';
import { useCallback } from 'react';

export function useCategories() {
  const fetcher = useCallback(() => categoriesService.getCategories(), []);

  const { data, isLoading, isUsingMock, error, refresh, isEmpty } = useApiData<Category[]>({
    fetcher,
    mockData: MOCK_CATEGORIES as Category[],
  });

  return {
    categories: data,
    isLoading,
    isUsingMock,
    error,
    refresh,
    isEmpty,
  };
}
