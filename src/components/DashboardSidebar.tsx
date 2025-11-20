import { useState } from "react";
import { RefreshCw, Filter, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterOption {
  id: string;
  label: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const filterOptions: FilterOption[] = [
  { id: "pending", label: "Pendentes", count: 42, icon: Clock, color: "text-accent" },
  { id: "updated", label: "Atualizados", count: 128, icon: CheckCircle2, color: "text-primary" },
  { id: "errors", label: "Erros", count: 5, icon: AlertCircle, color: "text-destructive" },
];

interface DashboardSidebarProps {
  onSync: () => void;
  isSyncing: boolean;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function DashboardSidebar({ onSync, isSyncing, activeFilter, onFilterChange }: DashboardSidebarProps) {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground mb-1">
          Gestão de Imagens
        </h1>
        <p className="text-sm text-muted-foreground">E-commerce Sync</p>
      </div>

      {/* Sync Button */}
      <div className="p-4">
        <Button
          onClick={onSync}
          disabled={isSyncing}
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
          size="lg"
        >
          <RefreshCw className={cn("mr-2 h-4 w-4", isSyncing && "animate-spin")} />
          {isSyncing ? "Sincronizando..." : "Sincronizar com Fábrica"}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex-1 p-4 space-y-2">
        <div className="flex items-center gap-2 mb-3 text-sidebar-foreground">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-semibold">Filtros de Status</span>
        </div>

        {filterOptions.map((option) => {
          const Icon = option.icon;
          const isActive = activeFilter === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => onFilterChange(option.id)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg transition-all",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("h-5 w-5", isActive ? option.color : "text-muted-foreground")} />
                <span className="font-medium">{option.label}</span>
              </div>
              <span
                className={cn(
                  "text-xs font-semibold px-2 py-1 rounded-full",
                  isActive ? "bg-background/20" : "bg-sidebar-accent/50"
                )}
              >
                {option.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground text-center">
          Última sincronização: Há 2 horas
        </p>
      </div>
    </aside>
  );
}
