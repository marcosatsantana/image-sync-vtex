import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Product } from '@/types/catalog';

import api from '@/services/api';

interface ProductImageGridProps {
  product: Product;
}

// remove const API_URL

export const ProductImageGrid = ({ product }: ProductImageGridProps) => {
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const slides = product.images.map((img) => ({
    src: `${api.defaults.baseURL}${img}`,
  }));

  return (
    <div className="mb-8 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-sm text-gray-600 mb-4">SKU: {product.sku}</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {product.images.map((img, index) => (
          <div
            key={index}
            className="aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              setPhotoIndex(index);
              setOpen(true);
            }}
          >
            <img
              src={`${api.defaults.baseURL}${img}`}
              alt={`${product.name} - Imagem ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={photoIndex}
      />
    </div>
  );
};
