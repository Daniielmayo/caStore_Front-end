'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, X } from 'lucide-react';
import Link from 'next/link';
import styles from './UsersList.module.css';
import { UserSummaryCards } from './UserSummaryCards';
import { UsersTable } from './UsersTable';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Button } from '../../../../components/ui/Button';
import { mockUsers, mockRoles } from '../../mockData';

export function UsersList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [users, setUsers] = useState(mockUsers);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === '' || user.roleId === roleFilter;
      const matchesStatus = statusFilter === '' || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchTerm, roleFilter, statusFilter, users]);

  const handleToggleStatus = (id: string, currentStatus: string) => {
    setUsers(prev => prev.map(u => 
      u.id === id 
        ? { ...u, status: currentStatus === 'active' ? 'inactive' : 'active' } 
        : u
    ));
  };

  return (
    <div className={styles.container}>
      {/* Header handled by PageWrapper, but we need the Action Button */}
      <div className={styles.topActions}>
        <Link href="/users/new">
          <Button>
            <Plus size={18} />
            Crear usuario
          </Button>
        </Link>
      </div>

      <UserSummaryCards users={users} roleCount={mockRoles.length} />

      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o correo..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filters}>
          <Select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Todos los roles</option>
            {mockRoles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </Select>

          <Select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </Select>

          {(searchTerm || roleFilter || statusFilter) && (
            <button 
              className={styles.clearBtn}
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('');
                setStatusFilter('');
              }}
            >
              <X size={14} /> Limpiar
            </button>
          )}
        </div>
      </div>

      <UsersTable 
        users={filteredUsers} 
        onToggleStatus={handleToggleStatus} 
      />

      <div className={styles.footer}>
        <span className={styles.resultsCount}>
          Mostrando {filteredUsers.length} de {users.length} usuarios
        </span>
      </div>
    </div>
  );
}
