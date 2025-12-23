"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
  name: string;
  href: string;
  icon: string;
  roles?: string[];
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/student", icon: "📊", roles: ["student"] },
  { name: "My Courses", href: "/student/courses", icon: "📚", roles: ["student"] },
  { name: "Engineering", href: "/student/engineering", icon: "🔧", roles: ["student"] },
  { name: "Dashboard", href: "/teacher", icon: "📊", roles: ["teacher", "pod_lead"] },
  { name: "My Pod", href: "/teacher/pod", icon: "👥", roles: ["teacher", "pod_lead"] },
  { name: "Submissions", href: "/teacher/submissions", icon: "📝", roles: ["teacher", "pod_lead"] },
  { name: "Dashboard", href: "/admin", icon: "📊", roles: ["school_admin", "district_admin"] },
  { name: "Device Fleet", href: "/admin/devices", icon: "📱", roles: ["school_admin", "district_admin"] },
  { name: "Users", href: "/admin/users", icon: "👤", roles: ["school_admin", "district_admin"] },
  { name: "Courses", href: "/admin/courses", icon: "📖", roles: ["school_admin", "district_admin"] },
  { name: "Dashboard", href: "/inspector", icon: "📊", roles: ["inspector"] },
  { name: "Audit Logs", href: "/inspector/audit", icon: "📋", roles: ["inspector"] },
];

export default function Navigation({ userRole, userEmail }: { userRole: string; userEmail: string }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredNav = navigation.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  const isActive = (href: string) => {
    if (href === "/student" || href === "/teacher" || href === "/admin" || href === "/inspector") {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-lg"
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="h-full flex flex-col">
          {/* Logo/Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">SVA LMS</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Scientia Vitae Academy
            </p>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  {userEmail.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {userEmail}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {userRole.replace("_", " ")}
                </p>
              </div>
            </div>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

