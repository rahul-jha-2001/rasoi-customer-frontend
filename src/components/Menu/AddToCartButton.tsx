// src/components/Menu/AddToCartButton.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cartService } from "@/lib/cart-service";
import { useUser } from "@/lib/context/UserContext";
import { CartItem,Product } from "@/lib/types";

interface Props {
  productId: string;
  storeUuid: string;
}

export default function AddToCartButton({ productUuid, storeUuid }: Props) {
  const [loading, setLoading] = useState(false);
  const [cartUuid, setCartUuid] = useState<string | null>(null);
  const { token, user } = useUser(); // assumes user.phone is available

  useEffect(() => {
    const saved = localStorage.getItem(`cart:${storeUuid}:${user?.phone}`);
    if (saved) setCartUuid(saved);
  }, [storeUuid, user?.phone]);

  const handleAdd = async () => {
    if (!token || !user?.phone) {
      toast.error("Please log in first.");
      return;
    }

    setLoading(true);
    try {
      // Fallback: create new cart or fetch existing
      const finalCartUuid = cartUuid ?? (await ensureCart());

      await cartService.addCartItem(
        {
          storeUuid,
          userPhone: user.phone,
          cartUuid: finalCartUuid,
          productUuid: productUuid,
        },
        token
      );

      toast.success("Item added to cart!");
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const ensureCart = async (): Promise<string> => {
    const cart = await cartService.getCart({ storeUuid, userPhone: user!.phone }, token!);
    const newUuid = cart.cart.cart_uuid;
    localStorage.setItem(`cart:${storeUuid}:${user!.phone}`, newUuid);
    setCartUuid(newUuid);
    return newUuid;
  };

  return (
    <Button size="sm" onClick={handleAdd} disabled={loading}>
      {loading ? "Adding..." : "Add"}
    </Button>
  );
}
