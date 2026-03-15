'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback } from 'react';
import { categoriesService } from '@/src/services/categories.service';
import type {
  Category,
  CategoryTreeItem,
  GetCategoriesParams,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  PaginatedCategories,
} from '../types/categories.types';
import { mockCategories } from '../mockData';

const CATEGORIES_KEY = 'categories';
const TREE_KEY = [CATEGORIES_KEY, 'tree'] as const;
const LIST_KEY = [CATEGORIES_KEY, 'list'] as const;
const DETAIL_KEY = [CATEGORIES_KEY, 'detail'] as const;

function buildTreeFromFlat(items: Category[]): CategoryTreeItem[] {
  const roots = items.filter((c) => !c.parentId);
  const byParent = new Map<string | null, Category[]>();
  items.forEach((c) => {
    const pid = c.parentId ?? null;
    if (!byParent.has(pid)) byParent.set(pid, []);
    byParent.get(pid)!.push(c);
  });
  function toNode(c: Category): CategoryTreeItem {
    const children = (byParent.get(c.id) ?? []).map(toNode);
    return {
      id: c.id,
      name: c.name,
      description: c.description ?? null,
      skuPrefix: c.skuPrefix,
      icon: c.icon ?? null,
      color: c.color ?? null,
      parentId: c.parentId ?? null,
      productCount: c.productCount,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      children,
    };
  }
  return roots.map(toNode);
}

/** Mock plana compatible con Category del tipo centralizado */
const MOCK_FLAT: Category[] = mockCategories.map((c) => ({
  id: c.id,
  name: c.name,
  description: c.description ?? null,
  skuPrefix: c.skuPrefix,
  icon: c.icon ?? null,
  color: c.color ?? null,
  parentId: c.parentId ?? null,
  parentName: null,
  productCount: c.productCount,
  createdAt: c.createdAt,
  updatedAt: undefined,
}));

type TreeResult = { tree: CategoryTreeItem[]; fromMock: boolean };

/** Árbol de categorías (GET /categories/tree). Fallback a mock si falla la API. */
export function useCategoriesTree() {
  const query = useQuery({
    queryKey: TREE_KEY,
    queryFn: async (): Promise<TreeResult> => {
      const data = await categoriesService.getTree();
      if (data && data.length >= 0) return { tree: data, fromMock: false };
      return { tree: buildTreeFromFlat(MOCK_FLAT), fromMock: true };
    },
    placeholderData: (): TreeResult => ({ tree: buildTreeFromFlat(MOCK_FLAT), fromMock: true }),
  });
  const result = query.data;
  const tree = result?.tree ?? buildTreeFromFlat(MOCK_FLAT);
  return {
    tree,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isUsingMock: result?.fromMock ?? true,
    error: query.error ? String(query.error) : null,
    refetch: query.refetch,
  };
}

/** Listado paginado (GET /categories). Fallback a mock. */
export function useCategoriesList(params: GetCategoriesParams = {}) {
  const { page = 1, limit = 10, search } = params;
  const query = useQuery({
    queryKey: [...LIST_KEY, page, limit, search ?? ''],
    queryFn: async (): Promise<PaginatedCategories & { fromMock: boolean }> => {
      const result = await categoriesService.getCategories(params);
      if (result) return { ...result, fromMock: false };
      const filtered = search
        ? MOCK_FLAT.filter(
            (c) =>
              c.name.toLowerCase().includes(search.toLowerCase()) ||
              c.skuPrefix.toLowerCase().includes(search.toLowerCase())
          )
        : MOCK_FLAT;
      const start = (page - 1) * limit;
      const data = filtered.slice(start, start + limit);
      return {
        data,
        pagination: {
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit) || 1,
          hasNextPage: page < Math.ceil(filtered.length / limit),
          hasPrevPage: page > 1,
          nextPage: page < Math.ceil(filtered.length / limit) ? page + 1 : null,
          prevPage: page > 1 ? page - 1 : null,
          from: filtered.length ? start + 1 : 0,
          to: Math.min(start + limit, filtered.length),
        },
        fromMock: true,
      };
    },
  });
  const result = query.data;
  return {
    data: result?.data ?? [],
    pagination: result?.pagination ?? undefined,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isUsingMock: result?.fromMock ?? true,
    error: query.error ? String(query.error) : null,
    refetch: query.refetch,
  };
}

/** Una categoría por ID (GET /categories/:id). */
export function useCategoryById(id: string | null) {
  const query = useQuery({
    queryKey: [...DETAIL_KEY, id],
    queryFn: async () => {
      if (!id) return null;
      const data = await categoriesService.getById(id);
      if (data) return data;
      return MOCK_FLAT.find((c) => c.id === id) ?? null;
    },
    enabled: !!id,
  });
  return {
    category: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error ? String(query.error) : null,
    refetch: query.refetch,
  };
}

/** Crear categoría. Invalida cache tras éxito. */
export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => categoriesService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
  });
}

/** Actualizar categoría. Invalida cache tras éxito. */
export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryPayload }) =>
      categoriesService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
  });
}

/** Eliminar categoría (soft delete). Invalida cache tras éxito. */
export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
  });
}

/** Hook legacy: árbol como lista plana para compatibilidad con página que espera categories + isLoading + etc. */
export function useCategories() {
  const { tree, isLoading, isUsingMock, error, refetch } = useCategoriesTree();
  const flatFromTree = useCallback((nodes: CategoryTreeItem[]): Category[] => {
    const out: Category[] = [];
    nodes.forEach((n) => {
      out.push({
        id: n.id,
        name: n.name,
        description: n.description,
        skuPrefix: n.skuPrefix,
        icon: n.icon,
        color: n.color,
        parentId: n.parentId,
        parentName: null,
        productCount: n.productCount,
        createdAt: n.createdAt,
        updatedAt: n.updatedAt,
      });
      if (n.children?.length) out.push(...flatFromTree(n.children));
    });
    return out;
  }, []);
  const categories = flatFromTree(tree);
  return {
    categories,
    tree,
    isLoading,
    isUsingMock,
    error: error ?? null,
    refresh: refetch,
    isEmpty: categories.length === 0,
  };
}
