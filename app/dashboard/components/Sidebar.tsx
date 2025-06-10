"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/lib/auth/role-provider";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  FileText,
  Settings,
  UserCircle,
  Calendar,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { role, loading } = useRole();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/dashboard/products", icon: Package },
    { name: "Customers", href: "/dashboard/customers", icon: Users },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
    { name: "Employees", href: "/dashboard/employees", icon: UserCircle, roles: ["Admin", "Manager"] },
    { name: "Attendance", href: "/dashboard/attendance", icon: Calendar, roles: ["Admin", "Manager"] },
    { name: "Activity Logs", href: "/dashboard/activity", icon: FileText },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
    { name: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["Admin"] },
  ];

  const filteredNavigation = navigation.filter((item) => {
    if (!item.roles) return true;
    return role && item.roles.includes(role);
  });

  if (loading) {
    return <div className="w-64 bg-gray-900" />;
  }

  return (
    <div className="w-64 bg-gray-900">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <h1 className="text-white text-xl font-bold">Retail ERP</h1>
      </div>
      <nav className="mt-5 px-2">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md mt-1
                ${isActive ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}
              `}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}