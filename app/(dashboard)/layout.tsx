import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import SVANavigation from "@/app/components/SVANavigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = verifyToken(token);
  if (!payload) {
    redirect("/login");
  }

  // Get user for display name
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, payload.userId))
    .limit(1);

  return (
    <div className="min-h-screen bg-[var(--sva-cream)] flex">
      <SVANavigation
        userRole={payload.role}
        userEmail={payload.email}
        userName={user?.displayName}
      />
          <main className="sva-main">
            {children}
          </main>
    </div>
  );
}

