import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ProductGrid } from "./ProductGrid";

export interface Product {
  id: string;
  name: string;
  sku: string;
  currentImage: string;
  newImage: string;
}

export interface SubCategory {
  id: string;
  name: string;
  products: Product[];
}

export interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

interface TreeViewItemProps {
  category: Category;
  selectedItems: Set<string>;
  onSelectionChange: (ids: string[], checked: boolean) => void;
}

export function TreeViewItem({ category, selectedItems, onSelectionChange }: TreeViewItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSubs, setExpandedSubs] = useState<Set<string>>(new Set());

  // Calculate selection state for category
  const allProductIds = category.subCategories.flatMap((sub) =>
    sub.products.map((p) => p.id)
  );
  const selectedCount = allProductIds.filter((id) => selectedItems.has(id)).length;
  const categoryChecked = selectedCount === allProductIds.length && allProductIds.length > 0;
  const categoryIndeterminate = selectedCount > 0 && selectedCount < allProductIds.length;

  const handleCategoryToggle = (checked: boolean) => {
    onSelectionChange(allProductIds, checked);
  };

  const toggleSubCategory = (subId: string) => {
    setExpandedSubs((prev) => {
      const next = new Set(prev);
      if (next.has(subId)) {
        next.delete(subId);
      } else {
        next.add(subId);
      }
      return next;
    });
  };

  const handleSubCategoryToggle = (subCategory: SubCategory, checked: boolean) => {
    const productIds = subCategory.products.map((p) => p.id);
    onSelectionChange(productIds, checked);
  };

  const getSubCategoryState = (subCategory: SubCategory) => {
    const productIds = subCategory.products.map((p) => p.id);
    const selectedInSub = productIds.filter((id) => selectedItems.has(id)).length;
    return {
      checked: selectedInSub === productIds.length && productIds.length > 0,
      indeterminate: selectedInSub > 0 && selectedInSub < productIds.length,
    };
  };

  return (
    <div className="border border-border rounded-lg bg-card shadow-card animate-fade-in">
      {/* Category Header */}
      <div className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="hover:bg-accent/10 rounded p-1 transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 text-foreground" />
          )}
        </button>

        <Checkbox
          checked={categoryIndeterminate ? "indeterminate" : categoryChecked}
          onCheckedChange={handleCategoryToggle}
          className="data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary"
        />

        {isExpanded ? (
          <FolderOpen className="h-5 w-5 text-primary" />
        ) : (
          <Folder className="h-5 w-5 text-muted-foreground" />
        )}

        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{category.name}</h3>
          <p className="text-sm text-muted-foreground">
            {category.subCategories.length} subcategorias, {allProductIds.length} produtos
          </p>
        </div>

        {selectedCount > 0 && (
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
            {selectedCount} selecionados
          </span>
        )}
      </div>

      {/* Subcategories */}
      {isExpanded && (
        <div className="border-t border-border bg-muted/30">
          {category.subCategories.map((subCategory) => {
            const isSubExpanded = expandedSubs.has(subCategory.id);
            const subState = getSubCategoryState(subCategory);

            return (
              <div key={subCategory.id} className="border-b border-border last:border-b-0">
                {/* Subcategory Header */}
                <div className="flex items-center gap-3 p-4 pl-12 hover:bg-muted/50 transition-colors">
                  <button
                    onClick={() => toggleSubCategory(subCategory.id)}
                    className="hover:bg-accent/10 rounded p-1 transition-colors"
                  >
                    {isSubExpanded ? (
                      <ChevronDown className="h-4 w-4 text-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-foreground" />
                    )}
                  </button>

                  <Checkbox
                    checked={subState.indeterminate ? "indeterminate" : subState.checked}
                    onCheckedChange={(checked) =>
                      handleSubCategoryToggle(subCategory, checked === true)
                    }
                    className="data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary"
                  />

                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{subCategory.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {subCategory.products.length} produtos
                    </p>
                  </div>
                </div>

                {/* Products Grid */}
                {isSubExpanded && (
                  <ProductGrid
                    products={subCategory.products}
                    selectedItems={selectedItems}
                    onSelectionChange={onSelectionChange}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
