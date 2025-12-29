import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, Info } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { cn } from "@/lib/utils";
import { HighlightText } from "./HighlightText";
import type { Product } from "@/types/catalog";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '@/services/api';

interface ProductGridProps {
  products: Product[];
  selectedItems: Set<string>;
  onSelectionChange: (ids: string[], checked: boolean) => void;
  mainImages: Record<string, number>;
  onMainImageChange: (productId: string, imageIndex: number) => void;
  searchQuery?: string;
  onProductUpdate?: (product: Product) => void;
}

export function ProductGrid({ products, selectedItems, onSelectionChange, mainImages, onMainImageChange, searchQuery = "", onProductUpdate }: ProductGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<{ src: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedSpecs, setEditedSpecs] = useState<Record<string, string>>({});

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images.map((img) => ({ src: `${api.defaults.baseURL}${img}` })));
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const openDetails = (product: Product) => {
    setSelectedProduct(product);
    setEditedDescription(product.descricao || "");
    setEditedSpecs(product.especificacoes || {});
    setIsEditing(false);
    setDetailsOpen(true);
  };

  const handleSave = () => {
    if (selectedProduct && onProductUpdate) {
      const updatedProduct = {
        ...selectedProduct,
        descricao: editedDescription,
        especificacoes: editedSpecs
      };
      onProductUpdate(updatedProduct);
      setSelectedProduct(updatedProduct);
      setIsEditing(false);
    }
  };

  return (
    <>
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
                <HighlightText
                  text={product.name}
                  highlight={searchQuery}
                  className="text-sm font-medium text-foreground"
                />
              </div>

              {/* SKU Badge */}
              <div className="flex gap-2">
                <Badge variant="secondary" className="mb-3 text-xs w-fit">
                  SKU: <HighlightText text={product.sku} highlight={searchQuery} />
                </Badge>

                {product.updateStatus === 'SUCCESS' && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="default" className="mb-3 text-xs bg-green-600 hover:bg-green-700 w-fit gap-1 items-center cursor-help">
                        Atualizado {product.lastUpdated && `em ${new Date(product.lastUpdated).toLocaleDateString()}`}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Última atualização: {product.lastUpdated ? new Date(product.lastUpdated).toLocaleDateString() + ' ' + new Date(product.lastUpdated).toLocaleTimeString() : 'N/A'}</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {product.updateStatus === 'ERROR' && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="destructive" className="mb-3 text-xs w-fit gap-1 items-center cursor-help">
                        Erro ao Atualizar {product.lastUpdated && `em ${new Date(product.lastUpdated).toLocaleDateString()}`}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Falha na última tentativa: {product.lastUpdated ? new Date(product.lastUpdated).toLocaleDateString() + ' ' + new Date(product.lastUpdated).toLocaleTimeString() : 'N/A'}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              {/* Details Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full mb-3 gap-2"
                onClick={() => openDetails(product)}
              >
                <Info className="h-4 w-4" />
                Ver Detalhes
              </Button>

              {/* Images Info */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <span className="font-medium text-primary">{product.images.length}</span> imagens
              </div>
            </div>
          );
        })}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxImages}
        index={lightboxIndex}
      />

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              {selectedProduct?.name}
              <Badge variant="secondary" className="text-sm font-normal">
                SKU: {selectedProduct?.sku}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
            <div className="space-y-6 py-4">
              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">Descrição</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (isEditing) {
                        handleSave();
                      } else {
                        setIsEditing(true);
                      }
                    }}
                  >
                    {isEditing ? "Salvar" : "Editar"}
                  </Button>
                </div>
                {isEditing ? (
                  <div className="bg-background text-foreground">
                    <ReactQuill
                      theme="snow"
                      value={editedDescription}
                      onChange={setEditedDescription}
                      className="h-64 mb-12"
                    />
                  </div>
                ) : (
                  selectedProduct?.descricao ? (
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: selectedProduct.descricao }}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Sem descrição disponível.</p>
                  )
                )}
              </div>

              {/* Specifications */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Especificações</h3>
                {selectedProduct?.especificacoes && Object.keys(selectedProduct.especificacoes).length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedProduct.especificacoes).map(([key, value]) => (
                      <div key={key} className="bg-muted/50 p-3 rounded-lg border">
                        <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
                          {key.replace(/_/g, ' ')}
                        </p>
                        <p className="font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">Sem especificações disponíveis.</p>
                )}
              </div>
            </div>

            {/* Images Grid (Moved from Main Card) */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Galeria de Imagens</h3>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {selectedProduct?.images.map((img, index) => {
                  const productId = selectedProduct.id;
                  const isMainImage = mainImages[productId] === index || (mainImages[productId] === undefined && index === 0);

                  return (
                    <div
                      key={index}
                      className={cn(
                        "relative aspect-square rounded-md overflow-hidden bg-muted border transition-all group",
                        isMainImage ? "border-yellow-500 ring-2 ring-yellow-500/50" : "border-border"
                      )}
                    >
                      {/* Star button for main image */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMainImageChange(productId, index);
                            }}
                            className={cn(
                              "absolute top-2 right-2 z-10 p-1.5 rounded-full transition-all",
                              isMainImage
                                ? "bg-yellow-500 text-white shadow-lg"
                                : "bg-black/50 text-white opacity-0 group-hover:opacity-100"
                            )}
                          >
                            <Star className={cn("h-4 w-4", isMainImage && "fill-current")} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isMainImage ? "Imagem principal" : "Definir como principal"}</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Image */}
                      <div
                        className="w-full h-full cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => openLightbox(selectedProduct.images, index)}
                      >
                        <img
                          src={`${api.defaults.baseURL}${img}`}
                          alt={`${selectedProduct.name} - imagem ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Main image badge */}
                      {isMainImage && (
                        <div className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg">
                          Principal
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
