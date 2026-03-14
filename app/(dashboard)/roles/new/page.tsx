import { RoleForm } from "@/src/features/users/components/RoleForm/RoleForm";
import { PageWrapper } from "@/src/components/layout/PageWrapper";

export default function NewRolePage() {
  return (
    <PageWrapper
      title="Crear Rol"
      subtitle="Define los alcances y permisos de acceso"
    >
      <RoleForm />
    </PageWrapper>
  );
}
