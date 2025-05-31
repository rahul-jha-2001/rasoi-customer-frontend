// src/components/Menu/ProductCard.tsx
import AddToCartButton from "./AddToCartButton";
import { Product } from "@/lib/types";

export default function ProductCard({ product }: {product: Product}) {
  return (
    <div className="border p-4 rounded-lg flex justify-between items-center shadow-sm">
      <div>
        <h3 className="font-medium text-lg">{product.name}</h3>
        <p className="text-sm text-muted-foreground">₹{product.price}</p>
      </div>
      <AddToCartButton productUuid={product.productUuid} />
    </div>
  );
}
