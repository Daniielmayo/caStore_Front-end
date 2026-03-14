import React from 'react';
import clsx from 'clsx';
import { Bell, PackageMinus, CalendarClock } from 'lucide-react';
import styles from './AlertSummaryCards.module.css';
import { Alert } from '../../mockData';

interface AlertSummaryCardsProps {
  alerts: Alert[];
}

export function AlertSummaryCards({ alerts }: AlertSummaryCardsProps) {
  const activeAlerts = alerts.filter(a => a.status === 'active');
  const lowStockCount = activeAlerts.filter(a => a.type === 'low_stock').length;
  const expirationCount = activeAlerts.filter(a => a.type === 'expiration').length;

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={clsx(styles.iconWrapper, styles.danger)}>
          <Bell size={24} className={styles.icon} />
        </div>
        <div className={styles.content}>
          <h3 className={styles.label}>Total activas</h3>
          <p className={styles.value}>{activeAlerts.length}</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={clsx(styles.iconWrapper, styles.warning)}>
          <PackageMinus size={24} className={styles.icon} />
        </div>
        <div className={styles.content}>
          <h3 className={styles.label}>Stock bajo</h3>
          <p className={styles.value}>{lowStockCount}</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={clsx(styles.iconWrapper, styles.orange)}>
          <CalendarClock size={24} className={styles.icon} />
        </div>
        <div className={styles.content}>
          <h3 className={styles.label}>Vencimiento próximo</h3>
          <p className={styles.value}>{expirationCount}</p>
        </div>
      </div>
    </div>
  );
}
