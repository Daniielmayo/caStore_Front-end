import { SupplierWizard } from "@/src/features/suppliers/components/SupplierForm/SupplierWizard";
import { PageWrapper } from "@/src/components/layout/PageWrapper";
import { mockSuppliers } from "@/src/features/suppliers/mockData";
import { notFound } from "next/navigation";

export default function EditSupplierPage({ params }: { params: { id: string } }) {
  const supplier = mockSuppliers.find(s => s.id === params.id);
  
  if (!supplier) {
    notFound();
  }

  return (
    <PageWrapper
      title="Editar Proveedor"
      subtitle={`Actualizando información de ${supplier.commercialName}`}
    >
      <SupplierWizard initialData={supplier} isEdit />
    </PageWrapper>
  );
}
