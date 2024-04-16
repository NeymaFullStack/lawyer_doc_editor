import { dashboardRoute } from "@/constants/routes";
import { redirect } from "next/navigation";

export default async function Home() {
  redirect(dashboardRoute);
}
