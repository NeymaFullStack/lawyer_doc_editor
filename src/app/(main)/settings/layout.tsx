"use client";

import SettingsLayout from "@/layouts/settings";
import { SettingsProvider } from "@/sections/settings/context/settings-provider";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <SettingsProvider>
      <SettingsLayout>{children}</SettingsLayout>
    </SettingsProvider>
  );
}
