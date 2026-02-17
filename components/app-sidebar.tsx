"use client";

import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  LayoutDashboard,
  Receipt,
  Wallet,
  PiggyBank,
  Users,
  FileDown,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AppSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "operations", label: "Opérations", icon: Receipt },
  { id: "analyse", label: "Analyse", icon: TrendingUp },
  { id: "budget", label: "Budget", icon: PiggyBank },
  { id: "caisse", label: "Caisse", icon: Wallet },
  { id: "facturation", label: "Facturation", icon: FileText },
  { id: "rh", label: "Ressources Humaines", icon: Users },
  { id: "export", label: "Exports", icon: FileDown },
];

export function AppSidebar({ currentPage, onPageChange, isCollapsed, onToggleCollapse }: AppSidebarProps) {
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className={cn(
            "flex items-center border-b border-sidebar-border h-16 px-4",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">GEEK-FIN</span>
              </div>
            )}
            {isCollapsed && (
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              const Icon = item.icon;
              
              const button = (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>{button}</TooltipTrigger>
                    <TooltipContent side="right" className="bg-popover text-popover-foreground">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return button;
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-sidebar-border p-4">
            {!isCollapsed ? (
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-sm">
                    {user ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-sidebar-foreground/60 truncate capitalize">{user?.role}</p>
                </div>
              </div>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-center mb-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-sm">
                        {user ? getInitials(user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-popover text-popover-foreground">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </TooltipContent>
              </Tooltip>
            )}

            <div className="flex gap-2">
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={logout}
                      className="w-full text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-popover text-popover-foreground">
                    Déconnexion
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="flex-1 justify-start text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              )}
            </div>
          </div>

          {/* Collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="absolute -right-3 top-20 w-6 h-6 bg-sidebar border border-sidebar-border rounded-full flex items-center justify-center hover:bg-sidebar-accent transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-3 h-3" />
            ) : (
              <ChevronLeft className="w-3 h-3" />
            )}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
