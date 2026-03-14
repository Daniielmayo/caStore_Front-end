'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Plus, X } from 'lucide-react';
import Link from 'next/link';
import styles from './MovementsList.module.css';
import { mockMovements, Movement } from '../../mockData';
import { MovementSummaryCards } from './MovementSummaryCards';
import { MovementsTable } from './MovementsTable';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { Select } from '../../../../components/ui/Select';
import { Pagination } from '../../../../components/tables/Pagination';

export function MovementsList() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Filter logic
  const filteredMovements = useMemo(() => {
    return mockMovements.filter(m => {
      const matchesSearch = 
        m.productName.toLowerCase().includes(search.toLowerCase()) || 
        m.sku.toLowerCase().includes(search.toLowerCase()) ||
        m.documentRef.toLowerCase().includes(search.toLowerCase());
      
      const matchesType = typeFilter === 'all' || m.type === typeFilter;
      
      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
  const paginatedMovements = filteredMovements.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Totals for footer
  const periodTotals = useMemo(() => {
    const entries = filteredMovements
      .filter(m => m.type.includes('entry') || m.type === 'adjustment_pos')
      .reduce((acc, curr) => acc + curr.quantity, 0);
    const exits = filteredMovements
      .filter(m => m.type.includes('exit') || m.type === 'adjustment_neg')
      .reduce((acc, curr) => acc + curr.quantity, 0);
    
    return {
      entries,
      exits,
      balance: entries - exits
    };
  }, [filteredMovements]);

  return (
    <div className={styles.container}>
      <MovementSummaryCards movements={mockMovements} />

      <div className={styles.actionBar}>
        <div className={styles.searchSection}>
          <div className={styles.searchWrapper}>
            <Input 
              placeholder="Buscar por producto, SKU o documento..."
              icon={Search}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className={styles.filterWrapper}>
            <Select 
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            >
              <option value="all">Todos los tipos</option>
              <option value="purchase_entry">Entrada por compra</option>
              <option value="sale_exit">Salida por venta</option>
              <option value="transfer">Transferencia</option>
              <option value="adjustment_pos">Ajuste positivo</option>
              <option value="adjustment_neg">Ajuste negativo</option>
              <option value="return">Devolución</option>
            </Select>
          </div>
        </div>

        <div className={styles.exportSection}>
          <Button variant="secondary" className={styles.exportBtn}>
            <Download size={18} />
            CSV
          </Button>
          <Button variant="secondary" className={styles.exportBtn}>
            <Download size={18} />
            Excel
          </Button>
          <Link href="/movements/new">
            <Button>
              <Plus size={18} />
              Registrar movimiento
            </Button>
          </Link>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <MovementsTable movements={paginatedMovements} />
        
        <div className={styles.footerSummary}>
          <div className={styles.periodLabel}>Resumen del período filtrado:</div>
          <div className={styles.totalsRow}>
            <div className={styles.totalItem}>
              <span>Total Entradas:</span>
              <strong className={styles.entryColor}>+{periodTotals.entries}</strong>
            </div>
            <div className={styles.totalItem}>
              <span>Total Salidas:</span>
              <strong className={styles.exitColor}>-{periodTotals.exits}</strong>
            </div>
            <div className={styles.totalItem}>
              <span>Balance Neto:</span>
              <strong className={periodTotals.balance >= 0 ? styles.entryColor : styles.exitColor}>
                {periodTotals.balance >= 0 ? '+' : ''}{periodTotals.balance}
              </strong>
            </div>
          </div>
        </div>

        <div className={styles.paginationBox}>
          <Pagination 
            currentPage={page}
            totalCount={filteredMovements.length}
            pageSize={itemsPerPage}
            onPageChange={setPage}
            onPageSizeChange={() => {}} // Simple placeholder as per mock
          />
        </div>
      </div>
    </div>
  );
}
