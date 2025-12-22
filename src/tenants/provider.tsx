"use client";

import { createContext, useContext, useMemo } from "react";
import { TENANTS, type TenantId } from "./config";

type TenantConfig = (typeof TENANTS)[TenantId];

const TenantContext = createContext<{ id: TenantId; config: TenantConfig } | null>(null);

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant must be used within TenantProvider");
  return ctx;
}

export function TenantProvider({ tenant, children }: { tenant: TenantId; children: React.ReactNode }) {
  const value = useMemo(() => ({ id: tenant, config: TENANTS[tenant] }), [tenant]);
  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}
