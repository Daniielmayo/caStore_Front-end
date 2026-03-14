import React from 'react';
import { Activity, ArrowDownCircle, ArrowUpCircle, DollarSign } from 'lucide-react';
import styles from './MovementSummaryCards.module.css';
import { Movement } from '../../mockData';

interface MovementSummaryCardsProps {
  movements: Movement[];
}

export function MovementSummaryCards({ movements }: MovementSummaryCardsProps) {
  // Mocking "today" statistics based on the sample data for visual purposes
  // In a real app we would filter by actual Date.now()
  const todayMovements = movements.slice(0, 12).length;
  const entriesCount = movements.filter(m => m.type.includes('entry') || (m.type === 'adjustment_pos') || (m.type === 'return' && m.providerId)).length;
  const exitsCount = movements.filter(m => m.type.includes('exit') || (m.type === 'adjustment_neg')).length;
  
  // Format currency
  const formatCOP = (val: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.iconWrapperOrange}>
          <Activity size={24} />
        </div>
        <div className={styles.content}>
          <span className={styles.label}>Movimientos hoy</span>
          <span className={styles.value}>{todayMovements}</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.iconWrapperGreen}>
          <ArrowDownCircle size={24} />
        </div>
        <div className={styles.content}>
          <span className={styles.label}>Entradas del día</span>
          <span className={styles.value}>{entriesCount}</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.iconWrapperRed}>
          <ArrowUpCircle size={24} />
        </div>
        <div className={styles.content}>
          <span className={styles.label}>Salidas del día</span>
          <span className={styles.value}>{exitsCount}</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.iconWrapperBlue}>
          <DollarSign size={24} />
        </div>
        <div className={styles.content}>
          <span className={styles.label}>Valor movido hoy</span>
          <span className={styles.value}>{formatCOP(2850000)}</span>
        </div>
      </div>
    </div>
  );
}
