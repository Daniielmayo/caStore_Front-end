import { MovementsList } from "@/src/features/movements/components/MovementsList/MovementsList";
import { PageWrapper } from "@/src/components/layout/PageWrapper";

export default function MovementsPage() {
  return (
    <PageWrapper
      title="Movimientos de Inventario"
      subtitle="Trazabilidad completa de entradas y salidas"
    >
      <MovementsList />
    </PageWrapper>
  );
}
