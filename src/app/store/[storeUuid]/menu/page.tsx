import { cookies } from "next/headers";
import getMenuData from "@/lib/menu-service";
import MenuClient from "./MenuClient";
import {StoreResponse} from "@/lib/store-service";
import storeService from "@/lib/store-service";

export default async function MenuPage({ params }: { params: { storeUuid: string } }) {
  const token = cookies().get("auth_token")?.value || "";
  const { categories, products, dietaryPreferences } = await getMenuData(params.storeUuid, token);
  const storeResponse: StoreResponse = await storeService.getStore(params.storeUuid, token);
  const store = storeResponse.store;

  return (
    <MenuClient store={store} categories={categories} products={products} dietPreferences={dietaryPreferences} />
  );
}
