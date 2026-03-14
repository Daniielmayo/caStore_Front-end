'use client';

import React, { useState } from 'react';
import { 
  Edit2, 
  Mail, 
  MoreVertical, 
  Trash2, 
  Power, 
  AlertTriangle,
  Send,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { User, mockRoles } from '../../mockData';
import { getInitials } from '../../schemas/user.schema';
import styles from './UsersTable.module.css';
import { Button } from '../../../../components/ui/Button';
import { useToast } from '../../../../components/ui/Toast';

interface UsersTableProps {
  users: User[];
  onToggleStatus: (id: string, currentStatus: string) => void;
}

export function UsersTable({ users, onToggleStatus }: UsersTableProps) {
  const { showToast } = useToast();
  const [confirmModal, setConfirmModal] = useState<{ id: string; name: string; type: 'toggle' | 'reset' } | null>(null);

  const getRoleBadge = (roleId: string) => {
    const role = mockRoles.find(r => r.id === roleId);
    if (!role) return { label: 'Sin rol', className: styles.badgeDefault };
    
    switch (role.id) {
      case 'role-admin': return { label: 'Administrador', className: styles.badgeAdmin };
      case 'role-supervisor': return { label: 'Supervisor', className: styles.badgeSupervisor };
      case 'role-operator': return { label: 'Operador', className: styles.badgeOperator };
      default: return { label: role.name, className: styles.badgeCustom };
    }
  };

  const handleResetPassword = (id: string, name: string) => {
    setConfirmModal({ id, name, type: 'reset' });
  };

  const executeReset = () => {
    showToast({ 
      message: `Contraseña temporal enviada a ${confirmModal?.name}`, 
      type: 'success' 
    });
    setConfirmModal(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Último Acceso</th>
              <th>Creación</th>
              <th className={styles.actionsHeader}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const roleInfo = getRoleBadge(user.roleId);
              const initials = getInitials(user.name);
              const isAdmin = user.roleId === 'role-admin';

              return (
                <tr key={user.id} className={styles.row}>
                  <td className={styles.userId}>{user.id.slice(-6)}</td>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.avatar} style={{ backgroundColor: user.avatarColor || '#FFEDD5' }}>
                        {initials}
                      </div>
                      <div className={styles.userInfo}>
                        <span className={styles.userName}>{user.name}</span>
                        <span className={styles.userEmail}>{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={clsx(styles.badge, roleInfo.className)}>
                      {roleInfo.label}
                    </span>
                  </td>
                  <td>
                    <span className={clsx(styles.statusBadge, {
                      [styles.active]: user.status === 'active',
                      [styles.inactive]: user.status === 'inactive'
                    })}>
                      {user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className={styles.dateCell}>{formatRelativeDate(user.lastAccess)}</td>
                  <td className={styles.dateCell}>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/users/${user.id}`}>
                        <button className={styles.iconBtn} title="Editar">
                          <Edit2 size={16} />
                        </button>
                      </Link>
                      
                      <button 
                        className={clsx(styles.iconBtn, styles.resetBtn)} 
                        title="Reenviar contraseña"
                        onClick={() => handleResetPassword(user.id, user.name)}
                      >
                        <Mail size={16} />
                        <span className={styles.tooltip}>Reenviar contraseña temporal</span>
                      </button>

                      <div className={styles.toggleWrapper}>
                        <button 
                          className={clsx(styles.toggleBtn, {
                            [styles.toggleActive]: user.status === 'active',
                            [styles.disabled]: isAdmin
                          })}
                          disabled={isAdmin}
                          onClick={() => onToggleStatus(user.id, user.status)}
                          title={isAdmin ? "No puedes desactivar a otro administrador" : ""}
                        >
                          <Power size={14} />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Reset Password Modal */}
      {confirmModal?.type === 'reset' && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <Send className={styles.modalIcon} size={24} />
              <h3 className={styles.modalTitle}>¿Reenviar contraseña temporal?</h3>
            </div>
            <p className={styles.modalDesc}>
              Se generará una nueva contraseña temporal para <strong>{confirmModal.name}</strong> y se enviará al correo registrado. El usuario deberá cambiarla en su próximo acceso.
            </p>
            <div className={styles.modalFooter}>
              <Button variant="secondary" onClick={() => setConfirmModal(null)}>Cancelar</Button>
              <Button onClick={executeReset}>Enviar contraseña</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatRelativeDate(dateStr: string) {
  if (dateStr === 'never') return 'Nunca';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) return 'Hace poco';
  if (diffHours < 24) return `Hace ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays} d`;
}
