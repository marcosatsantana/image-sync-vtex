import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen, Loader2, CheckSquare } from "lucide-react"; 
import { Checkbox } from "@/components/ui/checkbox";
import { ProductGrid } from "./ProductGrid";
import { Category, SubCategory, Product, CatalogResponse } from "@/types/catalog";
import { useQueryClient } from "@tanstack/react-query";
import { fetchSubCategories, fetchProducts } from "@/services/catalogService";
import { toast } from "@/hooks/use-toast";

interface TreeViewItemProps {
  category: Category;
  selectedItems: Set<string>;
  onSelectionChange: (ids: string[], checked: boolean) => void;
  mainImages: Record<string, number>;
  onMainImageChange: (productId: string, imageIndex: number) => void;
  autoExpand?: boolean;
  searchQuery?: string;
  onProductUpdate?: (product: Product) => void;
}

export function TreeViewItem({ category, selectedItems, onSelectionChange, mainImages, onMainImageChange, autoExpand = false, searchQuery = "", onProductUpdate }: TreeViewItemProps) {
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(autoExpand);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [loadingSubCategories, setLoadingSubCategories] = useState<Set<string>>(new Set());
  const [expandedSubs, setExpandedSubs] = useState<Set<string>>(
    autoExpand && category.subCategories ? new Set(category.subCategories.map(sub => sub.id)) : new Set()
  );

  // Auto-expand when search results change
  useEffect(() => {
    if (autoExpand && category.subCategories) {
      setIsExpanded(true);
      setExpandedSubs(new Set(category.subCategories.map(sub => sub.id)));
    }
  }, [autoExpand, category.subCategories]);

  // Calculate selection state for category
  const allProductIds = category.subCategories?.flatMap((sub) =>
    sub.products?.map((p) => p.id) || []
  ) || [];
  const selectedCount = allProductIds.filter((id) => selectedItems.has(id)).length;
  // Category checkbox only enabled if we have products loaded
  const hasLoadedProducts = allProductIds.length > 0;

  const categoryChecked = hasLoadedProducts && selectedCount === allProductIds.length && allProductIds.length > 0;
  const categoryIndeterminate = selectedCount > 0 && selectedCount < allProductIds.length;

  const handleCategoryToggle = (checked: boolean) => {
    if (hasLoadedProducts) {
      onSelectionChange(allProductIds, checked);
    }
  };

  const handleExpandCategory = async () => {
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }

    if (!category.subCategories || category.subCategories.length === 0) {
      setIsLoadingCategory(true);
      try {
        const subs = await fetchSubCategories(category.path || category.name);

        // Update Cache
        queryClient.setQueryData<CatalogResponse>(['catalog'], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            categories: oldData.categories.map(cat =>
              cat.id === category.id ? { ...cat, subCategories: subs } : cat
            )
          };
        });
      } catch (error) {
        console.error("Failed to load subcategories", error);
        toast({
          title: "Erro ao carregar subcategorias",
          description: "Tente novamente mais tarde.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingCategory(false);
      }
    }

    setIsExpanded(true);
  };

  const toggleSubCategory = async (subId: string, subCategory: SubCategory) => {
    const isSubExpanded = expandedSubs.has(subId);

    if (isSubExpanded) {
      setExpandedSubs((prev) => {
        const next = new Set(prev);
        next.delete(subId);
        return next;
      });
      return;
    }

    // Load products if not loaded
    if (!subCategory.products || subCategory.products.length === 0) {
      setLoadingSubCategories(prev => new Set(prev).add(subId));
      try {
        const products = await fetchProducts(category.path || category.name, subCategory.parentPath || subCategory.name); // fallback to name if parentPath missing (shouldnt be)

        // Update Cache
        queryClient.setQueryData<CatalogResponse>(['catalog'], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            categories: oldData.categories.map(cat => {
              if (cat.id !== category.id) return cat;
              return {
                ...cat,
                subCategories: cat.subCategories?.map(sub =>
                  sub.id === subId ? { ...sub, products: products } : sub
                )
              };
            })
          };
        });
      } catch (error) {
        console.error("Failed to load products", error);
        toast({
          title: "Erro ao carregar produtos",
          description: "Tente novamente mais tarde.",
          variant: "destructive"
        });
      } finally {
        setLoadingSubCategories(prev => {
          const next = new Set(prev);
          next.delete(subId);
          return next;
        });
      }
    }

    setExpandedSubs((prev) => {
      const next = new Set(prev);
      next.add(subId);
      return next;
    });
  };

  const handleSubCategoryToggle = (subCategory: SubCategory, checked: boolean) => {
    if (subCategory.products && subCategory.products.length > 0) {
      const productIds = subCategory.products.map((p) => p.id);
      onSelectionChange(productIds, checked);
    }
  };

  const getSubCategoryState = (subCategory: SubCategory) => {
    const productIds = subCategory.products?.map((p) => p.id) || [];
    const selectedInSub = productIds.filter((id) => selectedItems.has(id)).length;
    return {
      checked: productIds.length > 0 && selectedInSub === productIds.length,
      indeterminate: selectedInSub > 0 && selectedInSub < productIds.length,
      disabled: productIds.length === 0
    };
  };

  return (
    <div className="border border-border rounded-lg bg-card shadow-card animate-fade-in">
      {/* Category Header */}
      <div
        className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={handleExpandCategory}
      >
        <button
          className="hover:bg-accent/10 rounded p-1 transition-colors"
        >
          {isLoadingCategory ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : isExpanded ? (
            <ChevronDown className="h-5 w-5 text-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 text-foreground" />
          )}
        </button>

        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={categoryIndeterminate ? "indeterminate" : categoryChecked}
            onCheckedChange={handleCategoryToggle}
            disabled={!hasLoadedProducts}
            className="data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary"
          />
        </div>

        {isExpanded ? (
          <FolderOpen className="h-5 w-5 text-primary" />
        ) : (
          <Folder className="h-5 w-5 text-muted-foreground" />
        )}

        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{category.name}</h3>
          <p className="text-sm text-muted-foreground">
            {category.subCategories ? category.subCategories.length : 0} subcategorias
            {category.subCategories && `, ${allProductIds.length} produtos carregados`}
          </p>
        </div>

        {selectedCount > 0 && (
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
            {selectedCount} selecionados
          </span>
        )}
      </div>

      {/* Subcategories */}
      {isExpanded && category.subCategories && (
        <div className="border-t border-border bg-muted/30">
          {category.subCategories.map((subCategory) => {
            const isSubExpanded = expandedSubs.has(subCategory.id);
            const isSubLoading = loadingSubCategories.has(subCategory.id);
            const subState = getSubCategoryState(subCategory);
            const notUpdatedIds = (subCategory.products || []).filter((p) => !p.isUpdated).map((p) => p.id);
            const hasNotUpdated = notUpdatedIds.length > 0;

            return (
              <div key={subCategory.id} className="border-b border-border last:border-b-0">
                {/* Subcategory Header */}
                <div
                  className="flex items-center gap-3 p-4 pl-12 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => toggleSubCategory(subCategory.id, subCategory)}
                >
                  <button
                    className="hover:bg-accent/10 rounded p-1 transition-colors"
                  >
                    {isSubLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : isSubExpanded ? (
                      <ChevronDown className="h-4 w-4 text-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-foreground" />
                    )}
                  </button>

                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={subState.indeterminate ? "indeterminate" : subState.checked}
                      onCheckedChange={(checked) =>
                        handleSubCategoryToggle(subCategory, checked === true)
                      }
                      disabled={subState.disabled}
                      className="data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary"
                    />
                  </div>

                  {isSubExpanded ? (
                    <FolderOpen className="h-4 w-4 text-primary" />
                  ) : (
                    <Folder className="h-4 w-4 text-muted-foreground" />
                  )}

                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{subCategory.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {subCategory.products ? subCategory.products.length : "?"} produtos
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pr-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (hasNotUpdated) {
                          onSelectionChange(notUpdatedIds, true);
                        }
                      }}
                      disabled={!hasNotUpdated}
                      title="Selecionar não atualizados"
                      className="text-xs px-2 py-1 rounded hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <CheckSquare className="h-4 w-4 text-foreground" />
                    </button>
                  </div>
                </div>

                {/* Products Grid */}
                {isSubExpanded && subCategory.products && (
                  <ProductGrid
                    products={subCategory.products}
                    selectedItems={selectedItems}
                    onSelectionChange={onSelectionChange}
                    mainImages={mainImages}
                    onMainImageChange={onMainImageChange}
                    searchQuery={searchQuery}
                    onProductUpdate={onProductUpdate}
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
