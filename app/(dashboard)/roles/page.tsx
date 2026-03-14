import { RolesList } from "@/src/features/users/components/RolesList/RolesList";
import { PageWrapper } from "@/src/components/layout/PageWrapper";

export default function RolesPage() {
  return (
    <PageWrapper
      title="Gestión de Roles"
      subtitle="Define niveles de acceso para tu equipo"
    >
      <RolesList />
    </PageWrapper>
  );
}
