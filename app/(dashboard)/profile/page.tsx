import { ProfilePage } from "@/src/features/profile/components/ProfilePage/ProfilePage";
import { PageWrapper } from "@/src/components/layout/PageWrapper";

export default function Profile() {
  return (
    <PageWrapper
      title="Mi perfil"
      subtitle="Gestiona tu información personal y seguridad"
    >
      <ProfilePage />
    </PageWrapper>
  );
}
