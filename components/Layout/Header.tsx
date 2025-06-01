import { useState, Fragment } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  ChevronDownIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../../lib/utils";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Left side */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Search */}
            <div className="hidden sm:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher des références..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Mobile search button */}
            <button className="sm:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors relative">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2 p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {session?.user?.name || "Utilisateur"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {session?.user?.role || "Admin"}
                  </p>
                </div>
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200">
                  <div className="py-1">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {session?.user?.name || "Utilisateur"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {session?.user?.email || "email@example.com"}
                      </p>
                    </div>

                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={cn(
                            "flex items-center gap-3 px-4 py-2 text-sm transition-colors",
                            active
                              ? "bg-gray-50 text-gray-900"
                              : "text-gray-700"
                          )}
                        >
                          <UserCircleIcon className="h-5 w-5" />
                          Mon profil
                        </a>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={cn(
                            "flex items-center gap-3 px-4 py-2 text-sm transition-colors",
                            active
                              ? "bg-gray-50 text-gray-900"
                              : "text-gray-700"
                          )}
                        >
                          <Cog6ToothIcon className="h-5 w-5" />
                          Paramètres
                        </a>
                      )}
                    </Menu.Item>

                    <hr className="my-1 border-gray-100" />

                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleSignOut}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2 text-sm w-full text-left transition-colors",
                            active
                              ? "bg-gray-50 text-gray-900"
                              : "text-gray-700"
                          )}
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5" />
                          Se déconnecter
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
