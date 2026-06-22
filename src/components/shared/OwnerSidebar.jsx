// src/components/dashboard/OwnerSidebar.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  CalendarCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

// ==================== OWNER SIDEBAR ====================
export default function OwnerSidebar({ isOpen = true }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard/owner",
      icon: LayoutDashboard,
    },
    {
      name: "Add Property",
      href: "/dashboard/owner/add-property",
      icon: PlusCircle,
    },
    {
      name: "My Properties",
      href: "/dashboard/owner/properties",
      icon: Building2,
    },
    {
      name: "Booking Requests",
      href: "/dashboard/owner/bookings",
      icon: CalendarCheck,
    },
    {
      name: "Settings",
      href: "/dashboard/owner/settings",
      icon: Settings,
    },
  ];

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut();
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const NavItem = ({ item }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
      <Link
        href={item.href}
        onClick={() => setIsMobileOpen(false)}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
          ${isActive 
            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)]" 
            : "text-gray-600 hover:text-blue-700 hover:bg-blue-50/80"
          }
          ${isCollapsed ? "justify-center px-3" : ""}
        `}
      >
        <Icon className={`${isCollapsed ? "w-5 h-5" : "w-4.5 h-4.5"} flex-shrink-0`} strokeWidth={2.2} />
        {!isCollapsed && (
          <span className={`text-sm font-medium ${isActive ? "text-white" : ""}`}>
            {item.name}
          </span>
        )}
        {isActive && !isCollapsed && (
          <motion.span
            layoutId="sidebar-active-indicator"
            className="ml-auto w-1.5 h-6 bg-white rounded-full shadow-sm"
          />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-white rounded-xl shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <Menu className="w-5 h-5 text-gray-600" strokeWidth={2.2} />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`
          fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] bg-white/95 backdrop-blur-xl border-r border-gray-200/60
          transition-all duration-300 flex flex-col overflow-hidden
          ${isCollapsed ? "w-20" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        animate={{
          width: isCollapsed ? 80 : 256,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Close Mobile Button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute top-3 right-3 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-gray-600" strokeWidth={2.2} />
        </button>

        {/* User Profile */}
        <div className={`
          flex items-center gap-3 p-4 border-b border-gray-100/60 flex-shrink-0
          ${isCollapsed ? "justify-center" : ""}
        `}>
          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            {user?.image ? (
              <Image src={user.image} alt="avatar" fill className="object-cover" />
            ) : (
              getUserInitials(user?.name)
            )}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
              <span className="inline-block mt-0.5 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-semibold rounded-full">
                Owner
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        {/* Bottom Section */}
        <div className={`
          border-t border-gray-100/60 p-3 space-y-2 flex-shrink-0
          ${isCollapsed ? "flex flex-col items-center" : ""}
        `}>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full
              text-red-600 hover:bg-red-50 cursor-pointer
              ${isCollapsed ? "justify-center px-3" : ""}
            `}
          >
            <LogOut className={`${isCollapsed ? "w-5 h-5" : "w-4.5 h-4.5"} flex-shrink-0`} strokeWidth={2.2} />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>

          {/* Collapse Toggle - Desktop Only */}
          <button
            onClick={toggleCollapse}
            className={`
              hidden lg:flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full
              text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer
              ${isCollapsed ? "justify-center px-3" : ""}
            `}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4.5 h-4.5" strokeWidth={2.2} />
            ) : (
              <>
                <ChevronLeft className="w-4.5 h-4.5" strokeWidth={2.2} />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      </motion.aside>
    </>
  );
}