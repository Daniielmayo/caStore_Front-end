'use client';

import React, { useState } from 'react';
import { Monitor, Smartphone, Globe, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import styles from './ProfilePage.module.css';
import { useToast } from '../../../../components/ui/Toast';
import clsx from 'clsx';

interface Session {
  id: string;
  device: 'desktop' | 'mobile';
  browser: string;
  os: string;
  ip: string;
  location: string;
  lastActive: string;
  current?: boolean;
}

const MOCK_SESSIONS: Session[] = [
  { 
    id: 's-1', 
    device: 'desktop', 
    browser: 'Chrome', 
    os: 'Windows 11', 
    ip: '190.xxx.xxx.12', 
    location: 'Medellín, Colombia', 
    lastActive: 'Activa ahora',
    current: true 
  },
  { 
    id: 's-2', 
    device: 'mobile', 
    browser: 'Safari', 
    os: 'iOS 17', 
    ip: '186.xxx.xxx.45', 
    location: 'Medellín, Colombia', 
    lastActive: 'Hace 2 días' 
  },
];

export function SessionsSection() {
  const { showToast } = useToast();
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [showConfirmAll, setShowConfirmAll] = useState(false);

  const handleCloseSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    showToast({ message: 'Sesión terminada exitosamente', type: 'success' });
  };

  const handleCloseAll = () => {
    setSessions(prev => prev.filter(s => s.id === 's-1'));
    setShowConfirmAll(false);
    showToast({ message: 'Todas las sesiones remotas han sido terminadas', type: 'success' });
  };

  return (
    <section className={styles.formSection}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Sesiones activas</h3>
        <p className={styles.sectionSubtitle}>Estos son los dispositivos donde tienes sesión abierta.</p>
      </div>

      <div className={styles.sessionsList}>
        {sessions.map((session) => (
          <div key={session.id} className={styles.sessionCard}>
            <div className={styles.sessionIcon}>
              {session.device === 'desktop' ? <Monitor size={20} /> : <Smartphone size={20} />}
            </div>
            
            <div className={styles.sessionDetails}>
              <div className={styles.deviceRow}>
                <span className={styles.deviceText}>{session.browser} en {session.os}</span>
                {session.current && <span className={styles.currentBadge}>Esta sesión</span>}
              </div>
              <div className={styles.locationRow}>
                <span>{session.ip} • {session.location}</span>
                <span className={clsx(styles.timeText, { [styles.timeActive]: session.current })}>
                  {session.lastActive}
                </span>
              </div>
            </div>

            {!session.current && (
              <button 
                className={styles.closeSessionBtn}
                onClick={() => handleCloseSession(session.id)}
              >
                Cerrar sesión
              </button>
            )}
          </div>
        ))}
      </div>

      <div className={styles.sessionsFooter}>
        <button 
          className={styles.dangerTextBtn}
          onClick={() => setShowConfirmAll(true)}
          disabled={sessions.length <= 1}
        >
          Cerrar todas las sesiones excepto esta
        </button>
      </div>

      {showConfirmAll && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <AlertCircle className={styles.modalIcon} size={24} />
              <h3 className={styles.modalTitle}>¿Terminar sesiones remotas?</h3>
            </div>
            <p className={styles.modalDesc}>
              Se cerrará la sesión en todos tus dispositivos excepto en este. Tendrás que volver a ingresar tus credenciales en ellos.
            </p>
            <div className={styles.modalFooter}>
              <Button variant="secondary" onClick={() => setShowConfirmAll(false)}>Cancelar</Button>
              <Button variant="danger" onClick={handleCloseAll}>Terminar todas</Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
