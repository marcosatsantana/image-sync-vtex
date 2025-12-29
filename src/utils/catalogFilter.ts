import type { Category } from "@/types/catalog";

export function filterCatalogBySKU(catalog: Category[], searchQuery: string): Category[] {
  if (!searchQuery.trim()) {
    return catalog;
  }

  const query = searchQuery.toLowerCase().trim();

  return catalog
    .map((category) => {
      if (!category.subCategories) return null;

      const filteredSubCategories = category.subCategories
        .map((subCategory) => {
          if (!subCategory.products) return null;

          const filteredProducts = subCategory.products.filter((product) =>
            product.sku.toLowerCase().includes(query) ||
            product.name.toLowerCase().includes(query)
          );

          if (filteredProducts.length === 0) {
            return null;
          }

          return {
            ...subCategory,
            products: filteredProducts,
          };
        })
        .filter((sub) => sub !== null);

      if (filteredSubCategories.length === 0) {
        return null;
      }

      return {
        ...category,
        subCategories: filteredSubCategories,
      };
    })
    .filter((cat) => cat !== null) as Category[];
}

export function getSearchResultsCount(catalog: Category[]): number {
  return catalog.reduce((total, category) => {
    return total + (category.subCategories?.reduce((subTotal, subCategory) => {
      return subTotal + (subCategory.products?.length || 0);
    }, 0) || 0);
  }, 0);
}
