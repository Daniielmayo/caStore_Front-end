import { RegisterMovementForm } from "@/src/features/movements/components/RegisterMovement/RegisterMovementForm";
import { PageWrapper } from "@/src/components/layout/PageWrapper";

export default function NewMovementPage() {
  return (
    <PageWrapper
      title="Registrar movimiento"
      subtitle="Define el tipo e identifica el producto para el registro"
    >
      <RegisterMovementForm />
    </PageWrapper>
  );
}
