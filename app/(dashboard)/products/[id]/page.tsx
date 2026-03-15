'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { ProductForm } from '@/src/features/products/components/ProductForm/ProductForm';
import { PageWrapper } from '@/src/components/layout/PageWrapper';
import { useProduct } from '@/src/features/products/hooks/useProducts';
import { SkeletonTable } from '@/src/components/common/Skeleton/SkeletonTable';

export default function EditProductPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : null;
  const { productApi, isLoading, error } = useProduct(id);

  if (!id) {
    notFound();
  }

  if (isLoading && !productApi) {
    return (
      <PageWrapper title="Editar producto">
        <SkeletonTable rows={8} columns={2} />
      </PageWrapper>
    );
  }

  if (error || !productApi) {
    notFound();
  }

  const initialData = {
    id: productApi.id,
    sku: productApi.sku,
    name: productApi.name,
    description: productApi.description ?? '',
    price: productApi.price,
    categoryId: productApi.categoryId,
    locationId: productApi.locationId ?? '',
    stock: productApi.currentStock,
    minStock: productApi.minStock,
    hasExpiration: productApi.hasExpiry,
    expirationDate: productApi.expiryDate ?? '',
    image: productApi.imageUrl,
  };

  return (
    <PageWrapper title="Editar producto">
      <ProductForm isEdit initialData={initialData} />
    </PageWrapper>
  );
}
