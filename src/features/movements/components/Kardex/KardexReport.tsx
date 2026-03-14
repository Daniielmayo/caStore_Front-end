'use client';

import React, { useMemo } from 'react';
import { 
  ArrowLeft, 
  Download, 
  MapPin, 
  Package, 
  TrendingUp, 
  TrendingDown, 
  Calendar as CalendarIcon,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './KardexReport.module.css';
import { mockMovements, Movement } from '../../mockData';
import { Button } from '../../../../components/ui/Button';

interface KardexReportProps {
  productId: string;
}

export function KardexReport({ productId }: KardexReportProps) {
  // Mock product info (should come from a product service)
  const productInfo = {
    id: productId,
    name: 'Aceite de Motor 5W-30',
    sku: 'MOT-ACE-001',
    category: 'Motor / Lubricantes',
    location: 'Pasillo A, Estante 15',
    stock: 24,
    minStock: 20,
    price: 45000,
  };

  // Filter movements for this product and sort by date
  const productMovements = useMemo(() => {
    return mockMovements
      .filter(m => m.productId === productId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [productId]);

  // Calculate Kardex logic
  const INITIAL_STOCK = 5; // Mock initial stock at start of period
  
  const kardexRows = useMemo(() => {
    let currentBalance = INITIAL_STOCK;
    return productMovements.map(m => {
      const isEntry = m.type.includes('entry') || m.type === 'adjustment_pos' || (m.type === 'return' && !m.providerId);
      const isExit = m.type.includes('exit') || m.type === 'adjustment_neg' || (m.type === 'return' && m.providerId);
      
      const qtyIn = isEntry ? m.quantity : 0;
      const qtyOut = isExit ? m.quantity : 0;
      
      currentBalance = currentBalance + qtyIn - qtyOut;
      
      return {
        ...m,
        qtyIn,
        qtyOut,
        balance: currentBalance,
        unitCost: productInfo.price,
        totalCost: (qtyIn || qtyOut) * productInfo.price,
        totalValue: currentBalance * productInfo.price
      };
    });
  }, [productMovements, productInfo]);

  const totals = useMemo(() => {
    const totalIn = kardexRows.reduce((sum, row) => sum + row.qtyIn, 0);
    const totalOut = kardexRows.reduce((sum, row) => sum + row.qtyOut, 0);
    return {
      totalIn,
      totalOut,
      net: totalIn - totalOut,
      finalValue: kardexRows[kardexRows.length - 1]?.totalValue || 0
    };
  }, [kardexRows]);

  // SVG chart points calculation
  const chartPoints = useMemo(() => {
    if (kardexRows.length === 0) return '';
    const maxBalance = Math.max(...kardexRows.map(r => r.balance), INITIAL_STOCK, 50);
    const height = 150;
    const width = 800;
    const stepX = width / (kardexRows.length + 1);
    
    let points = `0,${height - (INITIAL_STOCK / maxBalance * height)}`;
    kardexRows.forEach((row, idx) => {
      const x = (idx + 1) * stepX;
      const y = height - (row.balance / maxBalance * height);
      points += ` ${x},${y}`;
    });
    return points;
  }, [kardexRows]);

  return (
    <div className={styles.container}>
      <div className={styles.productHeader}>
        <div className={styles.pBasic}>
          <div className={styles.pImgBox}><Package size={40} /></div>
          <div className={styles.pTitle}>
            <h2 className={styles.title}>{productInfo.name}</h2>
            <div className={styles.pMeta}>
              <span className={styles.pSku}>SKU: {productInfo.sku}</span>
              <span className={styles.pCat}>{productInfo.category}</span>
            </div>
          </div>
        </div>
        <div className={styles.pStats}>
          <div className={styles.stockBox}>
            <span className={styles.stockLabel}>Stock Actual</span>
            <span className={clsx(styles.stockVal, { [styles.lowStock]: productInfo.stock <= productInfo.minStock })}>
              {productInfo.stock}
            </span>
          </div>
          <div className={styles.locationBox}>
            <MapPin size={16} />
            <span>{productInfo.location}</span>
          </div>
        </div>
      </div>

      <div className={styles.periodBar}>
        <div className={styles.periodSelectors}>
          <Button variant="secondary" className={styles.periodBtn}>Este mes</Button>
          <Button variant="secondary" className={styles.periodBtn}>Últimos 3 meses</Button>
          <div className={styles.datePickerRange}>
             <CalendarIcon size={16} />
             <span>01/01/2024 - 15/03/2024</span>
          </div>
        </div>
        <div className={styles.exportActions}>
          <Button variant="secondary"><Download size={16} /> PDF</Button>
          <Button variant="secondary"><Download size={16} /> Excel</Button>
        </div>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo / Referencia</th>
              <th className={styles.colIn}>Entradas</th>
              <th className={styles.colOut}>Salidas</th>
              <th>Saldo Cant.</th>
              <th>Saldo Valorizado</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.initialRow}>
              <td>-</td>
              <td><strong>SALDO INICIAL</strong></td>
              <td className={styles.colIn}>-</td>
              <td className={styles.colOut}>-</td>
              <td>{INITIAL_STOCK}</td>
              <td className={styles.mono}>$ {(INITIAL_STOCK * productInfo.price).toLocaleString()}</td>
            </tr>
            {kardexRows.map(row => (
              <tr key={row.id}>
                <td>{new Date(row.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className={styles.typeCol}>
                    <span className={styles.typeName}>{row.type.replace('_', ' ')}</span>
                    <span className={styles.docRef}>{row.documentRef}</span>
                  </div>
                </td>
                <td className={clsx(styles.colIn, styles.qtyIn)}>{row.qtyIn || ''}</td>
                <td className={clsx(styles.colOut, styles.qtyOut)}>{row.qtyOut || ''}</td>
                <td className={styles.semibold}>{row.balance}</td>
                <td className={styles.mono}>$ {row.totalValue.toLocaleString()}</td>
              </tr>
            ))}
            <tr className={styles.finalRow}>
              <td>{new Date().toLocaleDateString()}</td>
              <td><strong>SALDO FINAL</strong></td>
              <td className={styles.colIn}>-</td>
              <td className={styles.colOut}>-</td>
              <td><strong>{totals.finalValue / productInfo.price}</strong></td>
              <td className={styles.mono}><strong>$ {totals.finalValue.toLocaleString()}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.footerPanels}>
        <div className={styles.totalsPanel}>
          <h4 className={styles.panelTitle}>Resumen de Movimientos</h4>
          <div className={styles.totalsGrid}>
            <div className={styles.tItem}>
               <span className={styles.tLabel}>Mcias. Ingresadas</span>
               <div className={styles.tValRow}><TrendingUp size={20} color="#10B981" /> <span className={styles.tValPos}>{totals.totalIn}</span></div>
            </div>
            <div className={styles.tItem}>
               <span className={styles.tLabel}>Mcias. Egresadas</span>
               <div className={styles.tValRow}><TrendingDown size={20} color="#EF4444" /> <span className={styles.tValNeg}>{totals.totalOut}</span></div>
            </div>
            <div className={styles.tItem}>
               <span className={styles.tLabel}>Variación Neta</span>
               <div className={styles.tValRow}><span className={totals.net >= 0 ? styles.tValPos : styles.tValNeg}>{totals.net >= 0 ? '+' : ''}{totals.net}</span></div>
            </div>
            <div className={styles.tItem}>
               <span className={styles.tLabel}>Valor Final de Inventario</span>
               <div className={styles.tValRow}><span className={styles.tValValor}>$ {totals.finalValue.toLocaleString()}</span></div>
            </div>
          </div>
        </div>

        <div className={styles.chartPanel}>
          <h4 className={styles.panelTitle}>Evolución de Stock</h4>
          <div className={styles.chartContainer}>
            <svg viewBox="0 0 800 150" className={styles.svg}>
              {/* Grid lines */}
              <line x1="0" y1="130" x2="800" y2="130" stroke="#E2E8F0" strokeWidth="1" />
              {/* Threshold line */}
              <line 
                x1="0" 
                y1={150 - (productInfo.minStock / 50 * 150)} 
                x2="800" 
                y2={150 - (productInfo.minStock / 50 * 150)} 
                stroke="#EF4444" 
                strokeWidth="1" 
                strokeDasharray="4 4" 
              />
              {/* Stock line */}
              <polyline
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="3"
                points={chartPoints}
              />
            </svg>
            <div className={styles.chartLabels}>
              <span>Inicio del período</span>
              <span>Actual</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
