'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit2, AlertCircle, Inbox } from 'lucide-react';
import { PageWrapper } from '@/src/components/layout/PageWrapper';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Badge } from '@/src/components/ui/Badge';
import { Switch } from '@/src/components/ui/Switch';
import { Modal } from '@/src/components/ui/Modal';
import { useToast } from '@/src/components/ui/Toast';
import { DataTable } from '@/src/components/tables/DataTable';
import { Pagination } from '@/src/components/tables/Pagination';
import { useDebounce } from '@/src/hooks/useDebounce';
import { Product, mockProducts } from '../../mockData';
import styles from './ProductList.module.css';

export default function ProductList() {
  const router = useRouter();
  const { showToast } = useToast();
  
  // State
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Modal for status change
  const [productToToggle, setProductToToggle] = useState<Product | null>(null);

  // Initial load simulation
  useEffect(() => {
    const load = setTimeout(() => {
      setData(mockProducts);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(load);
  }, []);

  // Filtering
  const filteredData = useMemo(() => {
    let result = [...data];
    
    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter);
    }
    
    // Search by name, SKU or category
    if (debouncedSearch) {
      const lower = debouncedSearch.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lower) ||
        p.sku.toLowerCase().includes(lower) ||
        p.categoryName.toLowerCase().includes(lower)
      );
    }
    
    return result;
  }, [data, debouncedSearch, statusFilter]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Actions
  const handleToggleClick = (product: Product) => {
    setProductToToggle(product);
  };

  const confirmToggle = () => {
    if (!productToToggle) return;
    
    const newStatus = productToToggle.status === 'active' ? 'inactive' : 'active';
    const updatedData = data.map(p => 
      p.id === productToToggle.id ? { ...p, status: newStatus as any } : p
    );
    
    setData(updatedData);
    showToast({ 
      message: `${productToToggle.name} ${newStatus === 'active' ? 'activado' : 'desactivado'} correctamente.`,
      type: 'success' 
    });
    setProductToToggle(null);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const columns = [
    {
      key: 'sku',
      header: 'SKU',
      render: (item: Product) => <span className={styles.skuText}>{item.sku}</span>
    },
    {
      key: 'name',
      header: 'Producto',
      render: (item: Product) => (
        <div className={styles.productCell}>
          <img src={item.image} alt={item.name} className={styles.productImg} />
          <span className={styles.productName}>{item.name}</span>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Categoría',
      render: (item: Product) => (
        <span className={styles.categoryText}>
          {item.parentCategoryName ? `${item.parentCategoryName} › ` : ''}{item.categoryName}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: 'Fecha de creación',
      render: (item: Product) => formatDate(item.createdAt)
    },
    {
      key: 'price',
      header: 'Precio',
      render: (item: Product) => formatCurrency(item.price)
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (item: Product) => {
        if (item.stock === 0) {
          return (
            <div className={styles.stockCell}>
              <span className={styles.stockNum}>{item.stock}</span>
              <Badge variant="inactive">Sin stock</Badge>
            </div>
          );
        }
        if (item.stock < item.minStock) {
          return (
            <div className={styles.stockCell}>
              <span className={styles.stockNum}>{item.stock}</span>
              <Badge variant="warning">Stock bajo</Badge>
            </div>
          );
        }
        return <span className={styles.stockNum}>{item.stock}</span>;
      }
    },
    {
      key: 'status',
      header: 'Estado',
      render: (item: Product) => (
        <Switch 
          checked={item.status === 'active'}
          onChange={() => handleToggleClick(item)}
          disabled={item.status === 'discontinued'}
        />
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (item: Product) => (
        <div className={styles.actionsCell}>
          <Link href={`/products/${item.id}`} passHref legacyBehavior>
            <Button variant="secondary" className={styles.iconBtn} aria-label="Editar">
              <Edit2 size={16} />
            </Button>
          </Link>
        </div>
      )
    }
  ];

  const emptyState = (
    <div className={styles.emptyContent}>
      <div className={styles.emptyIcon}>
        <Inbox size={48} />
      </div>
      <h3>Sin productos registrados</h3>
      <p>Aún no hay productos en el inventario o no coinciden con la búsqueda.</p>
      <Link href="/products/new" passHref legacyBehavior>
        <Button variant="primary" style={{ marginTop: '16px' }}>Agregar producto</Button>
      </Link>
    </div>
  );

  return (
    <PageWrapper
      title="Gestión de Productos"
      subtitle="Administra el inventario de repuestos y accesorios automotrices."
      actions={
        <Link href="/products/new" passHref legacyBehavior>
          <Button variant="primary">
            <Plus size={16} />
            Agregar producto
          </Button>
        </Link>
      }
    >
      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <Input 
            placeholder="Buscar por nombre, SKU o categoría..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filtersWrap}>
          <select 
            className={styles.statusSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="discontinued">Descontinuado</option>
          </select>
          <span className={styles.resultsCount}>
            {filteredData.length} resultados
          </span>
        </div>
      </div>

      <DataTable 
        columns={columns}
        data={paginatedData}
        loading={loading}
        emptyState={emptyState}
      />

      {!loading && filteredData.length > 0 && (
        <Pagination 
          currentPage={page}
          pageSize={pageSize}
          totalCount={filteredData.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}

      <Modal 
        isOpen={!!productToToggle} 
        onClose={() => setProductToToggle(null)}
        title="Confirmar cambio de estado"
        footer={
          <>
            <Button variant="secondary" onClick={() => setProductToToggle(null)}>Cancelar</Button>
            <Button variant="primary" onClick={confirmToggle}>Confirmar</Button>
          </>
        }
      >
        <div className={styles.modalContent}>
          <AlertCircle size={24} className={styles.modalIcon} />
          <p>
            ¿Estás seguro de que deseas <strong>{productToToggle?.status === 'active' ? 'desactivar' : 'activar'}</strong> el producto <strong>{productToToggle?.name}</strong>?
          </p>
        </div>
      </Modal>
    </PageWrapper>
  );
}
