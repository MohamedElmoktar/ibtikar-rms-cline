import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "../../lib/hooks/useTranslation";
import LanguageSelector from "../ui/LanguageSelector";

interface HeaderProps {
  onSidebarToggle?: () => void;
}

export default function Header({ onSidebarToggle }: HeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/signin" });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile sidebar toggle */}
            {onSidebarToggle && (
              <button
                onClick={onSidebarToggle}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Toggle sidebar"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            )}

            {/* Logo/Brand */}
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Ibtikar RMS
              </h1>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <UserIcon className="h-6 w-6" />
              )}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <LanguageSelector />

              {session && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <UserIcon className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700 max-w-32 truncate">
                      {session.user?.name || session.user?.email}
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            router.push("/settings");
                            setDropdownOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Cog6ToothIcon className="h-4 w-4 mr-2" />
                          {t("navigation.settings")}
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                          {t("navigation.logout")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {/* Language Selector for Mobile */}
              <div className="px-2">
                <LanguageSelector />
              </div>

              {/* User Menu for Mobile */}
              {session && (
                <div className="px-2 space-y-2">
                  <div className="flex items-center space-x-2 px-2 py-2 text-sm text-gray-700">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium truncate">
                      {session.user?.name || session.user?.email}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      router.push("/settings");
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Cog6ToothIcon className="h-4 w-4 mr-2" />
                    {t("navigation.settings")}
                  </button>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                    {t("navigation.logout")}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
