import React from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import styles from './AlertFilters.module.css';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Button } from '../../../../components/ui/Button';

interface AlertFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  typeFilter: string;
  onTypeChange: (val: string) => void;
}

export function AlertFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange
}: AlertFiltersProps) {
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.searchWrapper}>
        <Input
          placeholder="Buscar producto..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={Search}
        />
      </div>
      <div className={styles.filterGroup}>
        <Select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
        >
          <option value="all">Todas las alertas</option>
          <option value="low_stock">Stock bajo</option>
          <option value="expiration">Vencimiento</option>
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activa</option>
          <option value="resolved">Resuelta</option>
        </Select>
        {/* Simplified Date Range for demo */}
        <div className={styles.dateDemo}>
          <Calendar size={16} className={styles.dateIcon}/>
          <span className={styles.dateText}>Cualquier fecha</span>
        </div>
      </div>
    </div>
  );
}
