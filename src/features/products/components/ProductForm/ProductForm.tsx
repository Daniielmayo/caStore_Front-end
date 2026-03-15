'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Info } from 'lucide-react';

import { productSchema, ProductFormData } from '../../schemas/product.schema';
import { useCreateProduct, useUpdateProduct, useUpdateProductImage } from '../../hooks/useProducts';
import { categoriesService } from '@/src/services/categories.service';
import { locationsService } from '@/src/services/locations.service';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { Select } from '@/src/components/ui/Select';
import { Button } from '@/src/components/ui/Button';
import { Switch } from '@/src/components/ui/Switch';
import { ImageUpload } from '@/src/components/ui/ImageUpload';
import { Badge } from '@/src/components/ui/Badge';
import { useToast } from '@/src/components/ui/Toast';

import styles from './ProductForm.module.css';

interface ProductFormProps {
  initialData?: ProductFormData & { id?: string; sku?: string };
  isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit }: ProductFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const { data: categoriesRes } = useQuery({
    queryKey: ['categories', 'list'],
    queryFn: () => categoriesService.getCategories({ limit: 200 }),
  });
  const { data: locationsRes } = useQuery({
    queryKey: ['locations', 'list'],
    queryFn: () => locationsService.getLocations({ page: 1, limit: 500 }),
  });

  const categories = categoriesRes?.data ?? [];
  const locations = locationsRes?.data ?? [];

  const createMutation = useCreateProduct({
    onSuccess: () => {
      showToast({ message: 'Producto creado correctamente', type: 'success' });
      router.push('/products');
    },
    onError: () => {
      showToast({ message: 'Error al crear el producto. Intenta de nuevo.', type: 'error' });
    },
  });

  const updateMutation = useUpdateProduct({
    onSuccess: () => {
      showToast({ message: 'Producto actualizado correctamente', type: 'success' });
      router.push('/products');
    },
    onError: () => {
      showToast({ message: 'Error al actualizar el producto. Intenta de nuevo.', type: 'error' });
    },
  });

  const updateImageMutation = useUpdateProductImage();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormData>,
    defaultValues: initialData ?? {
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      locationId: '',
      stock: 0,
      minStock: 0,
      hasExpiration: false,
      expirationDate: '',
      image: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      setValue('description', initialData.description ?? '');
      setValue('price', initialData.price);
      setValue('categoryId', initialData.categoryId ?? '');
      setValue('locationId', initialData.locationId ?? '');
      setValue('stock', initialData.stock ?? 0);
      setValue('minStock', initialData.minStock ?? 0);
      setValue('hasExpiration', initialData.hasExpiration ?? false);
      setValue('expirationDate', initialData.expirationDate ?? '');
      setValue('image', initialData.image ?? null);
    }
  }, [initialData, setValue]);

  const hasExpiration = watch('hasExpiration');
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (data: ProductFormData) => {
    if (isEdit && initialData?.id) {
      const dto = {
        name: data.name,
        description: data.description || undefined,
        price: data.price,
        minStock: data.minStock,
        categoryId: data.categoryId,
        locationId: data.locationId || undefined,
        hasExpiry: data.hasExpiration,
        expiryDate: data.hasExpiration ? data.expirationDate || undefined : undefined,
      };
      updateMutation.mutate({ id: initialData.id, dto });
      if (data.image && data.image !== (initialData as { image?: string | null }).image) {
        updateImageMutation.mutate({ id: initialData.id, imageUrl: data.image });
      }
    } else {
      const dto = {
        name: data.name,
        description: data.description || undefined,
        price: data.price,
        currentStock: data.stock ?? 0,
        minStock: data.minStock,
        categoryId: data.categoryId,
        locationId: data.locationId || undefined,
        hasExpiry: data.hasExpiration,
        expiryDate: data.hasExpiration ? data.expirationDate || undefined : undefined,
      };
      createMutation.mutate(dto);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      {isEdit && initialData?.sku && (
        <div className={styles.skuBanner}>
          <div className={styles.skuBannerContent}>
            <span className={styles.skuLabel}>SKU:</span>
            <Badge variant="default" className={styles.skuBadge}>
              {initialData.sku}
            </Badge>
            <span className={styles.skuHint}>
              <Info size={14} className={styles.infoIcon} />
              Generado automáticamente por el backend. No editable.
            </span>
          </div>
        </div>
      )}

      <div className={styles.grid}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Información básica</h2>
          <div className={styles.fields}>
            <Input
              label="Nombre del producto"
              placeholder="Ej: Filtro de Aceite Bosch"
              {...register('name')}
              error={errors.name?.message}
            />
            <Textarea
              label="Descripción"
              placeholder="Detalles sobre compatibilidad, características, etc."
              {...register('description')}
              error={errors.description?.message}
            />
            <Input
              label="Precio"
              type="number"
              placeholder="0"
              prefixNode="$"
              {...register('price')}
              error={errors.price?.message}
            />
          </div>
        </div>

        <div className={styles.sideCol}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Imagen del producto</h2>
            <div className={styles.fields}>
              <Controller
                control={control}
                name="image"
                render={({ field }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.image?.message}
                  />
                )}
              />
              <p className={styles.imageHint}>URL o archivo. Se guarda por PATCH /products/:id/image.</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Clasificación</h2>
          <div className={styles.fields}>
            <Select
              label="Categoría"
              {...register('categoryId')}
              error={errors.categoryId?.message}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.parentName ? `${cat.parentName} › ` : ''}{cat.name}
                </option>
              ))}
            </Select>

            <Select
              label="Ubicación en almacén"
              {...register('locationId')}
              error={errors.locationId?.message}
            >
              <option value="">Selecciona la ubicación (opcional)</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Inventario</h2>
          <div className={styles.fields}>
            <div className={styles.rowFields}>
              <Input
                label="Stock actual"
                type="number"
                hint="Cantidad física disponible ahora mismo"
                {...register('stock')}
                error={errors.stock?.message}
                disabled={isEdit}
              />
              <Input
                label="Stock mínimo"
                type="number"
                hint="Genera alerta al llegar a este valor"
                {...register('minStock')}
                error={errors.minStock?.message}
              />
            </div>

            <div className={styles.toggleField}>
              <div className={styles.toggleText}>
                <span className={styles.toggleLabel}>Fecha de vencimiento</span>
                <span className={styles.toggleHint}>Genera alertas a los 30, 15 y 7 días</span>
              </div>
              <Controller
                control={control}
                name="hasExpiration"
                render={({ field }) => (
                  <Switch checked={field.value} onChange={field.onChange} />
                )}
              />
            </div>

            {hasExpiration && (
              <Input
                label="Fecha de vencimiento"
                type="date"
                {...register('expirationDate')}
                error={errors.expirationDate?.message}
              />
            )}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <Button
          variant="secondary"
          type="button"
          onClick={() => router.push('/products')}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button variant="primary" type="submit" isLoading={isSubmitting}>
          {isEdit ? 'Guardar cambios' : 'Guardar producto'}
        </Button>
      </div>
    </form>
  );
}
