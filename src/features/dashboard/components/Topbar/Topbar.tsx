"use client";

import React from "react";
import { Bell, User, ChevronDown } from "lucide-react";
import styles from "./Topbar.module.css";

export function Topbar() {
  return (
    <header className={styles.topbar}>
      <h1 className={styles.logo}>CA STORE</h1>

      <div className={styles.rightSection}>
        <button className={styles.iconButton} aria-label="Notificaciones">
          <Bell className="h-5 w-5" />
        </button>

        <button className={styles.userDropdown}>
          <div className={styles.avatar}>
            <User className="h-4 w-4" />
          </div>
          <div className={styles.userInfo}>
            <span>Delicious Burger</span>
            <ChevronDown className={`h-4 w-4 ${styles.chevron}`} />
          </div>
        </button>
      </div>
    </header>
  );
}
