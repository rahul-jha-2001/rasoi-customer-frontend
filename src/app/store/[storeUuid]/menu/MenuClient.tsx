"use client";

import { useUser } from "@/lib/context/UserContext";
import OTPModal from "@/components/Auth/OTPModal";
import StoreInfoHeader from "@/components/Menu/StoreInfoHeader";
// import SearchBar from "@/components/Menu/SearchBar"; // ✅ Uncommented import
import MenuList from "@/components/Menu/MenuList";
import CartSummaryButton from "@/components/Menu/CartSummaryButton";
import { Category, Product, Store, DietaryPreference } from "@/lib/types";
import { Button } from "@/components/ui/button"
import { useState } from "react"



interface Props {
  store: Store;
  categories: Category[];
  products: Product[];
  dietPreferences?: DietaryPreference[];
}

export default function MenuClient({ store, categories, products, dietPreferences }: Props) {
  const { user, loading } = useUser();

  console.log("MenuClient rendered with user:", user);
  console.log("Loading state:", loading);



  if ( loading || !user) {
    return <OTPModal open={true} onClose={() => {}} />
  }
  

  return (
    <div className="p-4 space-y-4">
      <StoreInfoHeader store={store} />
      {/* <SearchBar products={products} /> ✅ Now this will work */}
      <MenuList categories={categories} products={products} />
      <CartSummaryButton />
    </div>
  );
}
