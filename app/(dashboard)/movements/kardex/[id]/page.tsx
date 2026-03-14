import { KardexReport } from "@/src/features/movements/components/Kardex/KardexReport";
import { PageWrapper } from "@/src/components/layout/PageWrapper";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from './KardexPage.module.css';

export default function ProductKardexPage({ params }: { params: { id: string } }) {
  return (
    <PageWrapper
      title="Kardex de Producto"
      subtitle="Ficha técnica de movimientos y valoración de inventario"
      actions={
        <Link href="/movements" className={styles.backLink}>
          <ArrowLeft size={18} />
          Volver a movimientos
        </Link>
      }
    >
      <KardexReport productId={params.id} />
    </PageWrapper>
  );
}
