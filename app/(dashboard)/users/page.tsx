'use client';

import React from 'react';
import Link from 'next/link';
import { RefreshCw, Plus } from 'lucide-react';
import { ProtectedPage } from '@/src/features/auth/components/ProtectedPage';
import { PageWrapper } from '@/src/components/layout/PageWrapper';
import { MockWarning } from '@/src/components/common/MockWarning/MockWarning';
import { EmptyState } from '@/src/components/common/EmptyState/EmptyState';
import { SkeletonTable } from '@/src/components/common/Skeleton/SkeletonTable';
import { Button } from '@/src/components/ui/Button';
import { useUsers } from '@/src/features/users/hooks/useUsers';
import { UsersList } from '@/src/features/users/components/UsersList/UsersList';
import { AlertCircle, PackageSearch } from 'lucide-react';
import { clsx } from 'clsx';
import styles from './page.module.css';

export default function UsersPage() {
  const { users, isLoading, isUsingMock, error, refresh, isEmpty } = useUsers();

  if (error && !isUsingMock) {
    return (
      <ProtectedPage module="users">
        <div className={styles.errorContainer}>
          <div className={styles.errorCard}>
            <AlertCircle size={48} className={styles.errorIcon} />
            <h3>Error al cargar los usuarios</h3>
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
    <ProtectedPage module="users">
      <div className={styles.container}>
        <PageWrapper
          title="Gestión de Usuarios"
          subtitle="Administra el acceso y permisos del equipo"
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
              <Link href="/users/new" passHref legacyBehavior>
                <Button variant="primary">
                  <Plus size={16} />
                  Crear usuario
                </Button>
              </Link>
            </>
          }
        >
          {isUsingMock && <MockWarning />}
          {isLoading && !users?.length ? (
            <SkeletonTable rows={6} columns={5} />
          ) : isEmpty ? (
            <EmptyState
              title="No hay usuarios"
              message="No se encontraron usuarios registrados."
              icon={<PackageSearch size={48} />}
              action={{ label: 'Reintentar', onClick: refresh }}
            />
          ) : (
            <UsersList />
          )}
        </PageWrapper>
      </div>
    </ProtectedPage>
  );
}
