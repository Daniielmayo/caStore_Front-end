'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  X, 
  Warehouse, 
  Map as MapIcon, 
  Columns, 
  StretchVertical, 
  Grid2X2,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';
import clsx from 'clsx';
import { Location, LocationType, mockLocations } from '../../mockData';
import { locationSchema, LocationFormData } from '../../schemas/location.schema';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { useToast } from '../../../../components/ui/Toast';
import styles from './LocationForm.module.css';

interface LocationFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Location | null;
}

const TYPE_OPTIONS = [
  { value: 'WAREHOUSE' as LocationType, label: 'Almacén', icon: Warehouse, hint: 'Contenedor principal' },
  { value: 'ZONE' as LocationType, label: 'Zona', icon: MapIcon, hint: 'Ej: Zona A, Zona B' },
  { value: 'AISLE' as LocationType, label: 'Pasillo', icon: Columns, hint: 'Pasillos dentro de zona' },
  { value: 'SHELF' as LocationType, label: 'Estante', icon: StretchVertical, hint: 'Estantes en pasillo' },
  { value: 'CELL' as LocationType, label: 'Celda', icon: Grid2X2, hint: 'Ubicación granular' },
];

const HIERARCHY_MAP: Record<LocationType, LocationType | null> = {
  WAREHOUSE: null,
  ZONE: 'WAREHOUSE',
  AISLE: 'ZONE',
  SHELF: 'AISLE',
  CELL: 'SHELF',
};

const CODE_HINTS: Record<LocationType, string> = {
  WAREHOUSE: 'Ej: ALM-01',
  ZONE: 'Ej: ZA-01',
  AISLE: 'Ej: ZA-P1',
  SHELF: 'Ej: ZA-P1-E1',
  CELL: 'Ej: ZA-P1-E1-C1',
};

export function LocationFormDrawer({ isOpen, onClose, initialData }: LocationFormDrawerProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [codeStatus, setCodeStatus] = useState<'idle' | 'available' | 'taken'>('idle');

  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    reset,
    formState: { errors } 
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      type: 'ZONE',
      code: '',
      name: '',
    }
  });

  const watchedType = watch('type');
  const watchedCode = watch('code');

  useEffect(() => {
    if (initialData) {
      reset({
        type: initialData.type,
        code: initialData.code,
        name: initialData.name,
        parentId: initialData.parentId,
        capacity: initialData.capacity,
      });
    } else {
      reset({
        type: 'ZONE',
        code: '',
        name: '',
      });
    }
  }, [initialData, reset, isOpen]);

  // Simulate code availability check
  useEffect(() => {
    if (!watchedCode || watchedCode.length < 3) {
      setCodeStatus('idle');
      return;
    }

    setIsCheckingCode(true);
    const timer = setTimeout(() => {
      const exists = mockLocations.some(l => l.code === watchedCode.toUpperCase() && l.id !== initialData?.id);
      setCodeStatus(exists ? 'taken' : 'available');
      setIsCheckingCode(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [watchedCode, initialData]);

  const parentOptions = useMemo(() => {
    const parentType = HIERARCHY_MAP[watchedType];
    if (!parentType) return [];
    return mockLocations.filter(l => l.type === parentType);
  }, [watchedType]);

  const onSubmit = async (data: LocationFormData) => {
    if (codeStatus === 'taken') return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    showToast({ 
      message: initialData ? 'Ubicación actualizada' : 'Ubicación creada con éxito', 
      type: 'success' 
    });
    setIsLoading(false);
    onClose();
  };

  return (
    <div className={clsx(styles.overlay, { [styles.open]: isOpen })} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className={styles.title}>{initialData ? `Editar ${initialData.code}` : 'Nueva ubicación'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={24} />
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.body}>
            {/* Type Selection */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Tipo de Ubicación</label>
              <div className={styles.typeGrid}>
                {TYPE_OPTIONS.map(opt => {
                  const Icon = opt.icon;
                  const isSelected = watchedType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={clsx(styles.typeCard, { [styles.selected]: isSelected })}
                      onClick={() => {
                        setValue('type', opt.value);
                        setValue('parentId', ''); // Reset parent on type change
                      }}
                    >
                      <div className={styles.typeIcon}><Icon size={20} /></div>
                      <span className={styles.typeName}>{opt.label}</span>
                      {isSelected && <div className={styles.checkBadge}><Check size={10} /></div>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Parent Selection */}
            {watchedType !== 'WAREHOUSE' && (
              <div className={styles.fieldGroup}>
                <Select
                  label={`Ubicación Padre (${HIERARCHY_MAP[watchedType] === 'WAREHOUSE' ? 'Almacén' : HIERARCHY_MAP[watchedType]})`}
                  {...register('parentId')}
                  error={errors.parentId?.message}
                  required
                >
                  <option value="">Selecciona ubicación padre</option>
                  {parentOptions.map(p => (
                    <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                  ))}
                </Select>
                {parentOptions.length === 0 && (
                  <div className={styles.warningBox}>
                    <AlertTriangle size={14} />
                    <span>No hay {HIERARCHY_MAP[watchedType]} registrados para asignar como padre.</span>
                  </div>
                )}
              </div>
            )}

            {/* Code Field with Validation status */}
            <div className={styles.fieldGroup}>
              <div className={styles.codeRow}>
                <Input
                  label="Código de Ubicación"
                  {...register('code')}
                  error={errors.code?.message}
                  placeholder={CODE_HINTS[watchedType]}
                  hint={CODE_HINTS[watchedType]}
                  className={styles.flex1}
                  required
                />
                <div className={styles.statusIndicator}>
                  {isCheckingCode && <div className={styles.spinner} />}
                  {!isCheckingCode && codeStatus === 'available' && <Check size={18} className={styles.green} />}
                  {!isCheckingCode && codeStatus === 'taken' && <AlertTriangle size={18} className={styles.red} />}
                </div>
              </div>
              {codeStatus === 'taken' && <span className={styles.errorText}>Este código ya está en uso.</span>}
            </div>

            <Input
              label="Nombre de Ubicación"
              {...register('name')}
              error={errors.name?.message}
              placeholder="Ej: Estante de Carga Pesada"
              required
            />

            <Input
              label="Capacidad Máxima (Opcional)"
              type="number"
              {...register('capacity', { valueAsNumber: true })}
              error={errors.capacity?.message}
              placeholder="0"
              hint="Número máximo de unidades que puede almacenar"
            />

            <div className={styles.infoBanner}>
              <Info size={16} />
              <p>La jerarquía ayuda a organizar los productos y calcular la ocupación real del almacén.</p>
            </div>
          </div>

          <footer className={styles.footer}>
            <Button variant="secondary" type="button" onClick={onClose} className={styles.fullWidth}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              isLoading={isLoading} 
              disabled={codeStatus === 'taken' || isCheckingCode}
              className={styles.fullWidth}
            >
              {initialData ? 'Guardar cambios' : 'Guardar ubicación'}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
}
