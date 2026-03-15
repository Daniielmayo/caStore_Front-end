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
  /** Si se proporciona, se llama con el nombre y el padre gestiona la mutación (API). */
  onClone?: (name: string) => void;
  /** Estado de carga desde el padre (mutación en curso). */
  isLoading?: boolean;
}

export function CloneRoleModal({ role, onClose, onClone, isLoading: externalLoading = false }: CloneRoleModalProps) {
  const router = useRouter();
  const [newName, setNewName] = useState(`Copia de ${role.name}`);
  const [internalLoading, setInternalLoading] = useState(false);

  const isLoading = externalLoading || internalLoading;

  const handleClone = () => {
    const name = newName.trim();
    if (!name) return;

    if (onClone) {
      onClone(name);
      return;
    }

    setInternalLoading(true);
    setTimeout(() => {
      setInternalLoading(false);
      onClose();
      router.push(`/roles/new?cloneFrom=${role.id}&name=${encodeURIComponent(name)}`);
    }, 1200);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Clonar rol</h3>
          <p className={styles.modalSubtitle}>Clonando &quot;{role.name}&quot;</p>
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
          <Button onClick={handleClone} isLoading={isLoading} disabled={!newName.trim()}>
            Crear copia
          </Button>
        </div>
      </div>
    </div>
  );
}
