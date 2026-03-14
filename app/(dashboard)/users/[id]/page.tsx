import { UserForm } from "@/src/features/users/components/UserForm/UserForm";
import { PageWrapper } from "@/src/components/layout/PageWrapper";
import { mockUsers } from "@/src/features/users/mockData";
import { notFound } from "next/navigation";

export default function EditUserPage({ params }: { params: { id: string } }) {
  const user = mockUsers.find(u => u.id === params.id);
  
  if (!user) {
    notFound();
  }

  return (
    <PageWrapper
      title="Editar Usuario"
      subtitle={`Gestionando permisos de ${user.name}`}
    >
      <UserForm initialData={user} isEdit />
    </PageWrapper>
  );
}
