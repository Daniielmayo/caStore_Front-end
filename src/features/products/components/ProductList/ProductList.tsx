'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit2, AlertCircle, Inbox, Package, AlertTriangle, Archive } from 'lucide-react';
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
import { SkeletonGrid } from '@/src/components/common/Skeleton/SkeletonGrid';
import { SkeletonTable } from '@/src/components/common/Skeleton/SkeletonTable';
import { MockWarning } from '@/src/components/common/MockWarning/MockWarning';
import { useProductsList, useProductStats, useUpdateProductStatus } from '../../hooks/useProducts';
import type { Product } from '../../mockData';
import type { ProductStatus } from '../../types/products.types';
import styles from './ProductList.module.css';

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export default function ProductList() {
  const router = useRouter();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'discontinued'>('all');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [productToToggle, setProductToToggle] = useState<Product | null>(null);

  const apiStatus: ProductStatus | 'all' = statusFilter === 'all' ? 'all' : statusFilter.toUpperCase() as ProductStatus;

  const { data, pagination, isLoading, isFetching, error, refetch } = useProductsList({
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
    status: apiStatus,
    lowStock: lowStockOnly || undefined,
  });

  const { stats, isLoading: statsLoading, isUsingMock: statsMock } = useProductStats();

  const updateStatusMutation = useUpdateProductStatus({
    onSuccess: (updated, variables) => {
      const newStatus = variables.status === 'ACTIVE' ? 'activado' : variables.status === 'INACTIVE' ? 'desactivado' : 'marcado como descontinuado';
      showToast({ message: `Producto ${newStatus} correctamente.`, type: 'success' });
      setProductToToggle(null);
    },
    onError: () => {
      showToast({ message: 'Error al cambiar el estado del producto.', type: 'error' });
    },
  });

  const handleToggleClick = (product: Product) => {
    setProductToToggle(product);
  };

  const confirmToggle = () => {
    if (!productToToggle) return;
    if (productToToggle.status === 'discontinued') {
      showToast({ message: 'No se puede cambiar el estado de un producto descontinuado.', type: 'error' });
      return;
    }
    const newStatus: ProductStatus = productToToggle.status === 'active' ? 'INACTIVE' : 'ACTIVE';
    updateStatusMutation.mutate({ id: productToToggle.id, status: newStatus });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
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
      render: (item: Product) => <span className={styles.skuText}>{item.sku}</span>,
    },
    {
      key: 'name',
      header: 'Producto',
      render: (item: Product) => (
        <div className={styles.productCell}>
          <img src={item.image} alt={item.name} className={styles.productImg} />
          <span className={styles.productName}>{item.name}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Categoría',
      render: (item: Product) => (
        <span className={styles.categoryText}>
          {item.parentCategoryName ? `${item.parentCategoryName} › ` : ''}{item.categoryName}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Fecha de creación',
      render: (item: Product) => formatDate(item.createdAt),
    },
    {
      key: 'price',
      header: 'Precio',
      render: (item: Product) => formatCurrency(item.price),
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
      },
    },
    {
      key: 'status',
      header: 'Estado',
      render: (item: Product) => (
        <Switch
          checked={item.status === 'active'}
          onChange={() => handleToggleClick(item)}
          disabled={item.status === 'discontinued' || updateStatusMutation.isPending}
        />
      ),
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
      ),
    },
  ];

  const emptyState = (
    <div className={styles.emptyContent}>
      <div className={styles.emptyIcon}>
        <Inbox size={48} />
      </div>
      <h3>Sin productos registrados</h3>
      <p>Aún no hay productos en el inventario o no coinciden con la búsqueda.</p>
      <Link href="/products/new" passHref legacyBehavior>
        <Button variant="primary" style={{ marginTop: '16px' }}>
          Agregar producto
        </Button>
      </Link>
    </div>
  );

  const totalCount = pagination?.total ?? 0;

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
      {statsMock && <MockWarning />}

      {/* Tarjetas de estadísticas */}
      <section className={styles.statsSection}>
        {statsLoading ? (
          <SkeletonGrid count={4} />
        ) : (
          <>
            <div className={styles.statCard} onClick={() => router.push('/products')}>
              <div className={styles.statIconWrap} style={{ backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                <Package size={22} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Activos</span>
                <span className={styles.statValue}>{stats.totalActive}</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIconWrap} style={{ backgroundColor: '#FEE2E2', color: 'var(--color-error)' }}>
                <AlertTriangle size={22} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Stock bajo</span>
                <span className={styles.statValue}>{stats.lowStockCount}</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIconWrap} style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>
                <AlertCircle size={22} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Sin stock</span>
                <span className={styles.statValue}>{stats.outOfStockCount}</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIconWrap} style={{ backgroundColor: '#E5E7EB', color: '#6B7280' }}>
                <Archive size={22} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Descontinuados</span>
                <span className={styles.statValue}>{stats.totalDiscontinued}</span>
              </div>
            </div>
          </>
        )}
      </section>

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
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => {
                setLowStockOnly(e.target.checked);
                setPage(1);
              }}
            />
            Stock bajo
          </label>
          <select
            className={styles.statusSelect}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as typeof statusFilter);
              setPage(1);
            }}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="discontinued">Descontinuado</option>
          </select>
          <span className={styles.resultsCount}>
            {pagination ? `${totalCount} resultados` : (isLoading ? '...' : '0 resultados')}
          </span>
        </div>
      </div>

      {isLoading && !data.length ? (
        <SkeletonTable rows={6} columns={8} />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          loading={isFetching}
          emptyState={emptyState}
        />
      )}

      {!isLoading && pagination && totalCount > 0 && (
        <Pagination
          currentPage={page}
          pageSize={pageSize}
          totalCount={totalCount}
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
            <Button variant="secondary" onClick={() => setProductToToggle(null)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={confirmToggle}
              disabled={updateStatusMutation.isPending}
            >
              Confirmar
            </Button>
          </>
        }
      >
        <div className={styles.modalContent}>
          <AlertCircle size={24} className={styles.modalIcon} />
          <p>
            ¿Estás seguro de que deseas{' '}
            <strong>
              {productToToggle?.status === 'active' ? 'desactivar' : 'activar'}
            </strong>{' '}
            el producto <strong>{productToToggle?.name}</strong>?
          </p>
        </div>
      </Modal>
    </PageWrapper>
  );
}
