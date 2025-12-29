import { useQuery } from '@tanstack/react-query';
import { CatalogResponse } from '@/types/catalog';
import api from '@/services/api';

export const useCatalog = () => {
  return useQuery<CatalogResponse>({
    queryKey: ['catalog'],
    queryFn: async () => {
      const response = await api.get('/api/catalog');
      return response.data;
    },
  });
};
