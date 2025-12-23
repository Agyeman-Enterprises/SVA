import { db } from "@/db";
import { auditLog, inspectionReports, users, userMemberships } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function InspectorDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const payload = verifyToken(token || "");

  if (!payload || payload.role !== "inspector") {
    return <div>Unauthorized</div>;
  }

  // Get inspector membership
  const [membership] = await db
    .select()
    .from(userMemberships)
    .where(and(eq(userMemberships.userId, payload.userId), eq(userMemberships.role, "inspector")))
    .limit(1);

  // Get recent audit logs (read-only view)
  const recentAuditLogs = await db
    .select()
    .from(auditLog)
    .orderBy(desc(auditLog.createdAt))
    .limit(20);

  // Get inspection reports
  const reports = await db
    .select()
    .from(inspectionReports)
    .where(eq(inspectionReports.inspectorUserId, payload.userId))
    .orderBy(desc(inspectionReports.createdAt))
    .limit(10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inspector Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Read-only audit view - All access is logged
        </p>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Inspector Notice:</strong> You have read-only access. All your actions are fully audited.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Audit Logs</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {recentAuditLogs.length === 0 ? (
              <p className="text-gray-500">No audit logs</p>
            ) : (
              recentAuditLogs.map((log) => (
                <div key={log.id} className="border-b pb-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{log.action}</span>
                    <span className="text-gray-500">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    {log.entityType} {log.entityId ? `(${log.entityId.substring(0, 8)}...)` : ""}
                  </div>
                  <div className="text-xs text-gray-500">
                    Scope: {log.scope}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Inspection Reports</h2>
          {reports.length === 0 ? (
            <p className="text-gray-500">No inspection reports</p>
          ) : (
            <ul className="space-y-2">
              {reports.map((report) => (
                <li key={report.id} className="border-b pb-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Report #{report.id.substring(0, 8)}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Period: {new Date(report.reportPeriodStart).toLocaleDateString()} - {new Date(report.reportPeriodEnd).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Created: {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
