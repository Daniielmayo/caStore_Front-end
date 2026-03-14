'use client';

import React from 'react';
import { 
  Shield, 
  Users, 
  Copy, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  MinusCircle
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { Role, PermissionSet } from '../../mockData';
import styles from './RoleCard.module.css';

interface RoleCardProps {
  role: Role;
  onDelete: (id: string) => void;
}

export function RoleCard({ role, onDelete }: RoleCardProps) {
  const isSystem = role.type === 'system';
  const hasUsers = role.userCount > 0;

  // Calculate access summary
  const getPermissionSummary = () => {
    const modules = Object.entries(role.permissions);
    
    const full: string[] = [];
    const partial: { name: string; count: number }[] = [];
    const none: string[] = [];

    modules.forEach(([id, perms]) => {
      const name = id.charAt(0).toUpperCase() + id.slice(1);
      const count = Object.values(perms).filter(Boolean).length;
      
      if (count === 4) full.push(name);
      else if (count === 0) none.push(name);
      else partial.push({ name, count });
    });

    return { full, partial, none };
  };

  const { full, partial, none } = getPermissionSummary();

  return (
    <div className={styles.card}>
      <header className={styles.header}>
        <div className={styles.titleBox}>
          <h3 className={styles.name}>{role.name}</h3>
          <span className={clsx(styles.badge, isSystem ? styles.badgeSystem : styles.badgeCustom)}>
            {isSystem ? 'Sistema' : 'Personalizado'}
          </span>
        </div>
        <div className={styles.userCount}>
          <Users size={14} />
          <span>{role.userCount} {role.userCount === 1 ? 'usuario' : 'usuarios'}</span>
        </div>
      </header>

      <div className={styles.body}>
        <div className={styles.summaryList}>
          {full.length > 0 && (
            <div className={styles.summaryItem}>
              <CheckCircle2 size={12} className={styles.fullIcon} />
              <span className={styles.summaryText}>
                <strong>Acceso total:</strong> {full.join(', ')}
              </span>
            </div>
          )}

          {partial.map(p => (
            <div key={p.name} className={styles.summaryItem}>
              <AlertCircle size={12} className={styles.partialIcon} />
              <span className={styles.summaryText}>
                <strong>{p.name}:</strong> ({p.count}/4)
              </span>
            </div>
          ))}

          {none.length > 0 && (
            <div className={styles.summaryItem}>
              <MinusCircle size={12} className={styles.noneIcon} />
              <span className={styles.summaryText}>
                <span className={styles.strikethrough}>{none.join(', ')}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.primaryActions}>
          <Link href={`/roles/${role.id}`}>
            <button className={styles.btnAction} title={isSystem ? 'Clonar para editar' : 'Editar'}>
              {isSystem ? <Copy size={16} /> : <Edit3 size={16} />}
              <span>{isSystem ? 'Clonar' : 'Editar'}</span>
            </button>
          </Link>
        </div>

        {!isSystem && (
           <div className={styles.dangerActions}>
              <button 
                className={clsx(styles.btnDelete, { [styles.disabled]: hasUsers })}
                disabled={hasUsers}
                onClick={() => onDelete(role.id)}
                title={hasUsers ? "No puedes eliminar un rol con usuarios asignados" : "Eliminar rol"}
              >
                <Trash2 size={16} />
              </button>
              {hasUsers && (
                <div className={styles.deleteTooltip}>Reasigna los usuarios primero</div>
              )}
           </div>
        )}
      </footer>
    </div>
  );
}
