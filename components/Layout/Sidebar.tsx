import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  HomeIcon,
  DocumentTextIcon,
  UsersIcon,
  BuildingOfficeIcon,
  CpuChipIcon,
  GlobeAltIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../../lib/utils";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  isOpen,
  setIsOpen,
}: SidebarProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const navigation = [
    {
      name: "Tableau de bord",
      href: "/dashboard",
      icon: HomeIcon,
      current: router.pathname === "/dashboard",
    },
    {
      name: "Références",
      href: "/references",
      icon: DocumentTextIcon,
      current: router.pathname.startsWith("/references"),
    },
    {
      name: "Clients",
      href: "/clients",
      icon: UsersIcon,
      current: router.pathname.startsWith("/clients"),
    },
    {
      name: "Entreprises",
      href: "/companies",
      icon: BuildingOfficeIcon,
      current: router.pathname.startsWith("/companies"),
    },
    {
      name: "Technologies",
      href: "/technologies",
      icon: CpuChipIcon,
      current: router.pathname.startsWith("/technologies"),
    },
    {
      name: "Pays",
      href: "/countries",
      icon: GlobeAltIcon,
      current: router.pathname.startsWith("/countries"),
    },
  ];

  const secondaryNavigation = [
    {
      name: "Paramètres",
      href: "/settings",
      icon: Cog6ToothIcon,
      current: router.pathname.startsWith("/settings"),
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">IB</span>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-gray-900">IBTIKAR</h1>
              <p className="text-xs text-gray-500">RMS</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-1">
          {/* Close button (mobile) */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>

          {/* Collapse button (desktop) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-5 w-5" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {/* Main Navigation */}
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  item.current
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <item.icon
                  className={cn(
                    "flex-shrink-0 h-5 w-5",
                    item.current
                      ? "text-blue-600"
                      : "text-gray-400 group-hover:text-gray-500",
                    !isCollapsed && "mr-3"
                  )}
                />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
                {isCollapsed && <span className="sr-only">{item.name}</span>}
              </Link>
            ))}
          </div>

          {/* Divider */}
          {!isCollapsed && (
            <div className="border-t border-gray-200 my-4"></div>
          )}

          {/* Secondary Navigation */}
          <div className="space-y-1">
            {secondaryNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  item.current
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <item.icon
                  className={cn(
                    "flex-shrink-0 h-5 w-5",
                    item.current
                      ? "text-blue-600"
                      : "text-gray-400 group-hover:text-gray-500",
                    !isCollapsed && "mr-3"
                  )}
                />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
                {isCollapsed && <span className="sr-only">{item.name}</span>}
              </Link>
            ))}
          </div>
        </nav>

        {/* User Profile */}
        {!isCollapsed && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session?.user?.name || "Utilisateur"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session?.user?.role || "Admin"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed user profile */}
        {isCollapsed && (
          <div className="border-t border-gray-200 p-2">
            <div className="flex justify-center">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
