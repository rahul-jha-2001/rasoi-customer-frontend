"use client";

import { useEffect } from "react";
import { useUser } from "@/lib/context/UserContext";
import OTPModal from "@/components/Auth/OTPModal";
import StoreInfoHeader from "@/components/Menu/StoreInfoHeader";
import MenuCatalog from "@/components/Menu/MenuCatalog";
import type { Category, Product, Store, DietaryPreference } from "@/lib/types";

interface Props {
  store: Store;
  categories: Category[];
  products: Product[];
  dietPreferences?: DietaryPreference[];
  session_token: string | null;
  jwt_token: string | null;
  user_phone_number?: string;
  name?: string;
}

export default function MenuClient({
  store,
  categories,
  products,
  dietPreferences,
  session_token,
  jwt_token,
  user_phone_number,
  name,
}: Props) {
  const { user, setUser, loading } = useUser();

  useEffect(() => {
    if (!user && jwt_token) {
      setUser({
        token: jwt_token,
        phone: user_phone_number ?? null,
        name: name ?? null,
      });
    }
  }, [user, jwt_token, session_token, user_phone_number, name, setUser]);

  // if (loading || !user) {
  //   return <OTPModal open={true} onClose={() => {}} />;
  // }

  return (
    <div className="p-4 space-y-4">
      <StoreInfoHeader store={store} />
      <MenuCatalog
        categories={categories}
        products={products}
        dietPreferences={dietPreferences}
      />
    </div>
  );
}
