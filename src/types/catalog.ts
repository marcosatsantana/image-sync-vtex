export interface Product {
  id: string;
  name: string;
  sku: string;
  images: string[];
  descricao?: string;
  especificacoes?: Record<string, string>;
  isUpdated?: boolean;
  lastUpdated?: string | null;
  updateStatus?: 'SUCCESS' | 'ERROR' | null;
}

export interface SubCategory {
  id: string;
  name: string;
  parentPath?: string;
  products?: Product[];
}

export interface Category {
  id: string;
  name: string;
  path?: string;
  subCategories?: SubCategory[];
}

export type Catalog = Category[];

export interface CatalogResponse {
  categories: Catalog;
}
