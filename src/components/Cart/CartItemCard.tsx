// src/components/Cart/CartItemCard.tsx
"use client";

import cartService from "@/lib/server/cart-service";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function CartItemCard({ item, storeUuid, userPhone, cartUuid, token }) {
  const [loading, setLoading] = useState(false);

  const updateQuantity = async (action: "add" | "remove") => {
    setLoading(true);
    try {
      const fn =
        action === "add"
          ? cartService.addQuantity
          : cartService.removeQuantity;

      await fn(
        {
          storeUuid,
          userPhone,
          cartUuid,
          cartItemUuid: item.cart_item_uuid,
          productUuid: item.product_uuid,
        },
        token
      );

      toast.success(`${action === "add" ? "Added" : "Removed"} quantity`);
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded-lg flex justify-between items-center">
      <div>
        <h2 className="font-semibold">{item.product_name}</h2>
        <p>₹{item.unit_price} × {item.quantity}</p>
        <p className="text-muted-foreground">Subtotal: ₹{item.final_price}</p>
      </div>

      <div className="flex gap-2 items-center">
        <Button size="sm" onClick={() => updateQuantity("remove")} disabled={loading}>-</Button>
        <span>{item.quantity}</span>
        <Button size="sm" onClick={() => updateQuantity("add")} disabled={loading}>+</Button>
      </div>
    </div>
  );
}
