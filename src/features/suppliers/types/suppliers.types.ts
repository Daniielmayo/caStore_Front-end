export interface Supplier {
  id: string;
  tradeName: string;
  nit: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  type: 'MANUFACTURER' | 'DISTRIBUTOR' | 'RETAILER' | 'IMPORTER';
  status: 'ACTIVE' | 'INACTIVE';
  totalValue?: number;
}
