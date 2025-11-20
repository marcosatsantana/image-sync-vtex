import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import type { Product } from "./TreeViewItem";

interface ProductGridProps {
  products: Product[];
  selectedItems: Set<string>;
  onSelectionChange: (ids: string[], checked: boolean) => void;
}

export function ProductGrid({ products, selectedItems, onSelectionChange }: ProductGridProps) {
  return (
    <div className="p-4 pl-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-background/50">
      {products.map((product) => {
        const isSelected = selectedItems.has(product.id);

        return (
          <div
            key={product.id}
            className={cn(
              "border border-border rounded-lg p-4 bg-card shadow-card hover:shadow-hover transition-all",
              isSelected && "ring-2 ring-primary ring-offset-2"
            )}
          >
            {/* Checkbox */}
            <div className="flex items-center gap-2 mb-3">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) =>
                  onSelectionChange([product.id], checked as boolean)
                }
                className="data-[state=checked]:bg-primary"
              />
              <span className="text-sm font-medium text-foreground">{product.name}</span>
            </div>

            {/* SKU Badge */}
            <Badge variant="secondary" className="mb-3 text-xs">
              SKU: {product.sku}
            </Badge>

            {/* New Image */}
            <div className="space-y-1">
              <p className="text-xs text-primary font-medium">Nova Imagem</p>
              <div className="aspect-square rounded-md overflow-hidden bg-muted border border-primary/50">
                <img
                  src={product.newImage}
                  alt={`${product.name} - nova imagem`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
