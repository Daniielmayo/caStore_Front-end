import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no puede exceder los 50 caracteres'),
  description: z.string()
    .max(200, 'La descripción no puede exceder los 200 caracteres')
    .optional(),
  parentId: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export function generateSKUPrefix(name: string): string {
  if (!name) return '';
  const prefix = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 4);
  
  return prefix + (prefix.length < 4 ? '-' : '');
}
