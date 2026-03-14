'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ArrowLeft, 
  Shield, 
  Check, 
  X, 
  Info, 
  AlertCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { User, mockRoles, mockUsers, Role } from '../../mockData';
import { userSchema, getInitials, UserFormData } from '../../schemas/user.schema';
import styles from './UserForm.module.css';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { useToast } from '../../../../components/ui/Toast';

interface UserFormProps {
  initialData?: User;
  isEdit?: boolean;
}

export function UserForm({ initialData, isEdit = false }: UserFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors } 
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      email: initialData.email,
      roleId: initialData.roleId,
      status: initialData.status
    } : {
      status: 'active'
    }
  });

  const watchedName = watch('name');
  const watchedRoleId = watch('roleId');
  const watchedEmail = watch('email');

  const selectedRole = useMemo(() => 
    mockRoles.find(r => r.id === watchedRoleId),
    [watchedRoleId]
  );

  const initials = useMemo(() => getInitials(watchedName || ''), [watchedName]);

  // Email uniqueness simulation
  useEffect(() => {
    if (!watchedEmail || watchedEmail === initialData?.email) {
      setEmailStatus('idle');
      return;
    }

    setEmailStatus('checking');
    const timer = setTimeout(() => {
      const exists = mockUsers.some(u => u.email === watchedEmail);
      setEmailStatus(exists ? 'taken' : 'available');
    }, 500);

    return () => clearTimeout(timer);
  }, [watchedEmail, initialData?.email]);

  const onSubmit = async (data: UserFormData) => {
    if (emailStatus === 'taken') return;
    
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    showToast({ 
      message: isEdit ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente', 
      type: 'success' 
    });
    setIsLoading(false);
    if (!isEdit) router.push('/users');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{isEdit ? 'Editar usuario' : 'Crear usuario'}</h1>
          {isEdit && <p className={styles.subtitle}>{initialData?.email}</p>}
        </div>
        <Button variant="secondary" onClick={() => router.push('/users')}>
          <ArrowLeft size={18} />
          Volver
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.layout}>
        {/* Left Column: Form Fields */}
        <div className={styles.formCol}>
          <div className={styles.card}>
            <div className={styles.avatarSection}>
              <div className={styles.avatarLarge}>
                {initials}
              </div>
              <p className={styles.avatarLabel}>Vista previa del avatar</p>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Datos Personales</h3>
              <div className={styles.fieldGrid}>
                <Input 
                  label="Nombre completo" 
                  {...register('name')} 
                  error={errors.name?.message} 
                  required 
                  placeholder="Ej: Juan Pérez"
                />
                
                <div className={styles.emailWrapper}>
                  <Input 
                    label="Correo electrónico" 
                    {...register('email')} 
                    error={errors.email?.message || (emailStatus === 'taken' ? 'Este correo ya está registrado' : '')} 
                    required 
                    placeholder="juan@castore.com"
                  />
                  {emailStatus === 'checking' && <div className={styles.emailLoading} />}
                  {emailStatus === 'available' && <Check className={styles.emailCheck} size={16} />}
                  {emailStatus === 'taken' && <X className={styles.emailTaken} size={16} />}
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Seguridad y Acceso</h3>
              <div className={styles.fieldGrid}>
                <Select label="Rol del sistema" {...register('roleId')} error={errors.roleId?.message} required>
                  <option value="">Seleccione un rol...</option>
                  {mockRoles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </Select>
              </div>

              {!isEdit ? (
                <div className={styles.infoAlert}>
                  <Info size={18} />
                  <p>Al crear el usuario se enviará una contraseña temporal automáticamente al correo registrado.</p>
                </div>
              ) : (
                <div className={styles.statusSection}>
                   <label className={styles.fieldLabel}>Estado del usuario</label>
                   <div className={styles.statusToggle}>
                      <span className={clsx(styles.toggleOption, { [styles.active]: watch('status') === 'active' })}>Activo</span>
                      <input type="checkbox" className={styles.hiddenCheckbox} {...register('status')} />
                      <span className={clsx(styles.toggleOption, { [styles.active]: watch('status') === 'inactive' })}>Inactivo</span>
                   </div>
                </div>
              )}

              {isEdit && initialData?.id === 'usr-001' && (
                <div className={styles.warningAlert}>
                  <ShieldAlert size={18} />
                  <p>Estás editando tu propio perfil. Cambiar tu rol puede afectar tu acceso al sistema.</p>
                </div>
              )}
            </div>

            <div className={styles.actions}>
              <Button type="button" variant="secondary" onClick={() => router.push('/users')}>Cancelar</Button>
              <Button type="submit" isLoading={isLoading} disabled={emailStatus === 'taken'}>
                {isEdit ? 'Guardar cambios' : 'Crear usuario'}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Permissions Preview */}
        <div className={styles.previewCol}>
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <div className={styles.previewIcon}><Shield size={20} /></div>
              <div>
                <h3 className={styles.previewTitle}>Permisos del rol seleccionado</h3>
                <p className={styles.previewSubtitle}>
                  {selectedRole ? `Heredados de: ${selectedRole.name}` : 'Seleccioné un rol para ver sus alcances'}
                </p>
              </div>
            </div>

            {!selectedRole ? (
              <div className={styles.emptyPreview}>
                <Shield size={48} />
                <p>Selecciona un rol para ver la matriz de permisos detallada</p>
              </div>
            ) : (
              <div className={styles.permissionMatrix}>
                {Object.entries(selectedRole.permissions).map(([moduleId, perms]) => (
                  <div key={moduleId} className={styles.matrixRow}>
                    <span className={styles.moduleName}>{moduleId.charAt(0).toUpperCase() + moduleId.slice(1)}</span>
                    <div className={styles.permsList}>
                      <PermIndicator active={perms.consult} label="C" />
                      <PermIndicator active={perms.create} label="R" />
                      <PermIndicator active={perms.update} label="U" />
                      <PermIndicator active={perms.delete} label="D" />
                    </div>
                  </div>
                ))}

                <div className={styles.previewFooter}>
                  <Link href={`/roles/${selectedRole.id}`} target="_blank" className={styles.roleLink}>
                    Ver y editar este rol <ExternalLink size={14} />
                  </Link>
                  {selectedRole.type === 'system' && (
                    <div className={styles.systemBadge}>
                      Rol del sistema
                      <div className={styles.badgeTooltip}>Los roles de sistema no pueden modificarse</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

function PermIndicator({ active, label }: { active: boolean; label: string }) {
  return (
    <div className={clsx(styles.permItem, { [styles.permActive]: active })}>
      {active ? <Check size={10} /> : <X size={10} />}
      <span>{label}</span>
    </div>
  );
}
