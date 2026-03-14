import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(150, 'Máximo 150 caracteres'),
  description: z.string().optional(),
  price: z.coerce.number().positive('El precio debe ser mayor a cero'),
  categoryId: z.string().min(1, 'Selecciona una categoría'),
  locationId: z.string().optional(),
  stock: z.coerce.number().min(0, 'No puede ser negativo'),
  minStock: z.coerce.number().min(0, 'No puede ser negativo'),
  hasExpiration: z.boolean().default(false),
  expirationDate: z.string().optional(),
  image: z.string().nullable().optional()
}).refine(data => {
  if (data.hasExpiration && !data.expirationDate) {
    return false;
  }
  return true;
}, {
  message: 'La fecha de vencimiento es requerida',
  path: ['expirationDate']
});

export type ProductFormData = z.infer<typeof productSchema>;
