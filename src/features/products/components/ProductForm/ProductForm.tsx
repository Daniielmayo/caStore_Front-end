'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';

import { productSchema, ProductFormData } from '../../schemas/product.schema';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialData || {
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      locationId: '',
      stock: 0,
      minStock: 0,
      hasExpiration: false,
      expirationDate: '',
      image: null
    }
  });

  const hasExpiration = watch('hasExpiration');

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    showToast({
      message: isEdit ? 'Producto actualizado correctamente' : 'Producto creado correctamente',
      type: 'success'
    });
    router.push('/products');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      {isEdit && initialData?.sku && (
        <div className={styles.skuBanner}>
          <div className={styles.skuBannerContent}>
            <span className={styles.skuLabel}>SKU:</span>
            <Badge variant="default" className={styles.skuBadge}>{initialData.sku}</Badge>
            <span className={styles.skuHint}>
              <Info size={14} className={styles.infoIcon} />
              Generado automáticamente. No editable.
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
              <optgroup label="Motor">
                <option value="cat-1">Filtros</option>
                <option value="cat-2">Encendido</option>
                <option value="cat-3">Distribución</option>
              </optgroup>
              <optgroup label="Suspensión">
                <option value="cat-4">Amortiguadores</option>
                <option value="cat-5">Bujes</option>
              </optgroup>
              <optgroup label="Frenos">
                <option value="cat-6">Frenado</option>
                <option value="cat-7">Líquidos</option>
              </optgroup>
            </Select>

            <Select
              label="Ubicación en almacén"
              {...register('locationId')}
              error={errors.locationId?.message}
            >
              <option value="">Selecciona la ubicación</option>
              <option value="loc-1">A-01-01 (Estante A, Nivel 1)</option>
              <option value="loc-2">A-02-03 (Estante A, Nivel 2)</option>
              <option value="loc-3">B-01-05 (Estante B, Nivel 1)</option>
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
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                  />
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
        <Button variant="secondary" type="button" onClick={() => router.push('/products')} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit" isLoading={isSubmitting}>
          {isEdit ? 'Guardar cambios' : 'Guardar producto'}
        </Button>
      </div>
    </form>
  );
}
