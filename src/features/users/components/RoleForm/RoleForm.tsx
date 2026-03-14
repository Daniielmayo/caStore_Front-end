'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ArrowLeft, 
  Shield, 
  Check, 
  X, 
  Info, 
  AlertCircle,
  LayoutDashboard,
  Package,
  Bell,
  ArrowRightLeft,
  Truck,
  Users,
  Grid,
  MapPin,
  ChevronDown,
  ChevronUp,
  AlertTriangle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Role, mockRoles, ModuleId, PermissionSet } from '../../mockData';
import { roleSchema, RoleFormData } from '../../schemas/user.schema';
import styles from './RoleForm.module.css';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { useToast } from '../../../../components/ui/Toast';
import { RoleCard } from '../RolesList/RoleCard';

interface RoleFormProps {
  initialData?: Role;
  isEdit?: boolean;
}

const MODULES: { id: ModuleId; name: string; icon: any }[] = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', name: 'Productos', icon: Package },
  { id: 'alerts', name: 'Alertas de Stock', icon: Bell },
  { id: 'movements', name: 'Movimientos', icon: ArrowRightLeft },
  { id: 'suppliers', name: 'Proveedores', icon: Truck },
  { id: 'users', name: 'Usuarios', icon: Users },
  { id: 'categories', name: 'Categorías', icon: Grid },
  { id: 'locations', name: 'Localizaciones', icon: MapPin },
];

export function RoleForm({ initialData, isEdit = false }: RoleFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const defaultValues = useMemo(() => {
    if (initialData) return initialData;
    
    const perms: any = {};
    MODULES.forEach(m => {
      perms[m.id] = { consult: false, create: false, update: false, delete: false };
    });
    return { name: '', description: '', permissions: perms };
  }, [initialData]);

  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    control,
    formState: { errors } 
  } = useForm<any>({
    resolver: zodResolver(roleSchema),
    defaultValues
  });

  const watchedPermissions = watch('permissions');
  const watchedName = watch('name');

  const handleConsultToggle = (moduleId: string, value: boolean) => {
    setValue(`permissions.${moduleId}.consult`, value);
    if (!value) {
      // If consult is false, others MUST be false
      setValue(`permissions.${moduleId}.create`, false);
      setValue(`permissions.${moduleId}.update`, false);
      setValue(`permissions.${moduleId}.delete`, false);
    }
  };

  const setAllPerms = (mode: 'all' | 'none' | 'readonly') => {
    MODULES.forEach(m => {
      if (mode === 'all') {
        setValue(`permissions.${m.id}`, { consult: true, create: true, update: true, delete: true });
      } else if (mode === 'none') {
        setValue(`permissions.${m.id}`, { consult: false, create: false, update: false, delete: false });
      } else if (mode === 'readonly') {
        setValue(`permissions.${m.id}`, { consult: true, create: false, update: false, delete: false });
      }
    });
  };

  const getModuleSummary = (moduleId: string) => {
    const perms = watchedPermissions[moduleId];
    const count = Object.values(perms).filter(Boolean).length;
    if (count === 4) return { text: '4/4 completo', color: styles.summaryGreen };
    if (count === 0) return { text: '0/4 sin acceso', color: styles.summaryGray };
    if (count === 1 && perms.consult) return { text: '1/4 solo lectura', color: styles.summaryBlue };
    return { text: `${count}/4 parcial`, color: styles.summaryYellow };
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    showToast({ 
      message: isEdit ? 'Rol actualizado exitosamente' : 'Rol creado exitosamente', 
      type: 'success' 
    });
    setIsLoading(false);
    router.push('/roles');
  };

  const mockPreviewRole: Role = {
    id: 'preview',
    name: watchedName || 'Nuevo Rol',
    description: watch('description') || '',
    type: 'custom',
    userCount: 0,
    permissions: watchedPermissions
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{isEdit ? 'Editar rol' : 'Crear rol'}</h1>
          {isEdit && <p className={styles.subtitle}>{initialData?.name}</p>}
        </div>
        <Button variant="secondary" onClick={() => router.push('/roles')}>
          <ArrowLeft size={18} />
          Volver
        </Button>
      </div>

      {initialData?.type === 'system' && (
        <div className={styles.systemAlert}>
          <AlertTriangle size={20} />
          <p>Este es un rol del sistema y no puede modificarse. Si necesitas uno similar usa la opción <strong>Clonar</strong>.</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>Información básica</h3>
          <div className={styles.fieldGrid}>
            <div className={styles.fieldGroup}>
               <Input 
                 label="Nombre del rol" 
                 {...register('name')} 
                 error={errors.name?.message as string} 
                 required 
                 placeholder="Ej: Auditor Interno"
                 disabled={initialData?.type === 'system'}
               />
               <div className={styles.badgePreview}>
                  <small>Vista previa:</small>
                  <span className={styles.roleBadge}>{watchedName || 'Nombre del rol'}</span>
               </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Descripción (Opcional)</label>
              <textarea 
                className={styles.textarea}
                {...register('description')}
                placeholder="Explica el alcance de este rol..."
                disabled={initialData?.type === 'system'}
              />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.matrixHeader}>
            <div className={styles.matrixTitles}>
              <h3 className={styles.sectionTitle}>Configurar permisos</h3>
              <p className={styles.sectionSubtitle}>Define qué puede hacer este rol en cada módulo del sistema.</p>
            </div>
            <div className={styles.massActions}>
              <button type="button" onClick={() => setAllPerms('all')}>Seleccionar todo</button>
              <button type="button" onClick={() => setAllPerms('readonly')}>Solo lectura</button>
              <button type="button" onClick={() => setAllPerms('none')}>Ninguno</button>
            </div>
          </div>

          <div className={styles.matrixWrapper}>
            <table className={styles.matrix}>
              <thead>
                <tr>
                  <th className={styles.moduleCol}>Módulo</th>
                  <th>Consultar</th>
                  <th>Crear</th>
                  <th>Actualizar</th>
                  <th>Eliminar</th>
                  <th className={styles.summaryCol}>Resumen</th>
                </tr>
              </thead>
              <tbody>
                {MODULES.map(module => {
                  const summary = getModuleSummary(module.id);
                  const canAct = watchedPermissions[module.id].consult;

                  return (
                    <tr key={module.id} className={clsx({ [styles.rowDisabled]: !canAct })}>
                      <td className={styles.moduleCell}>
                        <module.icon size={18} className={styles.moduleIcon} />
                        <span>{module.name}</span>
                      </td>
                      <td>
                        <CustomCheckbox 
                          checked={watchedPermissions[module.id].consult}
                          onChange={(val) => handleConsultToggle(module.id, val)}
                          disabled={initialData?.type === 'system'}
                        />
                      </td>
                      <td>
                        <CustomCheckbox 
                          checked={watchedPermissions[module.id].create}
                          onChange={(val) => setValue(`permissions.${module.id}.create`, val)}
                          disabled={!canAct || initialData?.type === 'system'}
                        />
                      </td>
                      <td>
                        <CustomCheckbox 
                          checked={watchedPermissions[module.id].update}
                          onChange={(val) => setValue(`permissions.${module.id}.update`, val)}
                          disabled={!canAct || initialData?.type === 'system'}
                        />
                      </td>
                      <td>
                        <CustomCheckbox 
                          checked={watchedPermissions[module.id].delete}
                          onChange={(val) => setValue(`permissions.${module.id}.delete`, val)}
                          disabled={!canAct || initialData?.type === 'system'}
                        />
                      </td>
                      <td className={styles.summaryCell}>
                        <span className={clsx(styles.summaryBadge, summary.color)}>
                          {summary.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Collapsible Preview */}
        <div className={styles.previewSection}>
          <button 
            type="button" 
            className={styles.previewToggle}
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
          >
            <span>Vista previa del rol</span>
            {isPreviewOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {isPreviewOpen && (
            <div className={styles.previewBody}>
              <div className={styles.previewWrapper}>
                <RoleCard role={mockPreviewRole} onDelete={() => {}} />
              </div>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={() => router.push('/roles')}>Cancelar</Button>
          <Button type="submit" isLoading={isLoading} disabled={initialData?.type === 'system'}>
            {isEdit ? 'Guardar rol' : 'Crear rol'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function CustomCheckbox({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      className={clsx(styles.checkbox, { [styles.checked]: checked, [styles.disabledCheckbox]: disabled })}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      {checked && <Check size={14} strokeWidth={3} />}
    </button>
  );
}
