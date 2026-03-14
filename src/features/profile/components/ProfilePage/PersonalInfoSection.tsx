'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../auth/context/AuthContext';
import { useToast } from '../../../../components/ui/Toast';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import styles from './ProfilePage.module.css';
import { AlertCircle } from 'lucide-react';

export function PersonalInfoSection() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email
  });

  const hasEmailChanged = formData.email !== user.email;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      updateUser(formData);
      showToast({ message: 'Información actualizada correctamente', type: 'success' });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className={styles.formSection}>
      <h3 className={styles.sectionTitle}>Información personal</h3>
      <form onSubmit={handleSubmit} className={styles.sectionForm}>
        <div className={styles.fieldGrid}>
          <Input 
            label="Nombre completo" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input 
            label="Correo electrónico" 
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        {hasEmailChanged && (
          <div className={styles.verificationNotice}>
            <AlertCircle size={16} />
            <p>Al cambiar tu correo deberás verificarlo en tu próximo acceso al sistema.</p>
          </div>
        )}

        <div className={styles.formActions}>
          <Button type="submit" isLoading={isLoading}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </section>
  );
}
