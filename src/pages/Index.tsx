import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { TreeViewItem } from "@/components/TreeViewItem";
import { FloatingActionBar } from "@/components/FloatingActionBar";
import { mockCategories } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [activeFilter, setActiveFilter] = useState("pending");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleSelectionChange = (ids: string[], checked: boolean) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => {
        if (checked) {
          next.add(id);
        } else {
          next.delete(id);
        }
      });
      return next;
    });
  };

  const handleUpdate = () => {
    const count = selectedItems.size;
    toast({
      title: "Atualização em progresso",
      description: `Atualizando ${count} ${count === 1 ? "item" : "itens"}...`,
    });

    setTimeout(() => {
      toast({
        title: "Atualização concluída",
        description: `${count} ${count === 1 ? "item atualizado" : "itens atualizados"} com sucesso!`,
      });
      setSelectedItems(new Set());
    }, 2000);
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-subtle">
      <DashboardSidebar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Catálogo de Produtos
            </h2>
            <p className="text-muted-foreground">
              Gerencie e atualize as imagens do seu e-commerce
            </p>
          </div>

          {/* Tree View */}
          <div className="space-y-4">
            {mockCategories.map((category) => (
              <TreeViewItem
                key={category.id}
                category={category}
                selectedItems={selectedItems}
                onSelectionChange={handleSelectionChange}
              />
            ))}
          </div>
        </div>
      </main>

      <FloatingActionBar selectedCount={selectedItems.size} onUpdate={handleUpdate} />
    </div>
  );
};

export default Index;
