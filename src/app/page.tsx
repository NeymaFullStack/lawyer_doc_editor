import { redirect } from "next/navigation";

import { PATH_AFTER_LOGIN } from "@/config-global";

export default async function HomePage() {
  redirect(PATH_AFTER_LOGIN);
}
