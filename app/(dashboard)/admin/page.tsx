import { db } from "@/db";
import { districts, schools, campuses, pods, users, userMemberships, courses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const payload = verifyToken(token || "");

  if (!payload || (payload.role !== "school_admin" && payload.role !== "district_admin")) {
    return <div>Unauthorized</div>;
  }

  // Get statistics
  const districtCount = await db.select().from(districts);
  const schoolCount = await db.select().from(schools);
  const campusCount = await db.select().from(campuses);
  const podCount = await db.select().from(pods);
  const courseCount = await db.select().from(courses);
  const userCount = await db.select().from(users);
  const membershipCount = await db.select().from(userMemberships);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {payload.role === "district_admin" ? "District" : "School"} Administration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Districts</h3>
          <p className="text-3xl font-bold">{districtCount.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Schools</h3>
          <p className="text-3xl font-bold">{schoolCount.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Campuses</h3>
          <p className="text-3xl font-bold">{campusCount.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Pods</h3>
          <p className="text-3xl font-bold">{podCount.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Courses</h3>
          <p className="text-3xl font-bold">{courseCount.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Users</h3>
          <p className="text-3xl font-bold">{userCount.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Memberships</h3>
          <p className="text-3xl font-bold">{membershipCount.length}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="space-y-2">
          <p className="text-gray-500">Management interfaces coming soon</p>
        </div>
      </div>
    </div>
  );
}
