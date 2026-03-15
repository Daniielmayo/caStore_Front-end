import React from 'react';
import { Users, UserCheck, UserX, Shield } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './UserSummaryCards.module.css';
import type { User } from '@/src/features/users/types/users.types';

interface UserSummaryCardsProps {
  users: User[];
  roleCount: number;
}

export function UserSummaryCards({ users, roleCount }: UserSummaryCardsProps) {
  const total = users.length;
  const active = users.filter(u => u.status === 'active').length;
  const inactive = total - active;

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={clsx(styles.iconWrapper, styles.orange)}>
          <Users size={24} />
        </div>
        <div className={styles.info}>
          <span className={styles.label}>Total Usuarios</span>
          <span className={styles.value}>{total}</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={clsx(styles.iconWrapper, styles.green)}>
          <UserCheck size={24} />
        </div>
        <div className={styles.info}>
          <span className={styles.label}>Usuarios Activos</span>
          <span className={styles.value}>{active}</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={clsx(styles.iconWrapper, styles.red)}>
          <UserX size={24} />
        </div>
        <div className={styles.info}>
          <span className={styles.label}>Usuarios Inactivos</span>
          <span className={styles.value}>{inactive}</span>
        </div>
      </div>

      <Link href="/roles" className={clsx(styles.card, styles.interactive)}>
        <div className={clsx(styles.iconWrapper, styles.blue)}>
          <Shield size={24} />
        </div>
        <div className={styles.info}>
          <span className={styles.label}>Roles Configurados</span>
          <span className={styles.value}>{roleCount}</span>
        </div>
        <div className={styles.chevron}>→</div>
      </Link>
    </div>
  );
}
