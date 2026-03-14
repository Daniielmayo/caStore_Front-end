'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Calendar, 
  CreditCard, 
  User, 
  Edit3,
  FileText,
  History,
  Info,
  Package,
  ExternalLink,
  Download,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { Supplier } from '../../mockData';
import styles from './SupplierProfile.module.css';
import { Button } from '../../../../components/ui/Button';

interface SupplierProfileProps {
  supplier: Supplier;
}

export function SupplierProfile({ supplier }: SupplierProfileProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'history' | 'documents'>('general');

  const initials = supplier.commercialName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={styles.container}>
      {/* Profile Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.headerMain}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.headerInfo}>
            <div className={styles.titleRow}>
              <h1 className={styles.commercialName}>{supplier.commercialName}</h1>
              <span className={clsx(styles.typeBadge, getBadgeClass(supplier.type))}>
                {supplier.type}
              </span>
            </div>
            <p className={styles.businessName}>{supplier.businessName}</p>
            <div className={styles.compactGrid}>
              <div className={styles.compactItem}><MapPin size={14} /> {supplier.city}, {supplier.country}</div>
              <div className={styles.compactItem}><Mail size={14} /> {supplier.email}</div>
              <div className={styles.compactItem}><Phone size={14} /> {supplier.phone}</div>
              {supplier.website && (
                <div className={styles.compactItem}>
                  <Globe size={14} /> 
                  <a href={supplier.website} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    Sitio web <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Link href={`/suppliers/${supplier.id}/edit`}>
            <Button variant="secondary">
              <Edit3 size={18} />
              Editar proveedor
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className={styles.tabsRoot}>
        <div className={styles.tabsList}>
          <button 
            className={clsx(styles.tabTrigger, { [styles.active]: activeTab === 'general' })}
            onClick={() => setActiveTab('general')}
          >
            <Info size={18} /> Información general
          </button>
          <button 
            className={clsx(styles.tabTrigger, { [styles.active]: activeTab === 'history' })}
            onClick={() => setActiveTab('history')}
          >
            <History size={18} /> Historial de compras
          </button>
          <button 
            className={clsx(styles.tabTrigger, { [styles.active]: activeTab === 'documents' })}
            onClick={() => setActiveTab('documents')}
          >
            <FileText size={18} /> Documentos
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'general' && <GeneralInfo supplier={supplier} />}
          {activeTab === 'history' && <PurchaseHistory supplier={supplier} />}
          {activeTab === 'documents' && <DocumentsList supplier={supplier} />}
        </div>
      </div>
    </div>
  );
}

function GeneralInfo({ supplier }: { supplier: Supplier }) {
  return (
    <div className={styles.infoTab}>
      <div className={styles.infoCols}>
        <div className={styles.infoSection}>
          <h3 className={styles.sectionTitle}>Datos de identificación</h3>
          <div className={styles.detailList}>
            <DetailItem label="NIT" value={supplier.nit} />
            <DetailItem label="Tipo de proveedor" value={supplier.type} />
            <DetailItem label="Tipo de contribuyente" value={supplier.taxpayerType} />
            <DetailItem label="Fecha de registro" value={new Date(supplier.createdAt).toLocaleDateString()} />
          </div>

          <h3 className={styles.sectionTitle}>Ubicación</h3>
          <div className={styles.detailList}>
            <DetailItem label="País" value={supplier.country} />
            <DetailItem label="Departamento" value={supplier.department} />
            <DetailItem label="Ciudad" value={supplier.city} />
            <DetailItem label="Dirección" value={supplier.address} />
          </div>
        </div>

        <div className={styles.infoSection}>
          <h3 className={styles.sectionTitle}>Datos comerciales</h3>
          <div className={styles.detailList}>
            <DetailItem icon={<Calendar size={16} />} label="Condiciones de pago" value={supplier.paymentTerms} />
            <DetailItem icon={<CreditCard size={16} />} label="Moneda de negociación" value={supplier.currency} />
            <DetailItem icon={<User size={16} />} label="Persona de contacto" value={supplier.contactPerson} />
            <DetailItem icon={<Mail size={16} />} label="Correo contacto" value={supplier.email} />
            <DetailItem icon={<Phone size={16} />} label="Teléfono contacto" value={supplier.phone} />
          </div>

          {supplier.observations && (
            <div className={styles.observationsContainer}>
              <h3 className={styles.sectionTitle}>Observaciones</h3>
              <div className={styles.obsCard}>{supplier.observations}</div>
            </div>
          )}
        </div>
      </div>

      {supplier.stats && (
        <div className={styles.statsSection}>
          <h3 className={styles.sectionTitle}>Estadísticas de compras</h3>
          <div className={styles.statsGrid}>
            <StatCard label="Órdenes de compra" value={supplier.stats.totalOrders.toString()} />
            <StatCard label="Unidades recibidas" value={supplier.stats.totalUnits.toString()} />
            <StatCard label="Valor total acumulado" value={formatCOP(supplier.stats.totalValue)} />
            <div className={styles.mostBoughtCard}>
               <span className={styles.statLabel}>Producto más comprado</span>
               <div className={styles.mbProduct}>
                  <div className={styles.mbIcon}><Package size={20} /></div>
                  <span className={styles.statValue}>{supplier.stats.mostBoughtProduct}</span>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PurchaseHistory({ supplier }: { supplier: Supplier }) {
  // Empty state logic as per requirement for non-established suppliers in mock
  if (!supplier.stats) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}><History size={48} /></div>
        <h3>Sin historial de compras</h3>
        <p>Aún no se han registrado recepciones de este proveedor.</p>
        <Link href="/movements/new">
          <Button>Registrar primera entrada</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.historyTab}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Und.</th>
              <th>Total</th>
              <th>Documento</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.tableRow}>
              <td>12/03/2024</td>
              <td>
                <div className={styles.productCell}>
                  <span>{supplier.stats.mostBoughtProduct}</span>
                  <small>SKU-AUTO-123</small>
                </div>
              </td>
              <td>50</td>
              <td>{formatCOP(250000)}</td>
              <td>{formatCOP(12500000)}</td>
              <td>FAC-00129</td>
            </tr>
            {/* Mocked row */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DocumentsList({ supplier }: { supplier: Supplier }) {
  if (!supplier.documents || supplier.documents.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}><FileText size={48} /></div>
        <h3>Sin documentos</h3>
        <p>No hay archivos adjuntos para este proveedor.</p>
        <Button variant="secondary">Cargar primer documento</Button>
      </div>
    );
  }

  return (
    <div className={styles.docsGrid}>
      {supplier.documents.map((doc, idx) => (
        <div key={idx} className={styles.docCard}>
          <div className={styles.docIcon}><FileText size={32} /></div>
          <div className={styles.docInfo}>
            <span className={styles.docName}>{doc.name}</span>
            <span className={styles.docType}>{doc.type}</span>
            <span className={styles.docDate}>Cargado: {doc.uploadDate}</span>
          </div>
          <div className={styles.docActions}>
            <button className={styles.docBtn} title="Descargar"><Download size={16} /></button>
            <button className={styles.docBtn} title="Eliminar"><Trash2 size={16} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className={styles.detailItem}>
      <div className={styles.itemLabelBox}>
        {icon && <span className={styles.itemIcon}>{icon}</span>}
        <span className={styles.itemLabel}>{label}</span>
      </div>
      <span className={styles.itemValue}>{value}</span>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}

function getBadgeClass(type: string) {
  switch (type) {
    case 'Nacional': return styles.badgeBlue;
    case 'Internacional': return styles.badgeGreen;
    case 'Fabricante': return styles.badgeOrange;
    case 'Distribuidor': return styles.badgePurple;
    default: return '';
  }
}

const formatCOP = (val: number) => 
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
