import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/app/store/store";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  BarChart3,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  FileBox,
  CreditCard,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

// ============================================
// ADMIN SIDEBAR NAVIGATION ITEMS
// ============================================

const adminSidebarItems = [
  {
    title: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    title: "Usage Analytics",
    href: "/admin/usage",
    icon: BarChart3,
  },
  {
    title: "Billing Overview",
    href: "/admin/billing",
    icon: CreditCard,
  },
  {
    title: "System Health",
    href: "/admin/health",
    icon: Activity,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

// ============================================
// ADMIN SIDEBAR
// ============================================

interface AdminSidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export function AdminSidebar({
  collapsed = false,
  onCollapse,
}: AdminSidebarProps) {
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
      {/* Logo with Admin Badge */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <Link to="/admin" className="flex items-center gap-2">
            <FileBox className="h-6 w-6 text-primary" />
            <span className="font-bold">FileCloud</span>
            <Badge variant="secondary" className="text-xs">
              <Shield className="mr-1 h-3 w-3" />
              Admin
            </Badge>
          </Link>
        )}
        {isCollapsed && (
          <Link to="/admin" className="mx-auto">
            <FileBox className="h-6 w-6 text-primary" />
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-2">
        {adminSidebarItems.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/admin" &&
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

      {/* Back to Dashboard */}
      {!isCollapsed && (
        <div className="absolute bottom-16 left-0 right-0 px-4">
          <Link to="/dashboard">
            <Button variant="outline" className="w-full" size="sm">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      )}

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

export default AdminSidebar;
