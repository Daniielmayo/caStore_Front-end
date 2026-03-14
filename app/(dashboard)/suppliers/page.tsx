import { SuppliersList } from "@/src/features/suppliers/components/SuppliersList/SuppliersList";
import { PageWrapper } from "@/src/components/layout/PageWrapper";

export default function SuppliersPage() {
  return (
    <PageWrapper
      title="Gestión de Proveedores"
      subtitle="Administra tus proveedores y relaciones comerciales"
    >
      <SuppliersList />
    </PageWrapper>
  );
}
