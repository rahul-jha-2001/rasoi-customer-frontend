// src/app/cart/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import cartService from "@/lib/server/cart-service";
import CartPage from "@/components/Cart/CartPage";

export default async function CartPageWrapper() {
  const token = cookies().get("auth_token")?.value;
  const storeUuid = cookies().get("store_uuid")?.value;
  const phone = cookies().get("phone")?.value;

  if (!token || !storeUuid || !phone) redirect("/");

  const res = await cartService.getCart({ storeUuid, userPhone: phone }, token);
  const cart = res.cart;

  return <CartPage cart={cart} storeUuid={storeUuid} token={token} userPhone={phone} />;
}
