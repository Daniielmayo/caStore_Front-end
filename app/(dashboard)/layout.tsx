import { DashboardLayout } from "@/src/features/dashboard/components/DashboardLayout/DashboardLayout";
import { ToastProvider } from "@/src/components/ui/Toast";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </ToastProvider>
  );
}
