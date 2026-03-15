import type { Category } from './types/categories.types';

export type { Category } from './types/categories.types';

/** Mock plano (sin parentName; se rellena en el hook). */
export type MockCategoryItem = Omit<Category, 'parentName'> & { parentName?: null };

export const mockCategories: MockCategoryItem[] = [
  // Categorías Principales
  {
    id: 'cat-1',
    name: 'Motor',
    description: 'Partes internas y externas del motor de combustión.',
    skuPrefix: 'MOTO',
    productCount: 45,
    icon: 'Engine',
    color: '#F97316', // orange-500
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: 'cat-2',
    name: 'Suspensión',
    description: 'Componentes del sistema de amortiguación y estabilidad.',
    skuPrefix: 'SUSP',
    productCount: 28,
    icon: 'Spring',
    color: '#0EA5E9', // sky-500
    createdAt: '2024-01-12T11:30:00Z',
  },
  {
    id: 'cat-3',
    name: 'Frenos',
    description: 'Sistemas de frenado, discos, pastillas y líquidos.',
    skuPrefix: 'FREN',
    productCount: 32,
    icon: 'Brake',
    color: '#EF4444', // red-500
    createdAt: '2024-01-15T09:15:00Z',
  },
  {
    id: 'cat-4',
    name: 'Eléctrico',
    description: 'Componentes eléctricos, baterías y sensores.',
    skuPrefix: 'ELEC',
    productCount: 54,
    icon: 'Battery',
    color: '#EAB308', // yellow-500
    createdAt: '2024-01-18T14:45:00Z',
  },
  {
    id: 'cat-5',
    name: 'Carrocería',
    description: 'Partes externas, espejos, vidrios y paneles.',
    skuPrefix: 'CARR',
    productCount: 15,
    icon: 'Car',
    color: '#10B981', // emerald-500
    createdAt: '2024-01-20T16:20:00Z',
  },

  // Subcategorías de Motor
  {
    id: 'sub-1-1',
    name: 'Filtros',
    parentId: 'cat-1',
    skuPrefix: 'FILT',
    productCount: 12,
    createdAt: '2024-01-10T12:00:00Z',
  },
  {
    id: 'sub-1-2',
    name: 'Correas',
    parentId: 'cat-1',
    skuPrefix: 'CORR',
    productCount: 8,
    createdAt: '2024-01-10T13:00:00Z',
  },
  {
    id: 'sub-1-3',
    name: 'Bujías',
    parentId: 'cat-1',
    skuPrefix: 'BUJI',
    productCount: 15,
    createdAt: '2024-01-10T14:00:00Z',
  },

  // Subcategorías de Suspensión
  {
    id: 'sub-2-1',
    name: 'Amortiguadores',
    parentId: 'cat-2',
    skuPrefix: 'AMOR',
    productCount: 14,
    createdAt: '2024-01-12T12:00:00Z',
  },
  {
    id: 'sub-2-2',
    name: 'Resortes',
    parentId: 'cat-2',
    skuPrefix: 'RESO',
    productCount: 6,
    createdAt: '2024-01-12T14:00:00Z',
  },
  {
    id: 'sub-2-3',
    name: 'Rótulas',
    parentId: 'cat-2',
    skuPrefix: 'ROTU',
    productCount: 8,
    createdAt: '2024-01-12T16:00:00Z',
  },

  // Subcategorías de Frenos
  {
    id: 'sub-3-1',
    name: 'Pastillas',
    parentId: 'cat-3',
    skuPrefix: 'PAST',
    productCount: 18,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'sub-3-2',
    name: 'Discos',
    parentId: 'cat-3',
    skuPrefix: 'DISC',
    productCount: 10,
    createdAt: '2024-01-15T12:00:00Z',
  },
  {
    id: 'sub-3-3',
    name: 'Líquido de frenos',
    parentId: 'cat-3',
    skuPrefix: 'LIQU',
    productCount: 4,
    createdAt: '2024-01-15T14:00:00Z',
  },

  // Subcategorías de Eléctrico
  {
    id: 'sub-4-1',
    name: 'Baterías',
    parentId: 'cat-4',
    skuPrefix: 'BATE',
    productCount: 20,
    createdAt: '2024-01-18T16:00:00Z',
  },
  {
    id: 'sub-4-2',
    name: 'Alternadores',
    parentId: 'cat-4',
    skuPrefix: 'ALTE',
    productCount: 12,
    createdAt: '2024-01-18T18:00:00Z',
  },
  {
    id: 'sub-4-3',
    name: 'Sensores',
    parentId: 'cat-4',
    skuPrefix: 'SENS',
    productCount: 22,
    createdAt: '2024-01-18T20:00:00Z',
  },

  // Subcategorías de Carrocería
  {
    id: 'sub-5-1',
    name: 'Espejos',
    parentId: 'cat-5',
    skuPrefix: 'ESPE',
    productCount: 5,
    createdAt: '2024-01-20T18:00:00Z',
  },
  {
    id: 'sub-5-2',
    name: 'Parabrisas',
    parentId: 'cat-5',
    skuPrefix: 'PARA',
    productCount: 4,
    createdAt: '2024-01-20T20:00:00Z',
  },
  {
    id: 'sub-5-3',
    name: 'Paragolpes',
    parentId: 'cat-5',
    skuPrefix: 'PARG',
    productCount: 6,
    createdAt: '2024-01-20T22:00:00Z',
  },
];
