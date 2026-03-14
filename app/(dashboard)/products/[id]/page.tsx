import { ProductForm } from '@/src/features/products/components/ProductForm/ProductForm';
import { PageWrapper } from '@/src/components/layout/PageWrapper';
import { mockProducts } from '@/src/features/products/mockData';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Simulate fetching data
  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    notFound();
  }

  // Map to form data
  const initialData = {
    id: product.id,
    sku: product.sku,
    name: product.name,
    description: product.description || '',
    price: product.price,
    categoryId: 'cat-1', // Mock mapping
    locationId: product.locationId || '',
    stock: product.stock,
    minStock: product.minStock,
    hasExpiration: product.hasExpiration || false,
    expirationDate: product.expirationDate || '',
    image: product.image
  };

  return (
    <PageWrapper
      title="Editar producto"
      // Subtitle is handled inside the form via skuBanner for editing
    >
      <ProductForm isEdit initialData={initialData} />
    </PageWrapper>
  );
}
