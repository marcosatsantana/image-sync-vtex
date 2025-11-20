import { DashboardSidebar } from "@/components/DashboardSidebar";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const updatedItems = [
  {
    id: "1",
    productName: "Furadeira 500W",
    sku: "FER-001",
    category: "Ferramentas > Elétricas",
    updatedAt: "2024-01-15 14:32",
    newImage: "/src/assets/drill-new.jpg"
  },
  {
    id: "2",
    productName: "Serra Circular 1200W",
    sku: "FER-002",
    category: "Ferramentas > Elétricas",
    updatedAt: "2024-01-15 13:45",
    newImage: "/src/assets/saw-new.jpg"
  },
  {
    id: "3",
    productName: "Lixadeira Orbital",
    sku: "FER-003",
    category: "Ferramentas > Elétricas",
    updatedAt: "2024-01-15 12:18",
    newImage: "/src/assets/grinder-new.jpg"
  },
];

const Updated = () => {
  return (
    <div className="flex min-h-screen w-full bg-gradient-subtle">
      <DashboardSidebar activeFilter="updated" />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                Produtos Atualizados
              </h2>
            </div>
            <p className="text-muted-foreground">
              Produtos que tiveram suas imagens atualizadas com sucesso
            </p>
          </div>

          {/* Stats */}
          <div className="mb-6">
            <Badge variant="secondary" className="text-base px-4 py-2">
              {updatedItems.length} itens atualizados
            </Badge>
          </div>

          {/* Updated Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {updatedItems.map((item) => (
              <Card key={item.id} className="hover:shadow-hover transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{item.productName}</CardTitle>
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  </div>
                  <Badge variant="outline" className="w-fit">
                    SKU: {item.sku}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Image */}
                    <div className="aspect-square rounded-md overflow-hidden bg-muted border border-border">
                      <img
                        src={item.newImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">{item.category}</p>
                      <p className="text-xs text-muted-foreground">
                        Atualizado em {item.updatedAt}
                      </p>
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

export default Updated;
