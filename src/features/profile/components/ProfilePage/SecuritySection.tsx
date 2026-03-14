'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Check, Circle, Shield } from 'lucide-react';
import { useToast } from '../../../../components/ui/Toast';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import styles from './ProfilePage.module.css';
import clsx from 'clsx';

export function SecuritySection() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const requirements = [
    { id: 'length', text: 'Mínimo 8 caracteres', met: passwords.new.length >= 8 },
    { id: 'upper', text: 'Una mayúscula', met: /[A-Z]/.test(passwords.new) },
    { id: 'number', text: 'Un número', met: /[0-9]/.test(passwords.new) },
    { id: 'special', text: 'Un carácter especial', met: /[^A-Za-z0-9]/.test(passwords.new) },
  ];

  const strength = requirements.filter(r => r.met).length;

  const strengthLabels = [
    { label: 'Muy débil', color: styles.strengthRed },
    { label: 'Débil', color: styles.strengthOrange },
    { label: 'Buena', color: styles.strengthYellow },
    { label: 'Fuerte', color: styles.strengthGreen },
  ];

  const canSubmit = passwords.current && strength === 4 && passwords.new === passwords.confirm;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (passwords.current !== '12345678') { // Simulated current pass check
        showToast({ message: 'La contraseña actual no es correcta', type: 'error' });
      } else {
        showToast({ message: 'Contraseña actualizada correctamente', type: 'success' });
        setPasswords({ current: '', new: '', confirm: '' });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <section className={styles.formSection}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Seguridad y contraseña</h3>
        <p className={styles.sectionSubtitle}>Te recomendamos usar una contraseña única que no uses en otros sitios.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.sectionForm}>
        <div className={styles.passwordGrid}>
          <div className={styles.passwordInputWrapper}>
            <Input 
              label="Contraseña actual" 
              type={showPassword.current ? "text" : "password"}
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              required
            />
            <button 
              type="button" 
              className={styles.eyeBtn}
              onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
            >
              {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className={styles.passwordInputWrapper}>
            <Input 
              label="Nueva contraseña" 
              type={showPassword.new ? "text" : "password"}
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              required
            />
            <button 
              type="button" 
              className={styles.eyeBtn}
              onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
            >
              {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className={styles.passwordInputWrapper}>
            <Input 
              label="Confirmar nueva contraseña" 
              type={showPassword.confirm ? "text" : "password"}
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              required
              error={passwords.confirm && passwords.new !== passwords.confirm ? 'Las contraseñas no coinciden' : ''}
            />
            <button 
              type="button" 
              className={styles.eyeBtn}
              onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
            >
              {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className={styles.requirementsWrapper}>
          <div className={styles.reqList}>
            {requirements.map((req) => (
              <div key={req.id} className={clsx(styles.reqItem, { [styles.reqMet]: req.met })}>
                {req.met ? <Check size={12} /> : <Circle size={10} />}
                <span>{req.text}</span>
              </div>
            ))}
          </div>

          <div className={styles.strengthWrapper}>
             <div className={styles.strengthBar}>
                {[1, 2, 3, 4].map((level) => (
                  <div 
                    key={level} 
                    className={clsx(styles.strengthSegment, { 
                      [strengthLabels[strength - 1]?.color]: level <= strength 
                    })} 
                  />
                ))}
             </div>
             {strength > 0 && (
               <span className={clsx(styles.strengthLabel, strengthLabels[strength - 1]?.color)}>
                 Fortaleza: {strengthLabels[strength - 1]?.label}
               </span>
             )}
          </div>
        </div>

        <div className={styles.formActions}>
          <Button type="submit" isLoading={isLoading} disabled={!canSubmit}>
            Cambiar contraseña
          </Button>
        </div>
      </form>
    </section>
  );
}
