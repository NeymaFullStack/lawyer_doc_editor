import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-slate-600">
      {children}
    </div>
  );
}
