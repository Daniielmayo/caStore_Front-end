'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '../features/auth/context/AuthContext';
import { ToastProvider } from '../components/ui/Toast';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ToastProvider>
  );
}
