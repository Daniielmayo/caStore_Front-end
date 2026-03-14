import { DashboardLayout } from "@/src/features/dashboard/components/DashboardLayout/DashboardLayout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
