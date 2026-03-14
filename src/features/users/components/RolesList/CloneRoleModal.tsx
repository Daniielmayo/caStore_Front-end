'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '../../mockData';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import styles from './RolesList.module.css';

interface CloneRoleModalProps {
  role: Role;
  onClose: () => void;
}

export function CloneRoleModal({ role, onClose }: CloneRoleModalProps) {
  const router = useRouter();
  const [newName, setNewName] = useState(`Copia de ${role.name}`);
  const [isLoading, setIsLoading] = useState(false);

  const handleClone = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      // Redirect to edit view of the "new" role (simulated)
      router.push(`/roles/new?cloneFrom=${role.id}&name=${encodeURIComponent(newName)}`);
    }, 1200);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Clonar rol</h3>
          <p className={styles.modalSubtitle}>Clonando "{role.name}"</p>
        </div>

        <div className={styles.modalBody}>
          <Input 
            label="Nombre del nuevo rol" 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            autoFocus
          />
          <div className={styles.infoBox}>
            El nuevo rol tendrá exactamente los mismos permisos que <strong>{role.name}</strong>. Podrás modificarlos después.
          </div>
        </div>

        <div className={styles.modalFooter}>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleClone} isLoading={isLoading}>
            Crear copia
          </Button>
        </div>
      </div>
    </div>
  );
}
