import React from 'react';
import { Building2, Map, Globe, TrendingUp } from 'lucide-react';
import styles from './SuppliersSummaryCards.module.css';
import { Supplier } from '../../mockData';

interface SuppliersSummaryCardsProps {
  suppliers: Supplier[];
}

export function SuppliersSummaryCards({ suppliers }: SuppliersSummaryCardsProps) {
  const total = suppliers.length;
  const national = suppliers.filter(s => s.type === 'Nacional').length;
  const international = suppliers.filter(s => s.type === 'Internacional').length;
  const monthlyPurchases = 125800000; // Mocked aggregate

  const formatCOP = (val: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={clsx(styles.iconWrapper, styles.orange)}>
          <Building2 size={24} />
        </div>
        <div className={styles.info}>
          <span className={styles.label}>Total Proveedores</span>
          <span className={styles.value}>{total}</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={clsx(styles.iconWrapper, styles.blue)}>
          <Map size={24} />
        </div>
        <div className={styles.info}>
          <span className={styles.label}>Nacionales</span>
          <span className={styles.value}>{national}</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={clsx(styles.iconWrapper, styles.green)}>
          <Globe size={24} />
        </div>
        <div className={styles.info}>
          <span className={styles.label}>Internacionales</span>
          <span className={styles.value}>{international}</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={clsx(styles.iconWrapper, styles.blueLight)}>
          <TrendingUp size={24} />
        </div>
        <div className={styles.info}>
          <span className={styles.label}>Compras del Mes</span>
          <span className={styles.value}>{formatCOP(monthlyPurchases)}</span>
        </div>
      </div>
    </div>
  );
}

// Utility class merger helper for this component scope
function clsx(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
