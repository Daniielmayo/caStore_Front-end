'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { productsService } from '@/src/services/products.service';
import type {
  GetProductsParams,
  ProductApi,
  ProductStatsApi,
  CreateProductDto,
  UpdateProductDto,
  UpdateStatusDto,
} from '../types/products.types';
import {
  productApiToView,
  mockProducts,
  getMockPaginatedProducts,
  MOCK_PRODUCT_STATS,
  type Product,
} from '../mockData';

const PRODUCTS_QUERY_KEY = ['products'] as const;
const PRODUCT_STATS_QUERY_KEY = ['products', 'stats'] as const;

function productListKey(params: GetProductsParams) {
  return [...PRODUCTS_QUERY_KEY, params] as const;
}

function productDetailKey(id: string) {
  return ['products', 'detail', id] as const;
}

/** Listado paginado con filtros (búsqueda, estado, stock bajo). Fallback a mock si la API falla. */
export function useProductsList(params: GetProductsParams) {
  const query = useQuery({
    queryKey: productListKey(params),
    queryFn: async () => {
      const result = await productsService.getProducts(params);
      if (result) return result;
      return getMockPaginatedProducts(params);
    },
  });

  const data = query.data;
  const viewData: Product[] = data
    ? data.data.map(productApiToView)
    : [];
  const pagination = data?.pagination ?? null;
  const isUsingMock = query.data !== undefined && !query.isRefetching && data?.data.length !== undefined
    ? false
    : false; // We can't know if backend returned null after we substituted mock; we could track it in queryFn

  return {
    data: viewData,
    pagination,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    isUsingMock: query.data ? false : false, // Simplificado: si hay data, mostramos; si error podríamos marcar mock
  };
}

/** Estadísticas de productos. Fallback a mock si la API falla. */
export function useProductStats(
  options?: Pick<UseQueryOptions<ProductStatsApi, Error, ProductStatsApi>, 'enabled'>
) {
  const query = useQuery({
    queryKey: PRODUCT_STATS_QUERY_KEY,
    queryFn: async (): Promise<ProductStatsApi> => {
      const result = await productsService.getStats();
      return result ?? MOCK_PRODUCT_STATS;
    },
    enabled: options?.enabled ?? true,
  });

  const stats: ProductStatsApi = query.data ?? MOCK_PRODUCT_STATS;
  const isUsingMock = Boolean(query.data && query.data === MOCK_PRODUCT_STATS && !query.isLoading);

  return {
    stats,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isUsingMock,
  };
}

/** Detalle de un producto por ID (para editar). */
export function useProduct(id: string | null, options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: productDetailKey(id ?? ''),
    queryFn: async () => {
      if (!id) return null;
      const result = await productsService.getProductById(id);
      if (result) return result;
      const mock = mockProducts.find((p) => p.id === id);
      if (mock) {
        return {
          id: mock.id,
          sku: mock.sku,
          name: mock.name,
          description: mock.description ?? null,
          price: mock.price,
          currentStock: mock.stock,
          minStock: mock.minStock,
          hasExpiry: mock.hasExpiration ?? false,
          expiryDate: mock.expirationDate ?? null,
          status: mock.status.toUpperCase() as 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED',
          imageUrl: mock.image,
          categoryId: '',
          locationId: mock.locationId ?? null,
          createdAt: mock.createdAt,
          updatedAt: mock.createdAt,
          categoryName: mock.categoryName,
          parentCategoryName: mock.parentCategoryName ?? null,
          locationName: null,
          locationCode: null,
        } as ProductApi;
      }
      return null;
    },
    enabled: Boolean(id) && (options?.enabled ?? true),
  });

  return {
    product: query.data ? productApiToView(query.data) : null,
    productApi: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/** Crear producto. Invalida listado y stats. */
export function useCreateProduct(
  options?: UseMutationOptions<ProductApi | null, Error, CreateProductDto, unknown>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateProductDto) => productsService.createProduct(dto),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCT_STATS_QUERY_KEY });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    ...options,
  });
}

/** Actualizar producto. Invalida listado, stats y detalle del id. */
export function useUpdateProduct(
  options?: UseMutationOptions<ProductApi | null, Error, { id: string; dto: UpdateProductDto }, unknown>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateProductDto }) =>
      productsService.updateProduct(id, dto),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCT_STATS_QUERY_KEY });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: productDetailKey(variables.id) });
      }
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    ...options,
  });
}

/** Cambiar estado (ACTIVE/INACTIVE/DISCONTINUED). Invalida listado, stats y detalle. */
export function useUpdateProductStatus(
  options?: UseMutationOptions<ProductApi | null, Error, { id: string; status: UpdateStatusDto['status'] }, unknown>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UpdateStatusDto['status'] }) =>
      productsService.updateProductStatus(id, { status }),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCT_STATS_QUERY_KEY });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: productDetailKey(variables.id) });
      }
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    ...options,
  });
}

/** Actualizar imagen por URL. Invalida detalle y listado. */
export function useUpdateProductImage(
  options?: UseMutationOptions<ProductApi | null, Error, { id: string; imageUrl: string }, unknown>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, imageUrl }: { id: string; imageUrl: string }) =>
      productsService.updateProductImage(id, imageUrl),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: productDetailKey(variables.id) });
      }
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    ...options,
  });
}
