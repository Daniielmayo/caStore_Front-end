'use client';

import React, { useMemo } from 'react';
import { Edit3, Trash2, ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import { mockLocations, Location } from '../../mockData';
import styles from './LocationList.module.css';

interface LocationListProps {
  searchTerm: string;
  typeFilter: string;
}

export function LocationList({ searchTerm, typeFilter }: LocationListProps) {
  const filteredLocations = useMemo(() => {
    return mockLocations.filter(loc => {
      const matchesSearch = loc.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           loc.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || loc.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, typeFilter]);

  const getParentPath = (parentId?: string) => {
    if (!parentId) return '—';
    const parent = mockLocations.find(l => l.id === parentId);
    if (!parent) return '—';
    
    // Simple 1-level parent for the table, or we could rebuild the full path
    return parent.code;
  };

  const getProgressColor = (percent: number) => {
    if (percent > 90) return styles.bgRed;
    if (percent > 70) return styles.bgYellow;
    return styles.bgGreen;
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Padre</th>
            <th>Capacidad</th>
            <th>Productos</th>
            <th>Ocupación</th>
            <th className={styles.center}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredLocations.map((loc) => (
            <tr key={loc.id}>
              <td className={styles.code}>{loc.code}</td>
              <td className={styles.name}>{loc.name}</td>
              <td>
                <span className={clsx(styles.badge, styles[loc.type.toLowerCase()])}>
                  {loc.type}
                </span>
              </td>
              <td className={styles.parentId}>{getParentPath(loc.parentId)}</td>
              <td>{loc.capacity || '—'}</td>
              <td>
                {loc.productCount > 0 ? (
                  <div className={styles.productLink}>
                    <span>{loc.productCount}</span>
                    <ExternalLink size={12} />
                  </div>
                ) : '0'}
              </td>
              <td>
                <div className={styles.occupancyWrapper}>
                  <div className={styles.progressBar}>
                    <div 
                      className={clsx(styles.progressFill, getProgressColor(loc.occupancyPercent))} 
                      style={{ width: `${loc.occupancyPercent}%` }}
                    />
                  </div>
                  <span className={styles.percentText}>{loc.occupancyPercent}%</span>
                </div>
              </td>
              <td>
                <div className={styles.actions}>
                  <button className={styles.actionBtn} title="Editar">
                    <Edit3 size={16} />
                  </button>
                  <button 
                    className={clsx(styles.actionBtn, styles.delete)} 
                    title="Eliminar"
                    disabled={loc.productCount > 0}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
