import { z } from 'zod';

const baseMovementSchema = z.object({
  productId: z.string().min(1, 'Debe seleccionar un producto'),
  quantity: z.number().positive('La cantidad debe ser mayor a cero'),
  createdAt: z.string().refine((val) => {
    const date = new Date(val);
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    return date <= now && date >= thirtyDaysAgo;
  }, 'La fecha debe ser actual o de los últimos 30 días'),
  observations: z.string().max(200, 'Máximo 200 caracteres').optional(),
});

export const purchaseEntrySchema = baseMovementSchema.extend({
  type: z.literal('purchase_entry'),
  providerId: z.string().min(1, 'El proveedor es requerido'),
  documentRef: z.string().min(1, 'El documento de referencia es requerido'),
  destLocation: z.string().min(1, 'La ubicación destino es requerida'),
  lotNumber: z.string().optional(),
});

export const saleExitSchema = baseMovementSchema.extend({
  type: z.literal('sale_exit'),
  documentRef: z.string().min(1, 'El documento de referencia es requerido'),
  originLocation: z.string().min(1, 'La ubicación origen es requerida'),
});

export const transferSchema = baseMovementSchema.extend({
  type: z.literal('transfer'),
  originLocation: z.string().min(1, 'La ubicación origen es requerida'),
  destLocation: z.string().min(1, 'La ubicación destino es requerida'),
  documentRef: z.string().min(1, 'El documento de referencia es requerido'),
}).refine(data => data.originLocation !== data.destLocation, {
  message: "El origen y destino no pueden ser el mismo lugar",
  path: ["destLocation"]
});

const baseAdjustmentSchema = baseMovementSchema.extend({
  reason: z.enum(['conteo_fisico', 'error_sistema', 'dañado', 'merma', 'otro'], {
    message: 'Debe seleccionar un motivo'
  }),
  otherReason: z.string().optional(),
  originLocation: z.string().optional(), // only for neg
  destLocation: z.string().optional(), // only for pos
});

const refinedAdjustment = (schema: any) => schema.refine((data: any) => {
  if (data.reason === 'otro' && (!data.otherReason || data.otherReason.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: "Debe especificar el otro motivo",
  path: ["otherReason"]
});

export const adjustmentPosSchema = refinedAdjustment(baseAdjustmentSchema.extend({
  type: z.literal('adjustment_pos'),
}));

export const adjustmentNegSchema = refinedAdjustment(baseAdjustmentSchema.extend({
  type: z.literal('adjustment_neg'),
}));

export const returnSchema = baseMovementSchema.extend({
  type: z.literal('return'),
  returnFrom: z.enum(['customer', 'provider']),
  documentRef: z.string().min(1, 'El documento de referencia original es requerido'),
  destLocation: z.string().min(1, 'La ubicación destino es requerida'),
});

// Discriminated union for the aggregate schema
export const movementSchema = z.discriminatedUnion('type', [
  purchaseEntrySchema,
  saleExitSchema,
  transferSchema,
  adjustmentPosSchema,
  adjustmentNegSchema,
  returnSchema,
]);

export type MovementFormData = z.infer<typeof movementSchema>;
