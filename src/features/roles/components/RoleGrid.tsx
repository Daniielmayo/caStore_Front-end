'use client';

import React from 'react';
import { Role } from '../types/roles.types';
import styles from './RoleGrid.module.css';
import { Shield } from 'lucide-react';

export function RoleGrid({ roles }: { roles: Role[] }) {
  return (
    <div className={styles.grid}>
      {roles.map((r) => (
        <div key={r.id} className={styles.card}>
          <div className={styles.icon}><Shield size={24} /></div>
          <h3>{r.name}</h3>
          <p>Permisos configurados para este rol en el sistema.</p>
          <button className={styles.editBtn}>Gestionar Permisos</button>
        </div>
      ))}
    </div>
  );
}
