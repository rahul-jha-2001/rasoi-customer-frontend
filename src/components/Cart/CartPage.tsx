// src/components/Cart/CartPage.tsx
"use client";

import CartItemCard from "./CartItemCard";
import CartSummary from "./CartSummary";
import cartService from "@/lib/cart-service";

export default function CartPage({ cart, storeUuid, userPhone, token }: Props) {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Your Cart</h1>

      {cart.items.map((item) => (
        <CartItemCard
          key={item.cart_item_uuid}
          item={item}
          storeUuid={storeUuid}
          userPhone={userPhone}
          cartUuid={cart.cart_uuid}
          token={token}
        />
      ))}

      <CartSummary cart={cart} />
    </div>
  );
}
