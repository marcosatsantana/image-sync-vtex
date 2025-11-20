import { DashboardSidebar } from "@/components/DashboardSidebar";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const errorItems = [
  {
    id: "1",
    productName: "Parafusadeira 18V",
    sku: "FER-004",
    category: "Ferramentas > Elétricas",
    errorType: "Imagem não encontrada",
    errorMessage: "A URL da imagem retornou erro 404",
    errorAt: "2024-01-15 15:22"
  },
  {
    id: "2",
    productName: "Esmerilhadeira Angular",
    sku: "FER-005",
    category: "Ferramentas > Elétricas",
    errorType: "Formato inválido",
    errorMessage: "O formato da imagem não é suportado (WEBP)",
    errorAt: "2024-01-15 14:55"
  },
  {
    id: "3",
    productName: "Martelete Perfurador",
    sku: "FER-006",
    category: "Ferramentas > Elétricas",
    errorType: "Timeout",
    errorMessage: "Tempo limite excedido ao buscar imagem",
    errorAt: "2024-01-15 13:42"
  },
];

const Errors = () => {
  const handleRetry = (productName: string) => {
    toast({
      title: "Tentando novamente",
      description: `Buscando imagem para ${productName}...`,
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-subtle">
      <DashboardSidebar activeFilter="errors" />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <h2 className="text-3xl font-bold text-foreground">
                Erros de Sincronização
              </h2>
            </div>
            <p className="text-muted-foreground">
              Produtos que apresentaram erros durante a atualização de imagens
            </p>
          </div>

          {/* Stats */}
          <div className="mb-6">
            <Badge variant="destructive" className="text-base px-4 py-2">
              {errorItems.length} itens com erro
            </Badge>
          </div>

          {/* Error Items Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {errorItems.map((item) => (
              <Card key={item.id} className="border-destructive/20 hover:shadow-hover transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{item.productName}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">SKU: {item.sku}</Badge>
                        <Badge variant="destructive">{item.errorType}</Badge>
                      </div>
                    </div>
                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                  </div>
                  <CardDescription className="text-sm text-muted-foreground">
                    {item.category}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Error Message */}
                    <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                      <p className="text-sm text-destructive font-medium">
                        {item.errorMessage}
                      </p>
                    </div>

                    {/* Info and Action */}
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Erro em {item.errorAt}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRetry(item.productName)}
                        className="gap-2"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Tentar novamente
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Errors;
