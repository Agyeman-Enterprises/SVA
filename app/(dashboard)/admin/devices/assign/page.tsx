"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Device {
  id: string;
  deviceType: string;
  serialNumber: string;
  status: string;
  assignedStudentId: string | null;
  assignedTeacherId: string | null;
}

interface User {
  id: string;
  displayName: string;
  email: string;
  role: string;
}

export default function DeviceAssignmentPage() {
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [assignTo, setAssignTo] = useState<string>("");
  const [assignType, setAssignType] = useState<"student" | "teacher">("student");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [devicesRes, usersRes] = await Promise.all([
        fetch("/api/devices/register"),
        fetch("/api/users"), // Would need to create this endpoint
      ]);

      const devicesData = await devicesRes.json();
      setDevices(devicesData.devices || []);

      // For now, mock users - in production, fetch from API
      setUsers([
        { id: "1", displayName: "John Student", email: "student@sva.edu", role: "student" },
        { id: "2", displayName: "Jane Teacher", email: "teacher@sva.edu", role: "teacher" },
      ]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAssign() {
    if (!selectedDevice || !assignTo) {
      setError("Please select both a device and a user");
      return;
    }

    setError("");
    setSuccess("");
    setAssigning(true);

    try {
      const res = await fetch("/api/devices/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: selectedDevice,
          assignedStudentId: assignType === "student" ? assignTo : null,
          assignedTeacherId: assignType === "teacher" ? assignTo : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to assign device");
      }

      setSuccess("Device assigned successfully!");
      setSelectedDevice("");
      setAssignTo("");
      setTimeout(() => {
        fetchData();
        setSuccess("");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAssigning(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const availableDevices = devices.filter((d) => d.status === "active" && !d.assignedStudentId && !d.assignedTeacherId);
  const assignedDevices = devices.filter((d) => d.assignedStudentId || d.assignedTeacherId);
  const filteredUsers = users.filter((u) => u.role === assignType);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/devices"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
        >
          ← Back to Device Fleet
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Assign Device
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Assign devices to students or teachers
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <p className="text-green-800 dark:text-green-200">{success}</p>
        </div>
      )}

      {/* Assignment Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          New Assignment
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assign To
            </label>
            <select
              value={assignType}
              onChange={(e) => {
                setAssignType(e.target.value as "student" | "teacher");
                setAssignTo("");
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Device
            </label>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select device...</option>
              {availableDevices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.serialNumber} ({device.deviceType})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {assignType === "student" ? "Student" : "Teacher"}
            </label>
            <select
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select {assignType}...</option>
              {filteredUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.displayName} ({user.email})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleAssign}
            disabled={assigning || !selectedDevice || !assignTo}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {assigning ? "Assigning..." : "Assign Device"}
          </button>
        </div>
      </div>

      {/* Assigned Devices */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Currently Assigned ({assignedDevices.length})
        </h2>
        {assignedDevices.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No devices currently assigned</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Serial
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {assignedDevices.map((device) => (
                  <tr key={device.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {device.serialNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {device.deviceType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {device.assignedStudentId ? "Student" : device.assignedTeacherId ? "Teacher" : "Unassigned"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          // Unassign logic
                        }}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        Unassign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

