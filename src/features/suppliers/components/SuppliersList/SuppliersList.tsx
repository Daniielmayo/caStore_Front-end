'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Plus, X } from 'lucide-react';
import Link from 'next/link';
import styles from './SuppliersList.module.css';
import { SuppliersSummaryCards } from './SuppliersSummaryCards';
import { SuppliersTable } from './SuppliersTable';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { Select } from '../../../../components/ui/Select';
import { Pagination } from '../../../../components/tables/Pagination';
import { mockSuppliers } from '../../mockData';

export function SuppliersList() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Filter logic
  const filteredSuppliers = useMemo(() => {
    return mockSuppliers.filter(s => {
      const matchesSearch = 
        s.businessName.toLowerCase().includes(search.toLowerCase()) || 
        s.commercialName.toLowerCase().includes(search.toLowerCase()) ||
        s.nit.toLowerCase().includes(search.toLowerCase()) ||
        s.city.toLowerCase().includes(search.toLowerCase());
      
      const matchesType = typeFilter === 'all' || s.type === typeFilter;
      
      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  // Pagination logic
  const paginatedSuppliers = filteredSuppliers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className={styles.container}>
      <SuppliersSummaryCards suppliers={mockSuppliers} />

      <div className={styles.actionBar}>
        <div className={styles.searchSection}>
          <div className={styles.searchWrapper}>
            <Input 
              placeholder="Buscar por razón social, NIT o ciudad..."
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
              <option value="Nacional">Nacional</option>
              <option value="Internacional">Internacional</option>
              <option value="Fabricante">Fabricante</option>
              <option value="Distribuidor">Distribuidor</option>
            </Select>
          </div>
        </div>

        <div className={styles.exportSection}>
          <Button variant="secondary" className={styles.exportBtn}>
            <Download size={18} />
            Exportar CSV
          </Button>
          <Link href="/suppliers/new">
            <Button>
              <Plus size={18} />
              Crear proveedor
            </Button>
          </Link>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <SuppliersTable suppliers={paginatedSuppliers} />
        
        <div className={styles.paginationBox}>
          <Pagination 
            currentPage={page}
            totalCount={filteredSuppliers.length}
            pageSize={itemsPerPage}
            onPageChange={setPage}
            onPageSizeChange={() => {}} // Simplified for mock
          />
        </div>
      </div>
    </div>
  );
}
