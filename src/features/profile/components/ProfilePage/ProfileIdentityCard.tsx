'use client';

import React from 'react';
import { 
  Camera, 
  Mail, 
  Calendar, 
  Activity, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth, getInitials } from '../../../auth/context/AuthContext';
import { useToast } from '../../../../components/ui/Toast';
import styles from './ProfilePage.module.css';

export function ProfileIdentityCard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const initials = getInitials(user.name);

  return (
    <div className={styles.identityCard}>
      <div className={styles.avatarWrapper}>
        <div className={styles.avatarLarge} style={{ backgroundColor: user.avatarColor }}>
          {initials}
        </div>
        <button 
          className={styles.changePicBtn}
          onClick={() => showToast({ message: 'Funcionalidad próximamente disponible', type: 'info' })}
        >
          <Camera size={16} />
          <span>Cambiar foto</span>
        </button>
      </div>

      <div className={styles.mainInfo}>
        <h2 className={styles.userName}>{user.name}</h2>
        <div className={styles.emailRow}>
          <Mail size={14} />
          <span>{user.email}</span>
        </div>
        <div className={styles.roleBadge}>{user.role}</div>
      </div>

      <div className={styles.membershipInfo}>
        <Calendar size={14} />
        <span>Miembro desde {user.memberSince}</span>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statHeader}>
            <Activity size={14} />
            <span>Movimientos</span>
          </div>
          <span className={styles.statValue}>{user.movementsCount}</span>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statHeader}>
            <Clock size={14} />
            <span>Última sesión</span>
          </div>
          <span className={styles.statValue}>Hoy, 10:45 AM</span>
        </div>
      </div>

      <div className={styles.statusSection}>
        <div className={styles.statusLabel}>Estado de la cuenta</div>
        <div className={styles.accountStatus}>
          <ShieldCheck size={16} />
          <span>Activo</span>
        </div>
      </div>
    </div>
  );
}
