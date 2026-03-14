import { CategoriesManagement } from "@/src/features/categories/components/CategoryManagement/CategoriesManagement";
import { PageWrapper } from "@/src/components/layout/PageWrapper";

export default function CategoriesPage() {
  return (
    <PageWrapper
      title="Gestión de Categorías"
      subtitle="Organiza tu inventario por tipo de parte automotriz"
    >
      <CategoriesManagement />
    </PageWrapper>
  );
}
