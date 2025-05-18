import { ReactNode } from "react"
import Sidebar from "./sidebar"
import Header from "./header"

type LayoutProps = {
  children: ReactNode
}

const BaseLayout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-white border-r">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-h-screen">
        {/* Header */}
        <div className="shrink-0">
          <Header />
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </main>
      </div>
    </div>
  )
}

export default BaseLayout
