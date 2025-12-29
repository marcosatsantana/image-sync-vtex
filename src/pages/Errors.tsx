import { DashboardSidebar } from "@/components/DashboardSidebar";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useQuery } from "@tanstack/react-query";
import { getErrors } from "@/services/monitorService";
import { format } from "date-fns";

const contextMapping: Record<string, string> = {
  getSkuByRefId: "Busca de SKU (VTEX)",
  getProductDetails: "Detalhes do Produto (VTEX)",
  deleteAllImages: "Remoção de Imagens Antigas",
  readLocalJson: "Leitura de Arquivo Local",
  updateSpecifications: "Atualização de Especificações",
  processProductLoop: "Processamento de Produto",
  updateImages_Global: "Erro Geral na Atualização",
};

const Errors = () => {
  const { data: errors, isLoading } = useQuery({
    queryKey: ['errors'],
    queryFn: getErrors,
    refetchInterval: 5000
  });

  return (
    <div className="flex min-h-screen w-full bg-gradient-subtle">
      <DashboardSidebar activeFilter="errors" />

      <main className="flex-1 overflow-auto ml-64">
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
              {errors?.length || 0} itens com erro
            </Badge>
          </div>

          {/* Error Items Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isLoading ? (
              <p>Carregando...</p>
            ) : errors?.map((item) => {
              let context: any = {};
              try {
                context = item.context; // It's already JSONB from DB, knex parses it? Or need to parse string?
                // Knex with pg usually returns jsonb as object. If string, parse it.
                if (typeof context === 'string') {
                  context = JSON.parse(context);
                }
              } catch (e) { }

              const sku = context.sku || context.refId || context.productId || 'N/A';
              const productName = `Produto ${sku}`; // We might not have name in error context

              return (
                <Card key={item.id} className="border-destructive/20 hover:shadow-hover transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{productName}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">SKU: {sku}</Badge>
                          <Badge variant="destructive">{item.error_code}</Badge>
                        </div>
                      </div>
                      <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                    </div>
                    <CardDescription className="text-sm text-muted-foreground">
                      Contexto: {contextMapping[context.context] || context.context || 'Geral'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Error Message */}
                      <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                        <p className="text-sm text-destructive font-medium break-words">
                          {item.message}
                        </p>
                      </div>

                      {/* Info and Action */}
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Erro em {format(new Date(item.created_at), 'dd/MM/yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Errors;
