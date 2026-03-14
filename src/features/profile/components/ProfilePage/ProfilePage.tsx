'use client';

import React from 'react';
import styles from './ProfilePage.module.css';
import { ProfileIdentityCard } from './ProfileIdentityCard';
import { PersonalInfoSection } from './PersonalInfoSection';
import { SecuritySection } from './SecuritySection';
import { NotificationsSection } from './NotificationsSection';
import { SessionsSection } from './SessionsSection';

export function ProfilePage() {
  return (
    <div className={styles.container}>
      <aside className={styles.sideCol}>
        <ProfileIdentityCard />
      </aside>

      <main className={styles.mainCol}>
        <div className={styles.contentWrap}>
          <PersonalInfoSection />
          <div className={styles.divider} />
          <SecuritySection />
          <div className={styles.divider} />
          <NotificationsSection />
          <div className={styles.divider} />
          <SessionsSection />
        </div>
      </main>
    </div>
  );
}
