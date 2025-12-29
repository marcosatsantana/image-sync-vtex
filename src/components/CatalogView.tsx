import { useCatalog } from '@/hooks/useCatalog';
import { ProductImageGrid } from './ProductImageGrid';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2 } from 'lucide-react';

export const CatalogView = () => {
  const { data: catalog, isLoading, error } = useCatalog();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Erro ao carregar catálogo</h2>
          <p className="text-gray-600">Verifique se o backend está rodando em http://192.168.20.129:3020</p>
        </div>
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Nenhum produto encontrado</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Catálogo de Produtos</h1>

      <Accordion type="multiple" className="w-full">
        {catalog.categories.map((category) => (
          <AccordionItem key={category.id} value={category.id}>
            <AccordionTrigger className="text-xl font-semibold">
              {category.name}
            </AccordionTrigger>
            <AccordionContent>
              <Accordion type="multiple" className="w-full pl-4">
                {category.subCategories.map((subCategory) => (
                  <AccordionItem key={subCategory.id} value={subCategory.id}>
                    <AccordionTrigger className="text-lg font-medium">
                      {subCategory.name} ({subCategory.products.length} produtos)
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6">
                        {subCategory.products.map((product) => (
                          <ProductImageGrid key={product.id} product={product} />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
