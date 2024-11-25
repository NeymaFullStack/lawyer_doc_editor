"use client";

import AuthGuard from "@/auth/guard/auth-guard";
import DashboardLayout from "@/layouts/main";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
