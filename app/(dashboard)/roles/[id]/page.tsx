import { RoleForm } from "@/src/features/users/components/RoleForm/RoleForm";
import { PageWrapper } from "@/src/components/layout/PageWrapper";
import { mockRoles } from "@/src/features/users/mockData";
import { notFound } from "next/navigation";

export default function EditRolePage({ params }: { params: { id: string } }) {
  const role = mockRoles.find(r => r.id === params.id);
  
  if (!role) {
    notFound();
  }

  return (
    <PageWrapper
      title="Editar Rol"
      subtitle={`Gestionando permisos de ${role.name}`}
    >
      <RoleForm initialData={role} isEdit />
    </PageWrapper>
  );
}
