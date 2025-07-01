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
    <aside className="w-64 bg-gray-50 border-r border-gray-200 h-screen overflow-y-auto transition-all duration-300 ease-in-out relative">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <h2 className="font-semibold text-gray-800 text-lg">Dashboard</h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1 flex flex-col">
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
                    "flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-all duration-200 group/item relative",
                    "hover:bg-gray-100 hover:shadow-sm hover:scale-[1.02]",
                    isMenuActive && "bg-gray-200 border border-gray-300 shadow-sm font-medium text-gray-900"
                  )}
                  onClick={() => toggleMenu(menu.name)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      isMenuActive
                        ? "bg-gray-800 text-white shadow-sm"
                        : "text-gray-600 group-hover/item:text-gray-800 group-hover/item:bg-gray-200"
                    )}>
                      <menu.icon size={16} />
                    </div>
                    <span className="text-sm font-medium">{menu.name}</span>
                  </div>
                  <div className={cn(
                    "transition-transform duration-200 text-gray-400",
                    isMenuOpen && "rotate-90"
                  )}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </div>
                </button>
              ) : (
                <Link
                  to={menu.path ?? "#"}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 group/item relative",
                    "hover:bg-gray-100 hover:shadow-sm hover:scale-[1.02]",
                    isMenuActive && "bg-gray-200 border border-gray-300 shadow-sm font-medium text-gray-900"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    isMenuActive
                      ? "bg-gray-800 text-white shadow-sm"
                      : "text-gray-600 group-hover/item:text-gray-800 group-hover/item:bg-gray-200"
                  )}>
                    <menu.icon size={16} />
                  </div>
                  <span className="text-sm font-medium">{menu.name}</span>
                </Link>
              )}

              {/* Submenu */}
              {hasChildren && (
                <div
                  className={cn(
                    "transition-all duration-300 ease-out overflow-hidden",
                    isMenuOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="ml-8 flex flex-col space-y-1 relative">
                    {/* Connecting line */}
                    <div className="absolute left-[-12px] top-2 bottom-2 w-px bg-gray-200"></div>

                    {menu.children.map((child,) => (
                      <Link
                        key={child.name}
                        to={child.path}
                        className={cn(
                          "text-sm px-3 py-2.5 rounded-lg transition-all duration-200 relative group/child",
                          "hover:bg-gray-100 hover:shadow-sm hover:translate-x-1 mr-1.5",
                          isActive(child.path) && "bg-gray-200 border border-gray-300 font-medium text-gray-900 shadow-sm"
                        )}
                      >
                        {/* Connection dot */}
                        <div className={cn(
                          "absolute left-[-18px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-colors",
                          isActive(child.path)
                            ? "bg-gray-800"
                            : "bg-gray-300 group-hover/child:bg-gray-400"
                        )}></div>

                        <span>{child.name}</span>

                        {/* Hover indicator */}
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/child:opacity-100 transition-opacity">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
            <span>System Active</span>
          </div>
          <div>v0.0.1</div>
        </div>
      </div>

      {/* Collapsed tooltip overlay */}
    </aside>
  );
};

export default Sidebar;