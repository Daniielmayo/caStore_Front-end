'use client';

import React from 'react';
import { 
  X, 
  MapPin, 
  Package, 
  Trash2, 
  Edit3, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import clsx from 'clsx';
import { Location, mockLocations } from '../../mockData';
import { mockProducts } from '../../../products/mockData';
import { Button } from '../../../../components/ui/Button';
import styles from './LocationDetail.module.css';

interface LocationDetailDrawerProps {
  location: Location | null;
  onClose: () => void;
  onEdit: (location: Location) => void;
  onDelete: (id: string) => void;
}

export function LocationDetailDrawer({ 
  location, 
  onClose, 
  onEdit, 
  onDelete 
}: LocationDetailDrawerProps) {
  if (!location) return null;

  // Find products assigned to this location
  const assignedProducts = mockProducts.filter(p => p.locationId === location.id);

  // Build breadcrumb path
  const getPath = () => {
    const path: Location[] = [];
    let current: Location | undefined = location;
    while (current) {
      path.unshift(current);
      current = mockLocations.find(l => l.id === current?.parentId);
    }
    return path;
  };

  const path = getPath();

  return (
    <div className={clsx(styles.overlay, { [styles.open]: !!location })} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <span className={styles.typeTag}>{location.type}</span>
            <h2 className={styles.code}>{location.code}</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={24} />
          </button>
        </header>

        <div className={styles.body}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Jerarquía de Ubicación</h3>
            <div className={styles.path}>
              {path.map((item, index) => (
                <React.Fragment key={item.id}>
                  <div className={styles.pathItem}>
                    <MapPin size={14} />
                    <span>{item.name}</span>
                  </div>
                  {index < path.length - 1 && <ChevronRight size={14} className={styles.pathDivider} />}
                </React.Fragment>
              ))}
            </div>
          </section>

          <section className={styles.infoGrid}>
            <div className={styles.infoBox}>
              <span className={styles.infoLabel}>Nombre</span>
              <span className={styles.infoValue}>{location.name}</span>
            </div>
            <div className={styles.infoBox}>
              <span className={styles.infoLabel}>Capacidad</span>
              <span className={styles.infoValue}>{location.capacity || '—'} unidades</span>
            </div>
            <div className={styles.infoBox}>
              <span className={styles.infoLabel}>Ocupación</span>
              <div className={styles.occupancyBar}>
                <div 
                  className={styles.occupancyFill} 
                  style={{ width: `${location.occupancyPercent}%` }}
                />
              </div>
              <span className={styles.infoValue}>{location.occupancyPercent}% ({location.productCount} productos)</span>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Productos Asignados</h3>
              <span className={styles.countBadge}>{assignedProducts.length}</span>
            </div>
            
            <div className={styles.productList}>
              {assignedProducts.length > 0 ? assignedProducts.map(product => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.productImg}>
                    <Package size={20} />
                  </div>
                  <div className={styles.productInfo}>
                    <span className={styles.productSku}>{product.sku}</span>
                    <span className={styles.productName}>{product.name}</span>
                    <span className={styles.productStock}>Stock: {product.stock} un.</span>
                  </div>
                  <button className={styles.viewProductBtn}>
                    <ExternalLink size={16} />
                  </button>
                </div>
              )) : (
                <div className={styles.emptyProducts}>
                  <Package size={32} />
                  <p>No hay productos asignados a esta ubicación.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <footer className={styles.footer}>
          <button 
            className={styles.deleteBtn}
            disabled={assignedProducts.length > 0}
            onClick={() => onDelete(location.id)}
          >
            <Trash2 size={18} />
            <span>Eliminar ubicación</span>
            {assignedProducts.length > 0 && (
              <div className={styles.deleteTooltip}>Reasigna los productos antes de eliminar</div>
            )}
          </button>
          <Button onClick={() => onEdit(location)}>
            <Edit3 size={18} />
            <span>Editar ubicación</span>
          </Button>
        </footer>
      </div>
    </div>
  );
}
