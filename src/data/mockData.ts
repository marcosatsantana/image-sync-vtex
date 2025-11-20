import type { Category } from "@/components/TreeViewItem";
import drillOld from "@/assets/drill-old.jpg";
import drillNew from "@/assets/drill-new.jpg";
import sawOld from "@/assets/saw-old.jpg";
import sawNew from "@/assets/saw-new.jpg";
import grinderOld from "@/assets/grinder-old.jpg";
import grinderNew from "@/assets/grinder-new.jpg";

export const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Ferramentas Elétricas",
    subCategories: [
      {
        id: "sub-1-1",
        name: "Furadeiras",
        products: [
          {
            id: "prod-1-1-1",
            name: "Furadeira 500W",
            sku: "FER-500W-01",
            currentImage: drillOld,
            newImage: drillNew,
          },
          {
            id: "prod-1-1-2",
            name: "Furadeira 650W",
            sku: "FER-650W-02",
            currentImage: drillOld,
            newImage: drillNew,
          },
          {
            id: "prod-1-1-3",
            name: "Furadeira 800W Premium",
            sku: "FER-800W-03",
            currentImage: drillOld,
            newImage: drillNew,
          },
        ],
      },
      {
        id: "sub-1-2",
        name: "Serras Elétricas",
        products: [
          {
            id: "prod-1-2-1",
            name: "Serra Circular 1200W",
            sku: "SER-1200W-01",
            currentImage: sawOld,
            newImage: sawNew,
          },
          {
            id: "prod-1-2-2",
            name: "Serra Circular 1500W",
            sku: "SER-1500W-02",
            currentImage: sawOld,
            newImage: sawNew,
          },
        ],
      },
      {
        id: "sub-1-3",
        name: "Lixadeiras",
        products: [
          {
            id: "prod-1-3-1",
            name: "Lixadeira Orbital 300W",
            sku: "LIX-300W-01",
            currentImage: grinderOld,
            newImage: grinderNew,
          },
          {
            id: "prod-1-3-2",
            name: "Lixadeira Angular 450W",
            sku: "LIX-450W-02",
            currentImage: grinderOld,
            newImage: grinderNew,
          },
          {
            id: "prod-1-3-3",
            name: "Lixadeira Politriz 600W",
            sku: "LIX-600W-03",
            currentImage: grinderOld,
            newImage: grinderNew,
          },
        ],
      },
    ],
  },
  {
    id: "cat-2",
    name: "Ferramentas Manuais",
    subCategories: [
      {
        id: "sub-2-1",
        name: "Chaves de Fenda",
        products: [
          {
            id: "prod-2-1-1",
            name: "Kit Chaves Philips",
            sku: "CHV-PH-KIT01",
            currentImage: drillOld,
            newImage: drillNew,
          },
          {
            id: "prod-2-1-2",
            name: "Kit Chaves Mistas",
            sku: "CHV-MX-KIT02",
            currentImage: drillOld,
            newImage: drillNew,
          },
        ],
      },
      {
        id: "sub-2-2",
        name: "Alicates",
        products: [
          {
            id: "prod-2-2-1",
            name: "Alicate Universal 8pol",
            sku: "ALC-UNI-8P",
            currentImage: grinderOld,
            newImage: grinderNew,
          },
          {
            id: "prod-2-2-2",
            name: "Alicate de Corte 6pol",
            sku: "ALC-CRT-6P",
            currentImage: grinderOld,
            newImage: grinderNew,
          },
          {
            id: "prod-2-2-3",
            name: "Alicate de Pressão 10pol",
            sku: "ALC-PRS-10P",
            currentImage: grinderOld,
            newImage: grinderNew,
          },
        ],
      },
    ],
  },
];
