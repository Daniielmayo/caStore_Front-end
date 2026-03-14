'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Info, 
  Upload, 
  FileText, 
  Trash2, 
  Building2,
  CheckCircle2,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { 
  supplierSchema, 
  supplierStep1Schema, 
  supplierStep2Schema,
  calculateNITVerificationDigit,
  SupplierFormData
} from '../../schemas/supplier.schema';
import styles from './SupplierWizard.module.css';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { useToast } from '../../../../components/ui/Toast';

interface SupplierWizardProps {
  initialData?: any;
  isEdit?: boolean;
}

const STEPS = [
  { id: 1, name: 'Información legal' },
  { id: 2, name: 'Comercial' },
  { id: 3, name: 'Confirmación' }
];

export function SupplierWizard({ initialData, isEdit = false }: SupplierWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [nitDV, setNitDV] = useState<number | null>(null);
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Form setup
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    trigger,
    formState: { errors } 
  } = useForm<any>({
    resolver: zodResolver(currentStep === 1 ? supplierStep1Schema : supplierStep2Schema),
    defaultValues: initialData || {
      country: 'Colombia',
      currency: 'COP',
      paymentTerms: '30 días',
    }
  });

  const nitValue = watch('nit');
  const watchedFields = watch();

  useEffect(() => {
    if (nitValue) {
      setNitDV(calculateNITVerificationDigit(nitValue));
    } else {
      setNitDV(null);
    }
  }, [nitValue]);

  const handleNext = async () => {
    const fieldsToValidate = currentStep === 1 
      ? Object.keys(supplierStep1Schema.shape) 
      : Object.keys(supplierStep2Schema.shape);
    
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    showToast({ 
      message: isEdit ? 'Proveedor actualizado con éxito' : 'Proveedor creado con éxito', 
      type: 'success' 
    });
    setIsLoading(false);
    router.push('/suppliers');
  };

  return (
    <div className={styles.container}>
      {/* Progress Bar */}
      <div className={styles.stepperBox}>
        <div className={styles.stepper}>
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className={clsx(styles.step, {
                [styles.active]: currentStep === step.id,
                [styles.completed]: currentStep > step.id
              })}>
                <div className={styles.stepCircle}>
                  {currentStep > step.id ? <Check size={16} /> : step.id}
                </div>
                <span className={styles.stepName}>{step.name}</span>
              </div>
              {idx < STEPS.length - 1 && <div className={clsx(styles.stepLine, { [styles.lineActive]: currentStep > step.id })} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {currentStep === 1 && (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h2 className={styles.stepTitle}>Información legal y de contacto</h2>
              <p className={styles.stepSubtitle}>Datos básicos de identificación tributaria y ubicación.</p>
            </div>

            <div className={styles.row}>
              <Input label="Razón social" {...register('businessName')} error={errors.businessName?.message as string} required />
              <Input label="Nombre comercial" {...register('commercialName')} error={errors.commercialName?.message as string} required />
            </div>

            <div className={styles.row}>
              <div className={styles.nitFieldWrapper}>
                <Input label="NIT o RUC" placeholder="Ej: 901362835" {...register('nit')} error={errors.nit?.message as string} required />
                {nitDV !== null && (
                  <div className={styles.dvBadge}>
                    <span>DV</span>
                    <strong>{nitDV}</strong>
                  </div>
                )}
              </div>
              <Select label="Tipo de proveedor" {...register('type')} error={errors.type?.message as string} required>
                <option value="">Seleccione...</option>
                <option value="Nacional">Nacional</option>
                <option value="Internacional">Internacional</option>
                <option value="Fabricante">Fabricante</option>
                <option value="Distribuidor">Distribuidor</option>
              </Select>
            </div>

            <div className={styles.row}>
              <Select label="Tipo de contribuyente" {...register('taxpayerType')} error={errors.taxpayerType?.message as string} required>
                <option value="">Seleccione...</option>
                <option value="Persona Natural">Persona Natural</option>
                <option value="Persona Jurídica">Persona Jurídica</option>
                <option value="Gran Contribuyente">Gran Contribuyente</option>
                <option value="Régimen Simplificado">Régimen Simplificado</option>
              </Select>
              <Select label="País" {...register('country')} error={errors.country?.message as string} required>
                <option value="Colombia">Colombia</option>
                <option value="Estados Unidos">Estados Unidos</option>
                <option value="Alemania">Alemania</option>
                <option value="China">China</option>
              </Select>
            </div>

            <div className={styles.row}>
              <Input label="Departamento / Provincia" {...register('department')} error={errors.department?.message as string} required />
              <Input label="Ciudad" {...register('city')} error={errors.city?.message as string} required />
            </div>

            <div className={styles.row}>
              <Input label="Dirección" {...register('address')} error={errors.address?.message as string} required />
              <Input label="Teléfono" {...register('phone')} placeholder="Ej: (601) 345 6789" error={errors.phone?.message as string} required />
            </div>

            <div className={styles.row}>
              <Input label="Correo electrónico" {...register('email')} error={errors.email?.message as string} required />
              <Input label="Persona de contacto" {...register('contactPerson')} error={errors.contactPerson?.message as string} required />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h2 className={styles.stepTitle}>Condiciones y preferencias comerciales</h2>
              <p className={styles.stepSubtitle}>Define los términos de negociación y adjunta soportes.</p>
            </div>

            <div className={styles.row}>
              <Select label="Condiciones de pago" {...register('paymentTerms')} error={errors.paymentTerms?.message as string} required>
                <option value="Contado">Contado</option>
                <option value="30 días">30 días</option>
                <option value="60 días">60 días</option>
                <option value="90 días">90 días</option>
              </Select>
              <Select label="Moneda de negociación" {...register('currency')} error={errors.currency?.message as string} required>
                <option value="COP">COP (Peso Colombiano)</option>
                <option value="USD">USD (Dólar)</option>
                <option value="EUR">EUR (Euro)</option>
              </Select>
            </div>

            <div className={styles.fieldItemFull}>
              <Input label="Sitio web (Opcional)" placeholder="https://..." {...register('website')} error={errors.website?.message as string} />
            </div>

            <div className={styles.fieldItemFull}>
              <label className={styles.fieldLabel}>Observaciones</label>
              <textarea 
                className={styles.textarea} 
                {...register('observations')}
                placeholder="Notas adicionales sobre el proveedor..."
              />
            </div>

            <div className={styles.uploadSection}>
              <h4 className={styles.subTitle}>Documentos adjuntos (Opcional - PDF)</h4>
              <div className={styles.dropzone}>
                <Upload className={styles.uploadIcon} />
                <p>Haz clic o arrastra archivos para cargar RUT y Cámara de Comercio</p>
                <span>Máx 5MB por archivo</span>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h2 className={styles.stepTitle}>Revisa la información antes de guardar</h2>
              <p className={styles.stepSubtitle}>Verifica que todos los datos sean correctos.</p>
            </div>

            <div className={styles.summaryGrid}>
              <div className={styles.summaryCol}>
                <h4 className={styles.summaryTitle}>Información legal</h4>
                <SummaryItem label="Razón social" value={watchedFields.businessName} />
                <SummaryItem label="Nombre comercial" value={watchedFields.commercialName} />
                <SummaryItem label="NIT" value={`${watchedFields.nit}-${nitDV}`} />
                <SummaryItem label="Tipo" value={watchedFields.type} />
                <SummaryItem label="Ubicación" value={`${watchedFields.city}, ${watchedFields.department}`} />
                <SummaryItem label="Contacto" value={watchedFields.contactPerson} />
              </div>

              <div className={styles.summaryCol}>
                <h4 className={styles.summaryTitle}>Datos comerciales</h4>
                <SummaryItem label="Condiciones pago" value={watchedFields.paymentTerms} />
                <SummaryItem label="Moneda" value={watchedFields.currency} />
                <SummaryItem label="Web" value={watchedFields.website} />
                <SummaryItem label="Observaciones" value={watchedFields.observations} />
              </div>
            </div>

            <div className={styles.alertBox}>
              <Info size={20} />
              <p>Una vez creado el proveedor podrá asociarlo a movimientos de inventario de tipo entrada por compra.</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.actions}>
          <div className={styles.leftActions}>
            <Button type="button" variant="secondary" onClick={() => router.push('/suppliers')}>
              Cancelar
            </Button>
          </div>
          <div className={styles.rightActions}>
            {currentStep > 1 && (
              <Button type="button" variant="secondary" onClick={handleBack} disabled={isLoading}>
                <ChevronLeft size={18} />
                Anterior
              </Button>
            )}
            
            {currentStep < 3 ? (
              <Button type="button" onClick={handleNext}>
                Siguiente
                <ChevronRight size={18} />
              </Button>
            ) : (
              <Button type="submit" isLoading={isLoading}>
                {isEdit ? 'Guardar cambios' : 'Guardar proveedor'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className={styles.summaryItem}>
      <span className={styles.summaryLabel}>{label}</span>
      <span className={clsx(styles.summaryValue, { [styles.emptyValue]: !value })}>
        {value || 'No especificado'}
      </span>
    </div>
  );
}
