import { headers } from "next/headers";

export default async function Home() {
  const h = await headers();
  const t = h.get("x-tenant") ?? "default";
  const isTenantId = (v: string): v is import("../tenants/config").TenantId =>
    v === "default" || v === "tls" || v === "spm" || v === "sva";
  const tenant = isTenantId(t) ? t : "default";
  return (
    <main style={{ padding: 24 }}>
      <h1>agyeman-lms</h1>
      <p>Tenant: {tenant}</p>
    </main>
  );
}
