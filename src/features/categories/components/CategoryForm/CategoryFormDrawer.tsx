'use client';

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Send, Palette, Box, Activity, Cog, Shield, Zap, Search, PenTool, Layout, Droplets, Grid, Settings } from 'lucide-react';
import clsx from 'clsx';
import { categorySchema, CategoryFormData, generateSKUPrefix } from '../../schemas/category.schema';
import styles from './CategoryFormDrawer.module.css';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Category } from '../../mockData';

interface CategoryFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
  initialData?: Category | null;
  parentCategory?: Category | null;
  isLoading?: boolean;
}

const CAR_ICONS = [
  { name: 'Engine', icon: Activity },
  { name: 'Wheel', icon: Cog },
  { name: 'Brakes', icon: Shield },
  { name: 'Battery', icon: Zap },
  { name: 'Transmission', icon: Settings },
  { name: 'Body', icon: Grid },
  { name: 'Tools', icon: PenTool },
  { name: 'Oil', icon: Droplets },
  { name: 'Suspension', icon: Layout },
  { name: 'Electrical', icon: Zap },
  { name: 'Exhaust', icon: Activity },
  { name: 'Cooling', icon: Droplets }
];

const PRESET_COLORS = [
  '#F97316', '#0EA5E9', '#EF4444', '#EAB308', '#10B981', 
  '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6', '#64748B'
];

export function CategoryFormDrawer({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  parentCategory,
  isLoading
}: CategoryFormDrawerProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    values: initialData ? {
      name: initialData.name,
      description: initialData.description || '',
      parentId: initialData.parentId || '',
      icon: initialData.icon || 'Engine',
      color: initialData.color || '#F97316',
    } : {
      name: '',
      description: '',
      parentId: parentCategory?.id || '',
      icon: 'Engine',
      color: '#F97316',
    }
  });

  const categoryName = watch('name');
  const selectedIcon = watch('icon');
  const selectedColor = watch('color');
  const descriptionValue = watch('description') || '';

  const skuPreview = useMemo(() => generateSKUPrefix(categoryName), [categoryName]);

  const isEdit = !!initialData;
  const isSubcategory = !!parentCategory || !!initialData?.parentId;

  return (
    <>
      <div 
        className={clsx(styles.overlay, { [styles.overlayOpen]: isOpen })} 
        onClick={onClose} 
      />
      <div className={clsx(styles.drawer, { [styles.drawerOpen]: isOpen })}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <h2 className={styles.title}>
                {isEdit ? `Editar ${initialData.name}` : (isSubcategory ? `Nueva subcategoría en ${parentCategory?.name}` : 'Nueva categoría')}
              </h2>
              <p className={styles.subtitle}>Configura los detalles y jerarquía de clasificación.</p>
            </div>
            <button type="button" className={styles.closeBtn} onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className={styles.content}>
            <div className={styles.fieldGroup}>
              <Input
                label="Nombre de la categoría"
                placeholder="Ej. Transmisión"
                {...register('name')}
                error={errors.name?.message}
              />
              <div className={styles.skuPreviewRow}>
                 <span className={styles.skuHelp}>Prefijo SKU generado automáticamente:</span>
                 <code className={styles.skuBadge}>{skuPreview || '----'}</code>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label className={styles.fieldLabel}>Descripción (Opcional)</label>
                <span className={clsx(styles.counter, { [styles.counterError]: descriptionValue.length > 200 })}>
                  {descriptionValue.length}/200
                </span>
              </div>
              <textarea
                className={clsx(styles.textarea, { [styles.textareaError]: !!errors.description })}
                placeholder="Describe brevemente el tipo de productos que incluye esta categoría..."
                {...register('description')}
              />
              {errors.description && <span className={styles.errorText}>{errors.description.message}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Icono representativo</label>
              <div className={styles.iconGrid}>
                {CAR_ICONS.map(({ name, icon: Icon }) => (
                  <div 
                    key={name}
                    className={clsx(styles.iconItem, { [styles.iconItemSelected]: selectedIcon === name })}
                    onClick={() => setValue('icon', name)}
                    title={name}
                  >
                    <Icon size={20} />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Color distintivo</label>
              <div className={styles.colorPalette}>
                {PRESET_COLORS.map(color => (
                  <div 
                    key={color}
                    className={clsx(styles.colorCircle, { [styles.colorCircleSelected]: selectedColor === color })}
                    style={{ backgroundColor: color }}
                    onClick={() => setValue('color', color)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <Button variant="secondary" onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {isEdit ? 'Guardar cambios' : 'Crear categoría'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
