// File: app/store/[storeUuid]/menu/page.tsx


import { cookies } from "next/headers";
import jwt from "jsonwebtoken"; // decode JWT on the server
import getMenuData from "@/lib/menu-service";
import MenuClient from "./MenuClient";
import type { StoreResponse } from "@/lib/store-service";
import storeService from "@/lib/store-service";

export default async function MenuPage({
  params,
}: {
  params: { storeUuid: string };
}) {

  const rawToken = cookies().get("auth_token")?.value || "";
  console.log(rawToken)

  let decodedToken: Record<string, any> | null = null;
  if (rawToken) {
    try {
      decodedToken = jwt.decode(rawToken) as Record<string, any>;
    } catch (err) {
      console.error("Failed to decode JWT:", err);
      decodedToken = null;
    }
  }

  // Example: you could pull out user_uuid or other claims here:
  const userUuid = decodedToken?.user_uuid ?? null;

  // 3. Fetch menu data (server-side) using the rawToken for authorization
  const { categories, products, dietaryPreferences } = await getMenuData(
    params.storeUuid,
    rawToken
  );

  // 4. Fetch store details (server-side) using the same rawToken
  const storeResponse: StoreResponse = await storeService.getStore(
    params.storeUuid,
    rawToken
  );
  const store = storeResponse.store;

  // 5. Pass decoded user info down to the client if needed
  return (
    <MenuClient
      store={store}
      categories={categories}
      products={products}
      dietPreferences={dietaryPreferences}
      // userUuid={userUuid} // optional: client can use this claim
    />
  );
}
