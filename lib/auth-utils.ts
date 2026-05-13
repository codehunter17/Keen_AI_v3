import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Custom function to protect routes.
 * Call this in any Server Component (like layouts or pages) 
 * to ensure the user is authenticated.
 */
export async function checkAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  return session;
}

/**
 * Function to redirect authenticated users away from auth pages (Login/Signup)
 */
export async function redirectIfAuthenticated() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }
}
