'use client';

import React from 'react';
import Link from 'next/link';
import { RefreshCw, Plus } from 'lucide-react';
import { ProtectedPage } from '@/src/features/auth/components/ProtectedPage';
import { PageWrapper } from '@/src/components/layout/PageWrapper';
import { MockWarning } from '@/src/components/common/MockWarning/MockWarning';
import { EmptyState } from '@/src/components/common/EmptyState/EmptyState';
import { SkeletonGrid } from '@/src/components/common/Skeleton/SkeletonGrid';
import { Button } from '@/src/components/ui/Button';
import { useRoles } from '@/src/features/roles/hooks/useRoles';
import { RoleGrid } from '@/src/features/roles/components/RoleGrid';
import { AlertCircle, Shield } from 'lucide-react';
import { clsx } from 'clsx';
import styles from './page.module.css';

export default function RolesPage() {
  const { roles, isLoading, isUsingMock, error, refresh, isEmpty } = useRoles();

  if (error && !isUsingMock) {
    return (
      <ProtectedPage module="roles">
        <div className={styles.errorContainer}>
          <div className={styles.errorCard}>
            <AlertCircle size={48} className={styles.errorIcon} />
            <h3>Error al cargar los roles</h3>
            <p>{error}</p>
            <button type="button" onClick={refresh} className={styles.retryBtn}>
              <RefreshCw size={16} />
              Reintentar
            </button>
          </div>
        </div>
      </ProtectedPage>
    );
  }

  return (
    <ProtectedPage module="roles">
      <div className={styles.container}>
        <PageWrapper
          title="Roles y Permisos"
          subtitle="Define los niveles de acceso para cada tipo de usuario"
          actions={
            <>
              <button
                type="button"
                className={clsx(styles.refreshBtn, isLoading && styles.spinning)}
                onClick={refresh}
                disabled={isLoading}
              >
                <RefreshCw size={18} />
                <span>Actualizar</span>
              </button>
              <Link href="/roles/new" passHref legacyBehavior>
                <Button variant="primary">
                  <Plus size={16} />
                  Crear rol
                </Button>
              </Link>
            </>
          }
        >
          {isUsingMock && <MockWarning />}
          {isLoading && !roles?.length ? (
            <SkeletonGrid count={6} />
          ) : isEmpty ? (
            <EmptyState
              title="No hay roles"
              message="No se encontraron roles configurados."
              icon={<Shield size={48} />}
              action={{ label: 'Reintentar', onClick: refresh }}
            />
          ) : (
            <RoleGrid roles={roles} />
          )}
        </PageWrapper>
      </div>
    </ProtectedPage>
  );
}
