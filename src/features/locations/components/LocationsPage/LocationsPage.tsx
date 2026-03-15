'use client';

import React, { useState, useMemo } from 'react';
import {
  Map as MapIcon,
  LayoutList,
  Plus,
  Warehouse,
  Box,
  CheckCircle2,
  Search
} from 'lucide-react';
import clsx from 'clsx';
import { PageWrapper } from '@/src/components/layout/PageWrapper';
import { Button } from '@/src/components/ui/Button';
import { Select } from '@/src/components/ui/Select';
import { mockLocations, Location } from '../../mockData';

import { LocationMap } from '../LocationMap/LocationMap';
import { LocationDetailDrawer } from '../LocationDetail/LocationDetailDrawer';
import { LocationFormDrawer } from '../LocationForm/LocationFormDrawer';
import styles from './LocationsPage.module.css';
import { LocationList } from '@/src/features/locations/components/LocationsPage/LocationList';

export default function LocationsPage() {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  // Statistics
  const stats = useMemo(() => {
    const total = mockLocations.length;
    const capacity = mockLocations.reduce((acc, loc) => acc + (loc.capacity || 0), 0);
    const withProducts = mockLocations.filter(l => l.productCount > 0).length;
    const available = mockLocations.filter(l => l.productCount === 0).length;
    return { total, capacity, withProducts, available };
  }, []);

  const handleEdit = (loc: Location) => {
    setEditingLocation(loc);
    setIsFormOpen(true);
    setSelectedLocation(null);
  };

  const handleNew = () => {
    setEditingLocation(null);
    setIsFormOpen(true);
  };

  return (
    <PageWrapper
      title="Mapa del Almacén"
      subtitle="Gestiona las ubicaciones físicas de tu inventario"
    >
      <div className={styles.topActions}>
        <Button onClick={handleNew}>
          <Plus size={20} />
          <span>Nueva ubicación</span>
        </Button>
      </div>

      <div className={styles.summarySection}>
        <div className={styles.summaryCard}>
          <div className={clsx(styles.iconWrapper, styles.orange)}>
            <MapIcon size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.total}</span>
            <span className={styles.statLabel}>Ubicaciones</span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={clsx(styles.iconWrapper, styles.blue)}>
            <Warehouse size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.capacity}</span>
            <span className={styles.statLabel}>Capacidad total</span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={clsx(styles.iconWrapper, styles.green)}>
            <Box size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.withProducts}</span>
            <span className={styles.statLabel}>Ocupadas</span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={clsx(styles.iconWrapper, styles.gray)}>
            <CheckCircle2 size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.available}</span>
            <span className={styles.statLabel}>Disponibles</span>
          </div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por código o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <Select
            className={styles.typeSelect}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">Todos los tipos</option>
            <option value="WAREHOUSE">Almacén</option>
            <option value="ZONE">Zonas</option>
            <option value="AISLE">Pasillos</option>
            <option value="SHELF">Estantes</option>
            <option value="CELL">Celdas</option>
          </Select>
        </div>

        <div className={styles.viewToggle}>
          <button
            className={clsx(styles.toggleBtn, { [styles.active]: viewMode === 'map' })}
            onClick={() => setViewMode('map')}
          >
            <MapIcon size={18} />
            <span>Vista Mapa</span>
          </button>
          <button
            className={clsx(styles.toggleBtn, { [styles.active]: viewMode === 'list' })}
            onClick={() => setViewMode('list')}
          >
            <LayoutList size={18} />
            <span>Vista Lista</span>
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {viewMode === 'list' && (
          <LocationList
            searchTerm={searchTerm}
            typeFilter={typeFilter}
          />
        )}
        {viewMode === 'map' && (
          <LocationMap
            onShelfClick={(loc) => setSelectedLocation(loc)}
          />
        )}
      </div>

      <LocationDetailDrawer
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
        onEdit={handleEdit}
        onDelete={(id) => console.log('Delete', id)}
      />

      <LocationFormDrawer
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingLocation}
      />
    </PageWrapper>
  );
}
