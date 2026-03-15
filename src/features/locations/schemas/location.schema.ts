import { z } from 'zod';

export const locationSchema = z.object({
  type: z.enum(['WAREHOUSE', 'ZONE', 'AISLE', 'SHELF', 'CELL']),
  parentId: z.string().optional().refine(val => {
    // If not WAREHOUSE, parentId is required (handled by form logic)
    return true;
  }),
  code: z.string()
    .min(2, 'El código es demasiado corto')
    .max(20, 'El código es demasiado largo')
    .toUpperCase(),
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre es demasiado largo'),
  capacity: z.number().int().positive().optional(),
});

export type LocationFormData = z.infer<typeof locationSchema>;
