import { ReactNode } from "react";
import { checkAuth } from "@/lib/auth-utils";

export default async function OnboardingLayout({ children }: { children: ReactNode }) {
  await checkAuth();
  return <>{children}</>;
}
