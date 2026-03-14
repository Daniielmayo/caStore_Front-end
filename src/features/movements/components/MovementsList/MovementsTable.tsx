import React, { useState } from 'react';
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ArrowRightLeft, 
  PlusCircle, 
  MinusCircle, 
  RotateCcw,
  ChevronDown,
  ChevronUp,
  X,
  MapPin,
  ExternalLink,
  User,
  Clock,
  FileText,
  UserCheck
} from 'lucide-react';
import clsx from 'clsx';
import styles from './MovementsTable.module.css';
import { Movement, MovementType } from '../../mockData';
import { Badge } from '../../../../components/ui/Badge';
import { DataTable } from '../../../../components/tables/DataTable';

interface MovementsTableProps {
  movements: Movement[];
}

const TYPE_CONFIG: Record<MovementType, { label: string; badge: string; icon: any; iconColor: string; qtyClass: string; qtySign: string }> = {
  purchase_entry: { 
    label: 'Entrada por compra', 
    badge: styles.badgeGreen, 
    icon: ArrowDownToLine, 
    iconColor: styles.iconGreen,
    qtyClass: styles.qtyPos,
    qtySign: '+'
  },
  sale_exit: { 
    label: 'Salida por venta', 
    badge: styles.badgeRed, 
    icon: ArrowUpFromLine, 
    iconColor: styles.iconRed,
    qtyClass: styles.qtyNeg,
    qtySign: '-'
  },
  transfer: { 
    label: 'Transferencia', 
    badge: styles.badgeBlue, 
    icon: ArrowRightLeft, 
    iconColor: styles.iconBlue,
    qtyClass: styles.qtyNeut,
    qtySign: ''
  },
  adjustment_pos: { 
    label: 'Ajuste positivo', 
    badge: styles.badgeGreenLight, 
    icon: PlusCircle, 
    iconColor: styles.iconGreen,
    qtyClass: styles.qtyPos,
    qtySign: '+'
  },
  adjustment_neg: { 
    label: 'Ajuste negativo', 
    badge: styles.badgeOrange, 
    icon: MinusCircle, 
    iconColor: styles.iconOrange,
    qtyClass: styles.qtyNeg,
    qtySign: '-'
  },
  return: { 
    label: 'Devolución', 
    badge: styles.badgePurple, 
    icon: RotateCcw, 
    iconColor: styles.iconPurple,
    qtyClass: styles.qtyPos, // returns usually add stock
    qtySign: '+'
  },
};

export function MovementsTable({ movements }: MovementsTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (m: Movement) => <code className={styles.idCode}>{m.id.slice(-8)}</code>
    },
    {
      key: 'type',
      header: 'Tipo',
      render: (m: Movement) => {
        const config = TYPE_CONFIG[m.type];
        const Icon = config.icon;
        return (
          <div className={clsx(styles.typeBadge, config.badge)}>
            <Icon size={14} className={config.iconColor} />
            <span>{config.label}</span>
          </div>
        );
      }
    },
    {
      key: 'product',
      header: 'Producto',
      render: (m: Movement) => (
        <div className={styles.productCell}>
          <span className={styles.pName}>{m.productName}</span>
          <span className={styles.pSku}>{m.sku}</span>
        </div>
      )
    },
    {
      key: 'quantity',
      header: 'Cantidad',
      render: (m: Movement) => {
        const config = TYPE_CONFIG[m.type];
        return (
          <span className={clsx(styles.qtyValue, config.qtyClass)}>
            {config.qtySign}{m.quantity}
          </span>
        );
      }
    },
    {
      key: 'location',
      header: 'Ubicación',
      render: (m: Movement) => (
        <div className={styles.locationCell}>
          {m.type === 'transfer' ? (
            <>
              <span>{m.originLocation}</span>
              <ArrowRightLeft size={12} className={styles.locArrow} />
              <span>{m.destLocation}</span>
            </>
          ) : (
            <span>{m.originLocation || m.destLocation}</span>
          )}
        </div>
      )
    },
    {
      key: 'document',
      header: 'Documento',
      render: (m: Movement) => <span className={styles.docCode}>{m.documentRef}</span>
    },
    {
      key: 'createdAt',
      header: 'Fecha',
      render: (m: Movement) => {
        const d = new Date(m.createdAt);
        return (
          <div className={styles.dateCell}>
            <span>{d.toLocaleDateString()}</span>
            <span className={styles.timeText}>{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        );
      }
    },
    {
      key: 'actions',
      header: '',
      render: (m: Movement) => (
        <button className={styles.expandBtn} onClick={(e) => { e.stopPropagation(); toggleRow(m.id); }}>
          {expandedRow === m.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      )
    }
  ];

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {movements.map(m => (
            <React.Fragment key={m.id}>
              <tr 
                className={clsx(styles.row, { [styles.rowExpanded]: expandedRow === m.id })}
                onClick={() => toggleRow(m.id)}
              >
                {columns.map(col => (
                  <td key={col.key}>{col.render(m)}</td>
                ))}
              </tr>
              {expandedRow === m.id && (
                <tr className={styles.detailRow}>
                  <td colSpan={columns.length}>
                    <div className={styles.detailPanel}>
                      <div className={styles.detailHeader}>
                        <h4>Detalles del Movimiento</h4>
                        <button className={styles.closeBtn} onClick={() => setExpandedRow(null)}>
                          <X size={16} />
                        </button>
                      </div>
                      <div className={styles.detailGrid}>
                        <div className={styles.detailItem}>
                           <span className={styles.detailLabel}><FileText size={14} /> Ref:</span>
                           <span className={styles.detailValue}>{m.documentRef}</span>
                        </div>
                        <div className={styles.detailItem}>
                           <span className={styles.detailLabel}><User size={14} /> Registrado por:</span>
                           <span className={styles.detailValue}>{m.userName}</span>
                        </div>
                        <div className={styles.detailItem}>
                           <span className={styles.detailLabel}><Clock size={14} /> Fecha exacta:</span>
                           <span className={styles.detailValue}>{new Date(m.createdAt).toLocaleString()}</span>
                        </div>
                        {m.providerName && (
                          <div className={styles.detailItem}>
                             <span className={styles.detailLabel}><UserCheck size={14} /> Proveedor:</span>
                             <span className={styles.detailValue}>{m.providerName}</span>
                          </div>
                        )}
                        {m.lotNumber && (
                          <div className={styles.detailItem}>
                             <span className={styles.detailLabel}><Badge variant="default">Lote</Badge></span>
                             <span className={styles.detailValue}>{m.lotNumber}</span>
                          </div>
                        )}
                        <div className={styles.detailItemFull}>
                           <span className={styles.detailLabel}>Observaciones:</span>
                           <p className={styles.detailObs}>{m.observations || 'Sin observaciones.'}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
