import { SupplierWizard } from "@/src/features/suppliers/components/SupplierForm/SupplierWizard";
import { PageWrapper } from "@/src/components/layout/PageWrapper";

export default function NewSupplierPage() {
  return (
    <PageWrapper
      title="Crear Proveedor"
      subtitle="Registra un nuevo proveedor en el sistema paso a paso"
    >
      <SupplierWizard />
    </PageWrapper>
  );
}
