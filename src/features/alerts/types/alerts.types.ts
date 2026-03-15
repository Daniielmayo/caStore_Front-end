export interface Alert {
  id: string;
  type: 'LOW_STOCK' | 'EXPIRY_30D' | 'EXPIRY_15D' | 'EXPIRY_7D' | 'OUT_OF_STOCK';
  status: 'ACTIVE' | 'RESOLVED' | 'DISMISSED';
  currentValue: number;
  threshold: number;
  productName: string;
  productSku: string;
  productId: string;
  createdAt: string;
}

export interface AlertStats {
  total: number;
  active: number;
  lowStock: number;
  expiring: number;
}
