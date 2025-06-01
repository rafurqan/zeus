import { ReactNode } from "react";
import Sidebar from "./sidebar";
import Header from "./header";

type LayoutProps = {
  children: ReactNode;
};

const BaseLayout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 h-full bg-white border-r fixed z-10">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <div className="sticky top-0 z-20">
          <Header />
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default BaseLayout;
