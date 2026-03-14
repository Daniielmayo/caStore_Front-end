import { SupplierProfile } from "@/src/features/suppliers/components/SupplierProfile/SupplierProfile";
import { PageWrapper } from "@/src/components/layout/PageWrapper";
import { mockSuppliers } from "@/src/features/suppliers/mockData";
import { notFound } from "next/navigation";

export default function SupplierProfilePage({ params }: { params: { id: string } }) {
  const supplier = mockSuppliers.find(s => s.id === params.id);
  
  if (!supplier) {
    notFound();
  }

  return (
    <PageWrapper
      title="Perfil del Proveedor"
      subtitle="Información detallada y resumen comercial"
    >
      <SupplierProfile supplier={supplier} />
    </PageWrapper>
  );
}
