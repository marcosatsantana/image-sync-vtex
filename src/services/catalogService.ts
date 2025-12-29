import api from './api';
import { SubCategory, Product } from '@/types/catalog';

export const fetchSubCategories = async (categoryPath: string): Promise<SubCategory[]> => {
  const response = await api.get<SubCategory[]>(`/api/catalog/${encodeURIComponent(categoryPath)}/subcategories`);
  return response.data;
};

export const fetchProducts = async (categoryPath: string, subCategoryPath: string): Promise<Product[]> => {
  const response = await api.get<Product[]>(`/api/catalog/${encodeURIComponent(categoryPath)}/${encodeURIComponent(subCategoryPath)}/products`);
  return response.data;
};
