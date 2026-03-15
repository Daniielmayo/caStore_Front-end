export interface Movement {
  id: string;
  type: 'PURCHASE_ENTRY' | 'SALE_EXIT' | 'TRANSFER' | 'POSITIVE_ADJUSTMENT' | 'NEGATIVE_ADJUSTMENT' | 'RETURN';
  quantity: number;
  productId: string;
  productName: string;
  userFullName: string;
  createdAt: string;
}
