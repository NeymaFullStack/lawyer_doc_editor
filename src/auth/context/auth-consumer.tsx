"use client";

import { LoadingSpinner } from "@/components/generic/loading-spinner";

import { AuthContext } from "./auth-context";

type Props = {
  children: React.ReactNode;
};

export function AuthConsumer({ children }: Props) {
  return (
    <AuthContext.Consumer>
      {(value) => {
        if (value.loading) {
          return <LoadingSpinner size={48} />;
        }

        return children;
      }}
    </AuthContext.Consumer>
  );
}
