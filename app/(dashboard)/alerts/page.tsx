import { AlertsList } from "@/src/features/alerts/components/AlertsList/AlertsList";
import { PageWrapper } from "@/src/components/layout/PageWrapper";
import { Button } from "@/src/components/ui/Button";
import Link from "next/link";
import { BellPlus } from "lucide-react";

export default function AlertsPage() {
  return (
    <PageWrapper
      title="Alertas de Inventario"
      subtitle="Monitorea el estado crítico de tu inventario"
      actions={
        <Link href="/alerts/config">
          <Button>
            <BellPlus size={16} style={{ marginRight: '8px' }} />
            Configurar alerta
          </Button>
        </Link>
      }
    >
      <AlertsList />
    </PageWrapper>
  );
}
