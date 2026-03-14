'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, X } from 'lucide-react';
import Link from 'next/link';
import styles from './RolesList.module.css';
import { RoleCard } from './RoleCard';
import { Button } from '../../../../components/ui/Button';
import { mockRoles } from '../../mockData';

export function RolesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roles, setRoles] = useState(mockRoles);

  const systemRoles = useMemo(() => roles.filter(r => r.type === 'system'), [roles]);
  const customRoles = useMemo(() => roles.filter(r => r.type === 'custom'), [roles]);

  const filteredCustomRoles = useMemo(() => {
    return customRoles.filter(role => 
      role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, customRoles]);

  const handleDelete = (id: string) => {
    setRoles(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.topActions}>
        <Link href="/roles/new">
          <Button>
            <Plus size={18} />
            Crear rol
          </Button>
        </Link>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre de rol..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.countInfo}>
          Total: <strong>{roles.length} roles</strong>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Roles del sistema</h2>
        <div className={styles.grid}>
          {systemRoles.map(role => (
            <RoleCard key={role.id} role={role} onDelete={handleDelete} />
          ))}
        </div>
      </section>

      <div className={styles.separator} />

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Roles personalizados</h2>
        </div>
        
        {filteredCustomRoles.length === 0 ? (
          <div className={styles.emptyState}>
            <p>{searchTerm ? 'No se encontraron roles personalizados con ese nombre' : 'Aún no has creado roles personalizados'}</p>
            {!searchTerm && <small>Puedes clonar un rol del sistema para comenzar.</small>}
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredCustomRoles.map(role => (
              <RoleCard key={role.id} role={role} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
