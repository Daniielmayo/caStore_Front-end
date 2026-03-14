import { UserForm } from "@/src/features/users/components/UserForm/UserForm";
import { PageWrapper } from "@/src/components/layout/PageWrapper";

export default function NewUserPage() {
  return (
    <PageWrapper
      title="Crear Usuario"
      subtitle="Define los accesos para un nuevo miembro del equipo"
    >
      <UserForm />
    </PageWrapper>
  );
}
