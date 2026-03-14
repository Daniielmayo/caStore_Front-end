'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Download, ShieldCheck, Eye, AlertTriangle, Calendar, CalendarClock, Info } from 'lucide-react';
import styles from './AlertsList.module.css';
import { mockAlerts, Alert } from '../../mockData';
import { AlertSummaryCards } from './AlertSummaryCards';
import { AlertFilters } from './AlertFilters';
import { DataTable } from '../../../../components/tables/DataTable';
import { Pagination } from '../../../../components/tables/Pagination';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { Modal } from '../../../../components/ui/Modal';
import { Input } from '../../../../components/ui/Input';
import { useDebounce } from '../../../../hooks/useDebounce';
import { useToast } from '../../../../components/ui/Toast';

export function AlertsList() {
  const router = useRouter();
  const { showToast } = useToast();
  
  // State
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Resolution Modal State
  const [resolvingAlert, setResolvingAlert] = useState<Alert | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filtering
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchSearch = debouncedSearch === '' || 
        alert.productName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        alert.productSku.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchStatus = statusFilter === 'all' || alert.status === statusFilter;
      const matchType = typeFilter === 'all' || alert.type === typeFilter;

      return matchSearch && matchStatus && matchType;
    });
  }, [alerts, debouncedSearch, statusFilter, typeFilter]);

  // Pagination
  const paginatedAlerts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAlerts.slice(startIndex, startIndex + pageSize);
  }, [filteredAlerts, currentPage, pageSize]);

  // Actions
  const handleResolveSubmit = async () => {
    if (!resolvingAlert) return;
    
    setIsResolving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setAlerts(current => current.map(a => {
      if (a.id === resolvingAlert.id) {
        return {
          ...a,
          status: 'resolved',
          resolvedAt: new Date().toISOString(),
          resolvedBy: 'Usuario Actual',
          resolutionNote
        };
      }
      return a;
    }));
    
    showToast({ message: 'Alerta resuelta con éxito', type: 'success' });
    setIsResolving(false);
    setResolvingAlert(null);
    setResolutionNote('');
  };

  // Render Helpers
  const renderType = (alert: Alert) => {
    if (alert.type === 'low_stock') {
      return (
        <div className={styles.typeCell}>
          <div className={styles.iconRed}><AlertTriangle size={16} /></div>
          <span>Stock Bajo</span>
        </div>
      );
    }
    
    // Expiration
    let iconClass = styles.iconYellow;
    let icon = <Calendar size={16} />;
    
    if (alert.currentValue <= 7) {
      iconClass = styles.iconRed;
      icon = <CalendarClock size={16} />;
    } else if (alert.currentValue <= 15) {
      iconClass = styles.iconOrange;
    }

    return (
      <div className={styles.typeCell}>
        <div className={iconClass}>{icon}</div>
        <span>Venc. {alert.currentValue} días</span>
      </div>
    );
  };

  const renderStatus = (status: string) => {
    if (status === 'active') {
      return (
        <div className={styles.pulseContainer}>
          <div className={styles.pulseRing} />
          <Badge variant="inactive">Activa</Badge>
        </div>
      );
    }
    if (status === 'resolved') {
      return <Badge variant="active">Resuelta</Badge>;
    }
    return <Badge variant="default">Descartada</Badge>;
  };

  // Columns definition
  const columns = [
    { key: 'type', header: 'Tipo', render: renderType },
    { 
      key: 'product', 
      header: 'Producto',
      render: (a: Alert) => (
        <div className={styles.productCell}>
          <span className={styles.productName}>{a.productName}</span>
          <span className={styles.productSku}>{a.productSku}</span>
        </div>
      )
    },
    { 
      key: 'currentValue', 
      header: 'Valor Actual',
      render: (a: Alert) => (
        <span className={styles.boldValue}>
          {a.type === 'low_stock' ? `${a.currentValue} unid.` : `${a.currentValue} días`}
        </span>
      )
    },
    { 
      key: 'threshold', 
      header: 'Umbral Config.',
      render: (a: Alert) => (
        <span className={styles.textMid}>
          {a.type === 'low_stock' ? `Min. ${a.threshold}` : `${a.threshold} días`}
        </span>
      )
    },
    { 
      key: 'createdAt', 
      header: 'Generación',
      render: (a: Alert) => {
        const d = new Date(a.createdAt);
        return <span className={styles.textMid}>{d.toLocaleDateString()} {d.getHours()}:{d.getMinutes().toString().padStart(2, '0')}</span>;
      }
    },
    { key: 'status', header: 'Estado', render: (a: Alert) => renderStatus(a.status) },
    {
      key: 'actions',
      header: 'Acciones',
      render: (a: Alert) => (
        <div className={styles.actionsBox}>
          {a.status === 'active' && (
            <Button
              variant="secondary"
              onClick={() => setResolvingAlert(a)}
              className={styles.smallBtn}
            >
              Resolver
            </Button>
          )}
          <button 
            className={styles.iconBtn} 
            title="Ver detalle"
            onClick={() => router.push(`/alerts/${a.id}`)}
          >
            <Eye size={18} />
          </button>
        </div>
      )
    }
  ];

  const emptyState = (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <ShieldCheck size={48} />
      </div>
      <h3>Todo el inventario está en orden</h3>
      <p>No hay alertas que coincidan con los filtros actuales.</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <AlertSummaryCards alerts={alerts} />
      
      <div className={styles.filterBar}>
        <AlertFilters 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
        />
        <Button variant="secondary" className={styles.exportBtn}>
          <Download size={16} /> Exportar CSV
        </Button>
      </div>

      <DataTable
        data={paginatedAlerts}
        columns={columns}
        loading={isLoading}
        emptyState={emptyState}
      />

      <Pagination
        currentPage={currentPage}
        totalCount={filteredAlerts.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Resolution Modal */}
      <Modal
        isOpen={!!resolvingAlert}
        onClose={() => !isResolving && setResolvingAlert(null)}
        title="Resolver Alerta"
        footer={
          <>
            <Button variant="secondary" onClick={() => setResolvingAlert(null)} disabled={isResolving}>
              Cancelar
            </Button>
            <Button onClick={handleResolveSubmit} isLoading={isResolving}>
              Confirmar resolución
            </Button>
          </>
        }
      >
        {resolvingAlert && (
          <div className={styles.modalContent}>
            <p className={styles.modalText}>¿Confirmas la resolución de esta alerta?</p>
            <div className={styles.productAlertInfo}>
              <strong>{resolvingAlert.productName}</strong> ({resolvingAlert.productSku})
              <br/>
              <span className={styles.textMid}>
                {resolvingAlert.type === 'low_stock' 
                  ? `Stock actual: ${resolvingAlert.currentValue} (Min: ${resolvingAlert.threshold})`
                  : `Vence en ${resolvingAlert.currentValue} días`}
              </span>
            </div>
            
            <Input
              label="Nota de resolución (Opcional)"
              placeholder="Ej. Se reabasteció el producto o se descartó lote"
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              disabled={isResolving}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
