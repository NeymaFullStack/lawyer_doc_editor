"use client";

import { AuthContext } from "./auth-context";

type Props = {
  children: React.ReactNode;
};

export function AuthConsumer({ children }: Props) {
  return (
    <AuthContext.Consumer>
      {(value) => {
        if (value.loading) {
          return null;
        }

        return children;
      }}
    </AuthContext.Consumer>
  );
}
