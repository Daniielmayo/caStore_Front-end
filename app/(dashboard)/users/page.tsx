import { UsersList } from "@/src/features/users/components/UsersList/UsersList";
import { PageWrapper } from "@/src/components/layout/PageWrapper";

export default function UsersPage() {
  return (
    <PageWrapper
      title="Gestión de Usuarios"
      subtitle="Administra el acceso y permisos del equipo"
    >
      <UsersList />
    </PageWrapper>
  );
}
