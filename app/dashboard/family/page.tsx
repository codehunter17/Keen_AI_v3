import { redirect } from "next/navigation";
// Family management was removed in v3. Each user manages their own profile.
export default function FamilyPage() {
  redirect("/dashboard");
}
