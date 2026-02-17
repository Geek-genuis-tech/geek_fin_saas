"use client";

import { useState } from "react";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { LoginForm } from "@/components/login-form";
import { AppSidebar } from "@/components/app-sidebar";
import { Dashboard } from "@/components/dashboard";
import { Operations } from "@/components/operations";
import { Budget } from "@/components/budget";
import { Caisse } from "@/components/caisse";
import { RH } from "@/components/rh";
import { Export } from "@/components/export";
import { Facturation } from "@/components/facturation";
import { Analyse } from "@/components/analyse";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "operations":
        return <Operations />;
      case "analyse":
        return <Analyse />;
      case "budget":
        return <Budget />;
      case "caisse":
        return <Caisse />;
      case "facturation":
        return <Facturation />;
      case "rh":
        return <RH />;
      case "export":
        return <Export />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          isSidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <div className="p-6 lg:p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
