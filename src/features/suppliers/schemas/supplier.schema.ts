import { z } from 'zod';

/**
 * Utility to calculate NIT Verification Digit (Colombia)
 */
export const calculateNITVerificationDigit = (nit: string): number => {
  const nitStr = nit.trim().replace(/\D/g, '');
  if (!nitStr || nitStr.length === 0) return 0;

  const weights = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
  let sum = 0;

  for (let i = 0; i < nitStr.length; i++) {
    const digit = parseInt(nitStr.charAt(nitStr.length - 1 - i), 10);
    sum += digit * weights[i];
  }

  const remainder = sum % 11;
  if (remainder < 2) return remainder;
  return 11 - remainder;
};

export const supplierStep1Schema = z.object({
  businessName: z.string().min(1, 'La razón social es requerida').max(100),
  commercialName: z.string().min(1, 'El nombre comercial es requerido').max(100),
  nit: z.string().min(5, 'El NIT debe tener al menos 5 dígitos').max(15, 'NIT demasiado largo'),
  type: z.enum(['Nacional', 'Internacional', 'Fabricante', 'Distribuidor'], {
    message: 'Debe seleccionar un tipo de proveedor',
  }),
  taxpayerType: z.enum(['Persona Natural', 'Persona Jurídica', 'Gran Contribuyente', 'Régimen Simplificado'], {
    message: 'Debe seleccionar un tipo de contribuyente',
  }),
  country: z.string().min(1, 'El país es requerido'),
  department: z.string().min(1, 'El departamento es requerido'),
  city: z.string().min(1, 'La ciudad es requerida'),
  address: z.string().min(1, 'La dirección es requerida'),
  phone: z.string().min(7, 'Teléfono inválido'),
  email: z.string().email('Correo electrónico inválido'),
  contactPerson: z.string().min(1, 'El nombre de contacto es requerido'),
});

export const supplierStep2Schema = z.object({
  paymentTerms: z.enum(['Contado', '30 días', '60 días', '90 días'], {
    message: 'Debe seleccionar condiciones de pago',
  }),
  currency: z.enum(['COP', 'USD', 'EUR'], {
    message: 'Debe seleccionar la moneda',
  }),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  observations: z.string().max(500, 'Máximo 500 caracteres').optional(),
});

export const supplierSchema = supplierStep1Schema.merge(supplierStep2Schema);

export type SupplierFormData = z.infer<typeof supplierSchema>;
