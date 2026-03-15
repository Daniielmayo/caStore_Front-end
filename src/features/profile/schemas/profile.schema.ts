import { z } from 'zod';

export const profilePersonalSchema = z.object({
  fullName: z
    .string()
    .min(1, 'El nombre completo es requerido')
    .max(150, 'El nombre es demasiado largo'),
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Ingresa un correo electrónico válido'),
});

export type ProfilePersonalFormData = z.infer<typeof profilePersonalSchema>;
