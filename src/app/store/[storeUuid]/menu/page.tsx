import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import getMenuData from "@/lib/menu-service";
import storeService from "@/lib/store-service";
import MenuClient from "./MenuClient";
import type { StoreResponse } from "@/lib/store-service";
export default async function MenuPage(props: { params: { storeUuid: string } }) {
  const { storeUuid } =  await props.params;

  const cookieStore = await cookies(); // no need to `await` cookies() in Next 13/14 App Router
  const sessionToken =  cookieStore.get("session")?.value || null;

  let jwtToken: string | null = null;
  let decodedToken: Record<string, any> | null = null;

  if (sessionToken) {
    try {
      const jwtRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/customer/jwt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_token: sessionToken }),
        cache: "no-store",
      });

      if (jwtRes.ok) {
        const data = await jwtRes.json();
        jwtToken = data.token;
        decodedToken = jwt.decode(jwtToken) as Record<string, any>;
      } else {
        console.warn("JWT fetch failed with status:", jwtRes.status);
      }
    } catch (err) {
      console.error("Error fetching JWT:", err);
    }
  }

  const user_phone_number = decodedToken?.user_phone_number ?? null;
  const name = decodedToken?.name ?? null;

  const [menuData, storeResponse] = await Promise.all([
    getMenuData(storeUuid, jwtToken || ""),
    storeService.getStore(storeUuid, jwtToken || ""),
  ]);

  const { categories, products, dietaryPreferences } = menuData;
  const store = storeResponse.store;

  return (
    <MenuClient
      store={store}
      categories={categories}
      products={products}
      dietPreferences={dietaryPreferences}
      session_token={sessionToken}
      jwt_token={jwtToken}
      user_phone_number={user_phone_number}
      name={name}
    />
  );
}
