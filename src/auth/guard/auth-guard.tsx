import { paths } from "@/routes/path";
import { useAuthContext } from "../hooks";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const loginPath = paths.login;

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const { loading } = useAuthContext();

  return <>{loading ? <></> : <Container>{children}</Container>}</>;
}

function Container({ children }: Props) {
  const router = useRouter();

  const { authenticated, method } = useAuthContext();

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!authenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();
      const href = `${loginPath}?${searchParams}`;

      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [authenticated, method, router]);

  useEffect(() => {
    check();
  }, []);

  return checked ? <>{children}</> : null;
}
