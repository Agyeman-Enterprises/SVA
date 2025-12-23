"use client";

import { useEffect, useState } from "react";

interface Device {
  id: string;
  deviceType: string;
  serialNumber: string;
  hardwareRevision: string | null;
  firmwareVersion: string | null;
  status: string;
  batteryHealthPercent: number | null;
  storageUsedMb: number | null;
  storageTotalMb: number | null;
  lastSeenAt: string | null;
}

/**
 * EPIC 11: Device Admin Dashboard
 * Shows all devices, status, assignments, health
 * Features: Filter by type/status/location, bulk actions
 */
export default function DeviceFleetDashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [healthSummary, setHealthSummary] = useState<any>(null);
  const [filters, setFilters] = useState({
    deviceType: "",
    status: "",
  });

  useEffect(() => {
    fetchDevices();
    fetchHealthSummary();
  }, [filters]);

  async function fetchDevices() {
    try {
      const params = new URLSearchParams();
      if (filters.deviceType) params.append("deviceType", filters.deviceType);
      if (filters.status) params.append("status", filters.status);

      const res = await fetch(`/api/devices/register?${params}`);
      const data = await res.json();
      setDevices(data.devices || []);
    } catch (error) {
      console.error("Failed to fetch devices:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchHealthSummary() {
    try {
      const res = await fetch("/api/devices/health");
      const data = await res.json();
      setHealthSummary(data.healthSummary);
    } catch (error) {
      console.error("Failed to fetch health summary:", error);
    }
  }

  if (loading) {
    return <div className="p-8">Loading device fleet...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">SVA Device Fleet Management</h1>

      {/* Health Summary */}
      {healthSummary && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded">
            <div className="text-sm text-gray-600">Total Devices</div>
            <div className="text-2xl font-bold">{healthSummary.total}</div>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <div className="text-sm text-gray-600">Active</div>
            <div className="text-2xl font-bold">{healthSummary.active}</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded">
            <div className="text-sm text-gray-600">Low Battery</div>
            <div className="text-2xl font-bold">{healthSummary.lowBattery}</div>
          </div>
          <div className="bg-red-50 p-4 rounded">
            <div className="text-sm text-gray-600">Maintenance</div>
            <div className="text-2xl font-bold">{healthSummary.maintenance}</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filters.deviceType}
          onChange={(e) => setFilters({ ...filters, deviceType: e.target.value })}
          className="border rounded px-4 py-2"
        >
          <option value="">All Types</option>
          <option value="phone">Phone</option>
          <option value="laptop">Laptop</option>
          <option value="hub">Hub</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border rounded px-4 py-2"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="lost">Lost</option>
          <option value="retired">Retired</option>
        </select>
      </div>

      {/* Devices Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Battery</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Storage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Seen</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {devices.map((device) => (
              <tr key={device.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{device.serialNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{device.deviceType}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded ${
                    device.status === "active" ? "bg-green-100 text-green-800" :
                    device.status === "maintenance" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {device.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {device.batteryHealthPercent !== null ? (
                    <span className={device.batteryHealthPercent < 20 ? "text-red-600 font-bold" : ""}>
                      {device.batteryHealthPercent}%
                    </span>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {device.storageUsedMb && device.storageTotalMb ? (
                    <span className={(device.storageUsedMb / device.storageTotalMb) * 100 > 90 ? "text-red-600 font-bold" : ""}>
                      {Math.round((device.storageUsedMb / device.storageTotalMb) * 100)}%
                    </span>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {device.lastSeenAt ? new Date(device.lastSeenAt).toLocaleDateString() : "Never"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


