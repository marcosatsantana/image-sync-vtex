import type { Category } from '@/types/catalog';
import { LogMessage } from '@/components/LogViewer';
import api from './api';

export interface UpdateImagesRequest {
  products: {
    id: string;
    sku: string;
    name: string;
    categoryName: string;
    subcategoryName: string;
    images: string[];
    mainImageIndex: number;
    description?: string;
    specifications?: Record<string, string>;
  }[];
}

export async function updateProductImages(
  selectedProductIds: Set<string>,
  catalog: Category[],
  mainImages: Record<string, number>,
  onLog: (log: LogMessage) => void,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  // Coletar produtos selecionados
  const products: UpdateImagesRequest['products'] = [];

  catalog.forEach((category) => {
    // Safely handle undefined subCategories
    const subCategories = category.subCategories ?? [];

    subCategories.forEach((subCategory) => {
      // Safely handle undefined products
      const categoryProducts = subCategory.products ?? [];

      categoryProducts.forEach((product) => {
        if (selectedProductIds.has(product.id)) {
          products.push({
            id: product.id,
            sku: product.sku,
            name: product.name,
            categoryName: category.name,
            subcategoryName: subCategory.name,
            images: product.images,
            mainImageIndex: mainImages[product.id] ?? 0,
            description: product.descricao,
            specifications: product.especificacoes,
          });
        }
      });
    });
  });

  console.log('📤 Enviando para backend:', { products });

  try {
    const response = await fetch(`${api.defaults.baseURL}/api/update-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ products }),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('ReadableStream não suportado pelo navegador.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');

      // Processa todas as linhas completas
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const jsonStr = line.replace('data: ', '');
            if (jsonStr) {
              const log = JSON.parse(jsonStr);

              if (log.type === 'progress' && onProgress && log.details) {
                onProgress(log.details.current, log.details.total);
              } else {
                onLog(log);
              }
            }
          } catch (e) {
            console.error('Erro ao fazer parse do log:', e, line);
          }
        }
      }
    }

  } catch (error: any) {
    console.error('Erro no updateProductImages:', error);
    onLog({
      type: 'error',
      message: `Erro de conexão: ${error.message}`,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}
