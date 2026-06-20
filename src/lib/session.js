import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}

export async function requireSession() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return session;
}

export async function requireRole(role) {
  const session = await requireSession();
  const userRole = session?.user?.role?.toLowerCase();
  const requiredRole = role.toLowerCase();

  if (userRole !== requiredRole) {
    redirect("/");
  }
}
