// src/components/Menu/MenuList.tsx
import ProductCard from "./ProductCard";
import { Category, Product } from "@/lib/types";

export default function MenuList({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.categoryUuid}>
          <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products
              .filter((p) => p.category.categoryUuid === category.categoryUuid)
              .map((product) => (
                <ProductCard key={product.productUuid} product={product} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
