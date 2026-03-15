'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { useProfile } from '@/src/features/profile/hooks/useProfile';
import { usersService } from '@/src/services/users.service';
import { profilePersonalSchema, type ProfilePersonalFormData } from '@/src/features/profile/schemas/profile.schema';
import type { AuthUser } from '@/src/features/auth/types/auth.types';
import { useToast } from '@/src/components/ui/Toast';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import styles from './ProfilePage.module.css';

const EMAIL_DEBOUNCE_MS = 500;

interface PersonalInfoSectionProps {
  user: AuthUser;
}

export function PersonalInfoSection({ user }: PersonalInfoSectionProps) {
  const { showToast } = useToast();
  const {
    updateProfile,
    isUpdatingProfile,
    refetch,
  } = useProfile();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, dirtyFields },
  } = useForm<ProfilePersonalFormData>({
    resolver: zodResolver(profilePersonalSchema) as Resolver<ProfilePersonalFormData>,
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
    },
  });

  const watchedEmail = watch('email');

  const checkEmailUnique = useCallback(
    async (email: string) => {
      if (!email || email === user.email) return;
      try {
        const exists = await usersService.checkEmailExists(email, user.id);
        if (exists) {
          setError('email', { type: 'manual', message: 'El correo ya está en uso' });
        } else {
          clearErrors('email');
        }
      } catch {
        // Sin permiso de listar usuarios (p. ej. 403): no bloquear; el backend validará al guardar.
        clearErrors('email');
      }
    },
    [user.id, user.email, setError, clearErrors]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!watchedEmail || watchedEmail === user.email) {
      clearErrors('email');
      return;
    }
    debounceRef.current = setTimeout(() => {
      checkEmailUnique(watchedEmail);
      debounceRef.current = null;
    }, EMAIL_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [watchedEmail, user.email, checkEmailUnique, clearErrors]);

  const hasEmailChanged = dirtyFields.email === true;

  const onSubmit = async (data: ProfilePersonalFormData) => {
    try {
      await updateProfile({ fullName: data.fullName, email: data.email });
      showToast({ message: 'Perfil actualizado correctamente', type: 'success' });
      refetch();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar el perfil';
      showToast({ message, type: 'error' });
      if (message.toLowerCase().includes('correo') || message.toLowerCase().includes('email')) {
        setError('email', { type: 'manual', message });
      }
    }
  };

  return (
    <section className={styles.formSection}>
      <h3 className={styles.sectionTitle}>Información personal</h3>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.sectionForm}>
        <div className={styles.fieldGrid}>
          <Input
            label="Nombre completo"
            {...register('fullName')}
            error={errors.fullName?.message}
          />
          <Input
            label="Correo electrónico"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        {hasEmailChanged && (
          <div className={styles.verificationNotice}>
            <AlertCircle size={16} />
            <p>Al cambiar tu correo podría ser necesario verificarlo según la política del sistema.</p>
          </div>
        )}

        <div className={styles.formActions}>
          <Button type="submit" isLoading={isUpdatingProfile}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </section>
  );
}
