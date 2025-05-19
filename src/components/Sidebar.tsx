
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Home,
  Search,
  BookmarkIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  isCollapsed: boolean;
}

function SidebarItem({ icon: Icon, label, path, isCollapsed }: SidebarItemProps) {
  const isActive = window.location.pathname === path;

  return (
    <Link to={path}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-4 px-4",
          isActive && "bg-accent/20",
          isCollapsed && "justify-center px-2"
        )}
      >
        <Icon className={cn("h-5 w-5", isActive && "text-accent")} />
        {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
      </Button>
    </Link>
  );
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-sidebar py-4 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between px-4 mb-6">
        {!isCollapsed && (
          <span className="text-xl font-bold text-sidebar-foreground">
            Reading Hub
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="flex-1 space-y-1 px-2">
        <SidebarItem
          icon={Home}
          label="Home"
          path="/"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          icon={BookOpen}
          label="Library"
          path="/library"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          icon={BookmarkIcon}
          label="Bookmarks"
          path="/bookmarks"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          icon={Search}
          label="Search"
          path="/search"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          icon={Settings}
          label="Settings"
          path="/settings"
          isCollapsed={isCollapsed}
        />
      </div>
    </div>
  );
}
