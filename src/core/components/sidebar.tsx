import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { menus } from "@/core/types/menus";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (name: string) => {
    setOpenMenus(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <aside className="w-64 bg-white shadow-md h-screen overflow-y-auto">
      <nav className="space-y-1 flex flex-col">
        {menus.map(menu => {
          const hasChildren = !!menu.children?.length;
          const isChildActive = menu.children?.some(child => isActive(child.path));
          const isMenuOpen = openMenus.includes(menu.name) || isChildActive;
          const isMenuActive = isActive(menu.path ?? "") || isChildActive;

          return (
            <div key={menu.name} className="w-full">
              {hasChildren ? (
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded px-3 py-2 text-left hover:bg-gray-100 transition-colors",
                    isMenuActive && "bg-gray-100 font-semibold"
                  )}
                  onClick={() => toggleMenu(menu.name)}
                >
                  <div className="flex items-center gap-2">
                    <menu.icon size={18} />
                    <span>{menu.name}</span>
                  </div>
                  <span className="text-xs">{isMenuOpen ? "▾" : "▸"}</span>
                </button>
              ) : (
                <Link
                  to={menu.path ?? "#"}
                  className={cn(
                    "flex w-full items-center gap-2 rounded px-3 py-2 hover:bg-gray-100 transition-colors",
                    isMenuActive && "bg-gray-100 font-semibold"
                  )}
                >
                  <menu.icon size={18} />
                  <span>{menu.name}</span>
                </Link>
              )}

              {/* Submenu */}
              {hasChildren && (
                <div
                  className={cn(
                    "transition-all duration-300 ease-in-out overflow-hidden",
                    isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="ml-6 flex flex-col space-y-1 py-1">
                    {menu.children.map(child => (
                      <Link
                        key={child.name}
                        to={child.path}
                        className={cn(
                          "text-sm px-2 py-1 rounded hover:bg-gray-100 transition-colors",
                          isActive(child.path) && "bg-gray-200 font-medium"
                        )}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
