'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ArrowLeft, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ArrowRightLeft, 
  Settings2, 
  RotateCcw,
  Search,
  Package,
  Info,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { 
  movementSchema, 
  MovementFormData, 
} from '../../schemas/movement.schema';
import styles from './RegisterMovementForm.module.css';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { useToast } from '../../../../components/ui/Toast';

// Mock data for products search
const MOCK_PRODUCTS = [
  { id: 'prod-1', name: 'Aceite de Motor 5W-30', sku: 'MOT-ACE-001', stock: 24, location: 'A-15' },
  { id: 'prod-2', name: 'Pastillas de Freno', sku: 'FRE-PAS-002', stock: 12, location: 'B-02' },
  { id: 'prod-3', name: 'Filtro de Aire', sku: 'MOT-FIL-003', stock: 8, location: 'A-10' },
  { id: 'prod-4', name: 'Amortiguador Hidráulico', sku: 'SUS-AMO-004', stock: 5, location: 'B-12' },
  { id: 'prod-5', name: 'Bujía Iridium', sku: 'MOT-BUJ-005', stock: 45, location: 'C-01' },
];

const MOVEMENT_TYPES = [
  { 
    id: 'purchase_entry', 
    label: 'Entrada por compra', 
    description: 'Recepción de mercancía de un proveedor.', 
    icon: ArrowDownToLine,
    color: styles.typeGreen 
  },
  { 
    id: 'sale_exit', 
    label: 'Salida por venta', 
    description: 'Despacho de productos a cliente o consumo.', 
    icon: ArrowUpFromLine,
    color: styles.typeRed 
  },
  { 
    id: 'transfer', 
    label: 'Transferencia', 
    description: 'Mover productos entre ubicaciones.', 
    icon: ArrowRightLeft,
    color: styles.typeBlue 
  },
  { 
    id: 'adjustment_pos', // simplification for the UI selection
    label: 'Ajuste', 
    description: 'Corrección de diferencias en el inventario.', 
    icon: Settings2,
    color: styles.typeOrange 
  },
  { 
    id: 'return', 
    label: 'Devolución', 
    description: 'Retorno de productos al inventario.', 
    icon: RotateCcw,
    color: styles.typePurple 
  },
];

export function RegisterMovementForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<typeof MOCK_PRODUCTS[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form setup
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors } 
  } = useForm<any>({ // using any for ease with discriminated union switching
    resolver: zodResolver(movementSchema),
    defaultValues: {
      createdAt: new Date().toISOString().split('T')[0],
      quantity: 0,
    }
  });

  const quantity = watch('quantity') || 0;
  const watchAdjType = watch('adjustmentType') || 'pos';

  // Computed: Stock preview
  const stockResult = useMemo(() => {
    if (!selectedProduct) return null;
    let result = selectedProduct.stock;
    
    if (selectedType === 'purchase_entry' || selectedType === 'return' || (selectedType === 'adjustment_pos' && watchAdjType === 'pos')) {
      result += quantity;
    } else if (selectedType === 'sale_exit' || (selectedType === 'adjustment_pos' && watchAdjType === 'neg')) {
      result -= quantity;
    }
    
    return result;
  }, [selectedProduct, selectedType, quantity, watchAdjType]);

  const stockError = useMemo(() => {
    if (!selectedProduct || !selectedType) return false;
    if (selectedType === 'sale_exit' || (selectedType === 'adjustment_pos' && watchAdjType === 'neg')) {
      return quantity > selectedProduct.stock;
    }
    return false;
  }, [selectedProduct, selectedType, quantity, watchAdjType]);

  // Product search filter
  const productResults = useMemo(() => {
    if (!productSearch) return [];
    return MOCK_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
      p.sku.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [productSearch]);

  const handleSelectType = (id: string) => {
    setSelectedType(id);
    setValue('type', id === 'adjustment_pos' ? (watchAdjType === 'pos' ? 'adjustment_pos' : 'adjustment_neg') : id);
  };

  const handleSelectProduct = (p: typeof MOCK_PRODUCTS[0]) => {
    setSelectedProduct(p);
    setValue('productId', p.id);
    setProductSearch('');
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    console.log('Registering movement:', data);
    showToast({ 
      message: `Movimiento registrado: ${selectedType} de ${selectedProduct?.name}`, 
      type: 'success' 
    });
    setIsLoading(false);
    router.push('/movements');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/movements" className={styles.backBtn}>
          <ArrowLeft size={20} />
          Volver al listado
        </Link>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>1. Selecciona el tipo de movimiento</h3>
        <div className={styles.typeGrid}>
          {MOVEMENT_TYPES.map(type => (
            <div 
              key={type.id}
              className={clsx(styles.typeCard, { [styles.typeCardActive]: selectedType === type.id })}
              onClick={() => handleSelectType(type.id)}
            >
              <div className={clsx(styles.typeIconBox, type.color)}>
                <type.icon size={24} />
              </div>
              <div className={styles.typeInfo}>
                <span className={styles.typeLabel}>{type.label}</span>
                <p className={styles.typeDesc}>{type.description}</p>
              </div>
              {selectedType === type.id && <div className={styles.checkBadge}><CheckCircle2 size={16} /></div>}
            </div>
          ))}
        </div>
      </div>

      {selectedType && (
        <form className={styles.formContent} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>2. Identificación del producto</h3>
            <div className={styles.searchBox}>
              <div className={styles.inputWithResults}>
                <Input 
                  label="Buscar producto"
                  placeholder="Escribe nombre o SKU..."
                  icon={Search}
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  error={errors.productId?.message as string}
                />
                {productResults.length > 0 && (
                  <div className={styles.resultsDropdown}>
                    {productResults.map(p => (
                      <div key={p.id} className={styles.resultItem} onClick={() => handleSelectProduct(p)}>
                        <div className={styles.resultMain}>
                          <span className={styles.resName}>{p.name}</span>
                          <span className={styles.resSku}>{p.sku}</span>
                        </div>
                        <div className={styles.resStock}>Stock: {p.stock}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {selectedProduct && (
                <div className={styles.selectedProductCard}>
                  <div className={styles.pCardInfo}>
                    <Package size={32} className={styles.pCardIcon} />
                    <div>
                      <span className={styles.pCardName}>{selectedProduct.name}</span>
                      <span className={styles.pCardSku}>{selectedProduct.sku}</span>
                    </div>
                  </div>
                  <div className={styles.pCardStock}>
                    <span className={styles.stockLabel}>Stock Actual</span>
                    <span className={styles.stockValue}>{selectedProduct.stock}</span>
                  </div>
                  <button className={styles.removeP} onClick={() => setSelectedProduct(null)}><X size={16} /></button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.fieldItem}>
              <Input
                label="Cantidad"
                type="number"
                {...register('quantity', { valueAsNumber: true })}
                error={stockError ? `Stock insuficiente. Disponible: ${selectedProduct?.stock} unidades.` : (errors.quantity?.message as string)}
              />
              {selectedProduct && !stockError && (
                <div className={styles.stockPreview}>
                  Stock resultante: <strong>{selectedProduct.stock}</strong> → 
                  <strong className={styles.resValue}> {stockResult}</strong>
                </div>
              )}
            </div>

            <div className={styles.fieldItem}>
              <Input
                label="Fecha del movimiento"
                type="date"
                {...register('createdAt')}
                error={errors.createdAt?.message as string}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Type Specific Fields */}
            {selectedType === 'purchase_entry' && (
              <>
                <div className={styles.fieldItem}>
                  <Input label="Documento de referencia (Factura)" {...register('documentRef')} error={errors.documentRef?.message as string} />
                </div>
                <div className={styles.fieldItem}>
                  <Input label="Proveedor" placeholder="Ej. Lubricantes S.A." {...register('providerId')} error={errors.providerId?.message as string} />
                </div>
                <div className={styles.fieldItem}>
                  <Input label="Número de Lote (Opcional)" {...register('lotNumber')} />
                </div>
                <div className={styles.fieldItem}>
                  <Input label="Ubicación Destino" {...register('destLocation')} error={errors.destLocation?.message as string} />
                </div>
              </>
            )}

            {selectedType === 'sale_exit' && (
              <>
                <div className={styles.fieldItem}>
                  <Input label="Documento de referencia (Remisión/Venta)" {...register('documentRef')} error={errors.documentRef?.message as string} />
                </div>
                <div className={styles.fieldItem}>
                  <Input label="Ubicación Origen" {...register('originLocation')} error={errors.originLocation?.message as string} />
                </div>
              </>
            )}

            {selectedType === 'transfer' && (
              <>
                <div className={styles.fieldItem}>
                  <Input label="Ubicación Origen" {...register('originLocation')} error={errors.originLocation?.message as string} />
                </div>
                <div className={styles.fieldItem}>
                  <Input label="Ubicación Destino" {...register('destLocation')} error={errors.destLocation?.message as string} />
                </div>
                <div className={styles.fieldItem}>
                  <Input label="Documento / Guía" {...register('documentRef')} error={errors.documentRef?.message as string} />
                </div>
              </>
            )}

            {selectedType === 'adjustment_pos' && (
              <>
                <div className={styles.fieldItem}>
                  <label className={styles.fieldLabel}>Tipo de Ajuste</label>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <input type="radio" value="pos" checked={watchAdjType === 'pos'} onChange={() => setValue('adjustmentType', 'pos')} />
                      Positivo (+)
                    </label>
                    <label className={styles.radioLabel}>
                      <input type="radio" value="neg" checked={watchAdjType === 'neg'} onChange={() => setValue('adjustmentType', 'neg')} />
                      Negativo (-)
                    </label>
                  </div>
                </div>
                <div className={styles.fieldItem}>
                  <Select label="Motivo del ajuste" {...register('reason')} error={errors.reason?.message as string}>
                    <option value="conteo_fisico">Conteo físico</option>
                    <option value="error_sistema">Error de sistema</option>
                    <option value="dañado">Producto dañado</option>
                    <option value="merma">Merma</option>
                    <option value="otro">Otro</option>
                  </Select>
                </div>
                {watch('reason') === 'otro' && (
                  <div className={styles.fieldItemFull}>
                    <Input label="Especifique motivo" {...register('otherReason')} error={errors.otherReason?.message as string} />
                  </div>
                )}
              </>
            )}

            {selectedType === 'return' && (
              <>
                <div className={styles.fieldItem}>
                   <Select label="Origen de devolución" {...register('returnFrom')}>
                     <option value="customer">De Cliente</option>
                     <option value="provider">A Proveedor (Salida)</option>
                   </Select>
                </div>
                <div className={styles.fieldItem}>
                   <Input label="Doc. Referencia Original" {...register('documentRef')} error={errors.documentRef?.message as string} />
                </div>
                <div className={styles.fieldItem}>
                   <Input label="Reingresar a Ubicación" {...register('destLocation')} error={errors.destLocation?.message as string} />
                </div>
              </>
            )}

            <div className={styles.fieldItemFull}>
              <label className={styles.fieldLabel}>Observaciones</label>
              <textarea 
                className={styles.textarea} 
                placeholder="Notas adicionales sobre este movimiento..."
                {...register('observations')}
              />
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.sumInfo}>
              <h4 className={styles.sumTitle}>Resumen del registro</h4>
              <div className={styles.sumGrid}>
                <div className={styles.sumItem}>
                  <Info size={16} />
                   <span>{MOVEMENT_TYPES.find(t => t.id === selectedType)?.label}</span>
                </div>
                {selectedProduct && (
                  <div className={styles.sumItem}>
                    <Package size={16} />
                    <span>{selectedProduct.name} ({quantity} und)</span>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.sumActions}>
               <Button type="button" variant="secondary" onClick={() => router.push('/movements')}>Cancelar</Button>
               <Button type="submit" isLoading={isLoading} disabled={stockError || !selectedProduct}>
                 Registrar movimiento
               </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
