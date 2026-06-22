// src/components/dashboard/DashboardLayout.jsx
"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/shared/DashboardNavbar";
import OwnerSidebar from "@/components/shared/OwnerSidebar";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <DashboardNavbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex pt-16">
        <OwnerSidebar isOpen={isSidebarOpen} />
        <main 
          className={`
            flex-1 transition-all duration-300 min-h-[calc(100vh-4rem)]
            ${isSidebarOpen ? "lg:ml-64" : "lg:ml-20"}
          `}
        >
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}