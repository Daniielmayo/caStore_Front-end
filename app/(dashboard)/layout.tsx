'use client';

import React from 'react';
import { Sidebar } from '../../src/components/layout/Sidebar/Sidebar';
import { Topbar } from '../../src/components/layout/Topbar/Topbar';
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
