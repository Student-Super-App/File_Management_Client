import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/app/store/store";
import {
  LayoutDashboard,
  FolderKanban,
  Key,
  Upload,
  Image,
  BarChart3,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  FileBox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// ============================================
// SIDEBAR NAVIGATION ITEMS
// ============================================

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    title: "API Keys",
    href: "/dashboard/api-keys",
    icon: Key,
  },
  {
    title: "Uploads",
    href: "/dashboard/uploads",
    icon: Upload,
  },
  {
    title: "Assets",
    href: "/dashboard/assets",
    icon: Image,
  },
  {
    title: "Usage",
    href: "/dashboard/usage",
    icon: BarChart3,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

// ============================================
// DASHBOARD SIDEBAR
// ============================================

interface DashboardSidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export function DashboardSidebar({
  collapsed = false,
  onCollapse,
}: DashboardSidebarProps) {
  const location = useLocation();
  const { sidebarDensity } = useAppSelector((state) => state.settings);
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const handleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapse?.(newState);
  };

  const itemPadding =
    sidebarDensity === "compact" ? "py-1.5 px-3" : "py-2.5 px-4";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <FileBox className="h-6 w-6 text-primary" />
            <span className="font-bold">FileCloud</span>
          </Link>
        )}
        {isCollapsed && (
          <Link to="/dashboard" className="mx-auto">
            <FileBox className="h-6 w-6 text-primary" />
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-2">
        {sidebarItems.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/dashboard" &&
              location.pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md text-sm font-medium transition-colors",
                itemPadding,
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCollapse}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
