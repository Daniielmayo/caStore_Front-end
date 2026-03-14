import React from 'react';
import { 
  Eye, 
  Edit3, 
  MapPin, 
  Mail, 
  Phone, 
  User, 
  ExternalLink 
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './SuppliersTable.module.css';
import { Supplier, SupplierType } from '../../mockData';
import { Badge } from '../../../../components/ui/Badge';

interface SuppliersTableProps {
  suppliers: Supplier[];
}

const TYPE_COLORS: Record<SupplierType, string> = {
  Nacional: styles.badgeBlue,
  Internacional: styles.badgeGreen,
  Fabricante: styles.badgeOrange,
  Distribuidor: styles.badgePurple,
};

export function SuppliersTable({ suppliers }: SuppliersTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Proveedor</th>
            <th>NIT</th>
            <th>Tipo</th>
            <th>Contribuyente</th>
            <th>Ciudad</th>
            <th>Contacto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.length === 0 ? (
            <tr>
              <td colSpan={8} className={styles.emptyCell}>
                <div className={styles.emptyState}>
                  <span>Sin proveedores registrados</span>
                </div>
              </td>
            </tr>
          ) : (
            suppliers.map((s) => (
              <tr key={s.id} className={styles.row}>
                <td>
                  <code className={styles.idCode}>{s.id.slice(-6)}</code>
                </td>
                <td>
                  <div className={styles.providerCell}>
                    <span className={styles.commercialName}>{s.commercialName}</span>
                    <span className={styles.businessName}>{s.businessName}</span>
                    {/* Tooltip implementation via CSS or simple title for now as per web requirements */}
                    <div className={styles.quickContact}>
                      <div className={styles.tooltip}>
                         <div className={styles.tpItem}><User size={12} /> {s.contactPerson}</div>
                         <div className={styles.tpItem}><Phone size={12} /> {s.phone}</div>
                         <div className={styles.tpItem}><Mail size={12} /> {s.email}</div>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <code className={styles.nit}>{s.nit}</code>
                </td>
                <td>
                  <span className={clsx(styles.typeBadge, TYPE_COLORS[s.type])}>
                    {s.type}
                  </span>
                </td>
                <td>
                  <span className={styles.taxBadge}>{s.taxpayerType}</span>
                </td>
                <td>
                  <div className={styles.cityCell}>
                    <MapPin size={14} className={styles.pinIcon} />
                    <span>{s.city}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.contactCell}>
                    <span className={styles.contactName}>{s.contactPerson}</span>
                    <span className={styles.contactEmail}>{s.email}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.actions}>
                    <Link href={`/suppliers/${s.id}`} title="Ver perfil">
                      <button className={styles.actionBtn}>
                        <Eye size={18} />
                      </button>
                    </Link>
                    <Link href={`/suppliers/${s.id}/edit`} title="Editar">
                      <button className={styles.actionBtn}>
                        <Edit3 size={18} />
                      </button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
