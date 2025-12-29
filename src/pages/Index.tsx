import { useState, useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { TreeViewItem } from "@/components/TreeViewItem";
import { FloatingActionBar } from "@/components/FloatingActionBar";
import { SearchBar } from "@/components/SearchBar";
import { useCatalog } from "@/hooks/useCatalog";
import { toast } from "@/hooks/use-toast";
import { filterCatalogBySKU, getSearchResultsCount } from "@/utils/catalogFilter";
import { updateProductImages } from "@/services/updateImagesService";
import { Loader2 } from "lucide-react";
import { Product, CatalogResponse } from "@/types/catalog";
import { LogViewer, LogMessage } from "@/components/LogViewer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const Index = () => {
  const queryClient = useQueryClient();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [mainImages, setMainImages] = useState<Record<string, number>>({}); // productId -> imageIndex
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [logs, setLogs] = useState<LogMessage[]>([]);

  const [isLogOpen, setIsLogOpen] = useState(false);

  // Progress & Timer
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isUpdating && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isUpdating, startTime]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate percentage
  const progressPercentage = progress.total > 0
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  const { data: catalogResponse, isLoading, error } = useCatalog();
  const catalog = catalogResponse?.categories;


  // Filter catalog based on search query
  const filteredCatalog = useMemo(() => {
    if (!catalog) return null;
    return filterCatalogBySKU(catalog, searchQuery);
  }, [catalog, searchQuery]);

  const resultsCount = useMemo(() => {
    if (!filteredCatalog) return 0;
    return getSearchResultsCount(filteredCatalog);
  }, [filteredCatalog]);

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

  const handleMainImageChange = (productId: string, imageIndex: number) => {
    setMainImages((prev) => ({
      ...prev,
      [productId]: imageIndex,
    }));
  };

  const handleProductUpdate = (updatedProduct: Product) => {
    queryClient.setQueryData<CatalogResponse>(['catalog'], (oldData) => {
      if (!oldData) return oldData;

      const newCategories = oldData.categories.map(category => ({
        ...category,
        subCategories: category.subCategories.map(sub => ({
          ...sub,
          products: sub.products.map(p =>
            p.id === updatedProduct.id ? updatedProduct : p
          )
        }))
      }));

      return {
        ...oldData,
        categories: newCategories
      };
    });

    toast({
      title: "Produto atualizado",
      description: "As alterações foram salvas localmente e serão enviadas ao atualizar.",
    });
  };

  const handleUpdate = async () => {
    if (!catalog || selectedItems.size === 0) return;

    const count = selectedItems.size;
    setIsUpdating(true);
    setLogs([]);

    setProgress({ current: 0, total: count });
    setElapsedTime(0);
    setStartTime(Date.now());
    setIsLogOpen(true);

    toast({
      title: "Iniciando atualização...",
      description: `Processando ${count} ${count === 1 ? "produto" : "produtos"}...`,
    });

    try {
      await updateProductImages(
        selectedItems,
        catalog,
        mainImages,
        (log) => setLogs((prev) => {
          const newLogs = [...prev, log];
          return newLogs.slice(-500); // Keep only the last 500 logs to prevent lag
        }),
        (current, total) => {
          setProgress({ current, total });
        }
      );

      toast({
        title: "Processo Finalizado",
        description: "Verifique os logs para detalhes.",
      });

      // Limpar seleção após sucesso (opcional, pode querer manter se falhar algo)
      // setSelectedItems(new Set());

    } catch (error) {
      console.error("Erro ao enviar produtos:", error);
      toast({
        title: "❌ Erro ao enviar",
        description: error instanceof Error ? error.message : "Erro desconhecido. Verifique o console.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
      setStartTime(null);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-subtle">
      <DashboardSidebar activeFilter="pending" />
      <main className="flex-1 overflow-auto ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Catálogo de Produtos
                </h2>
                <p className="text-muted-foreground">
                  Gerencie e atualize as imagens do seu e-commerce
                </p>
              </div>

              {catalog && (
                <div />
              )}
            </div>
          </div>

          {/* Search Bar */}
          {catalog && (
            <div className="mb-6">
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="Buscar por SKU ou nome do produto..."
              />
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-2">
                  {resultsCount === 0 ? (
                    <span className="text-destructive">Nenhum produto encontrado para "{searchQuery}"</span>
                  ) : (
                    <span>
                      {resultsCount} {resultsCount === 1 ? "produto encontrado" : "produtos encontrados"}
                    </span>
                  )}
                </p>
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <h3 className="text-xl font-bold text-red-600 mb-2">Erro ao carregar catálogo</h3>
              <p className="text-muted-foreground">
                Verifique se o backend está rodando em http://192.168.20.129:3020
              </p>
            </div>
          )}

          {/* Tree View */}
          {filteredCatalog && filteredCatalog.length > 0 ? (
            <div className="space-y-4">
              {filteredCatalog.map((category) => (
                <TreeViewItem
                  key={category.id}
                  category={category}
                  selectedItems={selectedItems}
                  onSelectionChange={handleSelectionChange}
                  mainImages={mainImages}
                  onMainImageChange={handleMainImageChange}
                  autoExpand={!!searchQuery}
                  searchQuery={searchQuery}
                  onProductUpdate={handleProductUpdate}
                />
              ))}
            </div>
          ) : catalog && searchQuery ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Nenhum produto encontrado para "{searchQuery}"
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Tente buscar por outro SKU ou nome de produto
              </p>
            </div>
          ) : null}
        </div>
      </main>

      <FloatingActionBar
        selectedCount={selectedItems.size}
        onUpdate={handleUpdate}
        isUpdating={isUpdating}
      />

      <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>

            <DialogTitle>Progresso da Atualização</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex justify-between text-sm font-medium">
              <span>Processando: {progress.current} / {progress.total}</span>
              <span>Tempo decorrido: {formatTime(elapsedTime)}</span>
            </div>
            <Progress value={progressPercentage} className="h-4" />
          </div>

          <LogViewer logs={logs} />
          <div className="flex justify-end">
            <Button onClick={() => setIsLogOpen(false)} disabled={isUpdating}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
