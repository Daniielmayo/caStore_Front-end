'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/src/hooks/useAuth';
import { useAlertsSummary } from '@/src/features/alerts/hooks/useAlerts';
import styles from './Topbar.module.css';

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/profile': 'Mi Perfil',
  '/products': 'Gestión de Productos',
  '/alerts': 'Alertas de Inventario',
  '/movements': 'Movimientos',
  '/suppliers': 'Proveedores',
  '/users': 'Usuarios',
  '/categories': 'Categorías',
  '/locations': 'Localizaciones',
};

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logoutAction } = useAuth();
  const { activeCount } = useAlertsSummary();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const title = routeTitles[pathname] || 'Dashboard';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  const handleLogout = async () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      setShowDropdown(false);
      await logoutAction();
      router.push('/login');
    }
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <h2 className={styles.title}>{title}</h2>
      </div>

      <div className={styles.right}>
        <button className={styles.notifyBtn} onClick={() => router.push('/alerts')}>
          <Bell size={20} />
          {activeCount > 0 && (
            <span className={styles.badge}>{activeCount > 99 ? '99+' : activeCount}</span>
          )}
        </button>

        <div className={styles.divider} />

        <div
          ref={dropdownRef}
          className={styles.userSection}
          onClick={() => setShowDropdown(!showDropdown)}
          onKeyDown={(e) => e.key === 'Enter' && setShowDropdown(!showDropdown)}
          role="button"
          tabIndex={0}
          aria-haspopup="true"
          aria-expanded={showDropdown}
        >
          <div className={styles.avatar}>
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.fullName || 'Usuario'}</span>
            <span className={styles.userRole}>{user?.roleName || 'Admin'}</span>
          </div>
          <ChevronDown size={16} className={showDropdown ? styles.rotate : ''} />

          {showDropdown && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <div className={styles.largeAvatar}>
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <div className={styles.dropdownUserInfo}>
                  <span className={styles.dropdownName}>{user?.fullName}</span>
                  <span className={styles.dropdownEmail}>{user?.email}</span>
                  <span className={styles.roleBadge}>{user?.roleName}</span>
                </div>
              </div>
              <div className={styles.dropdownDivider} />
              <button className={styles.dropdownItem} onClick={() => router.push('/profile')}>
                <User size={16} />
                <span>Mi perfil</span>
              </button>
              <div className={styles.dropdownDivider} />
              <button className={styles.logoutBtn} onClick={handleLogout}>
                <LogOut size={16} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
