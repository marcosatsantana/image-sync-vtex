import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "@/components/NavLink";

interface FilterOption {
  id: string;
  label: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  path: string;
}

const filterOptions: FilterOption[] = [
  { id: "pending", label: "Pendentes", count: 42, icon: Clock, color: "text-accent", path: "/" },
  { id: "updated", label: "Atualizados", count: 128, icon: CheckCircle2, color: "text-primary", path: "/updated" },
  { id: "errors", label: "Erros", count: 5, icon: AlertCircle, color: "text-destructive", path: "/errors" },
];

interface DashboardSidebarProps {
  activeFilter: string;
}

export function DashboardSidebar({ activeFilter }: DashboardSidebarProps) {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground mb-1">
          Gestão de Imagens
        </h1>
        <p className="text-sm text-muted-foreground">Carpal | New Holland</p>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {filterOptions.map((option) => {
          const Icon = option.icon;
          const isActive = activeFilter === option.id;
          
          return (
            <NavLink
              key={option.id}
              to={option.path}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg transition-all",
                "hover:bg-sidebar-accent/50 text-sidebar-foreground/80"
              )}
              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
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
            </NavLink>
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
