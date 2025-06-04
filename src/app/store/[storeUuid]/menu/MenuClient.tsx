// File: components/Menu/MenuClient.tsx
"use client"

import { useUser } from "@/lib/context/UserContext"
import OTPModal from "@/components/Auth/OTPModal"
import StoreInfoHeader from "@/components/Menu/StoreInfoHeader"
import MenuCatalog from "@/components/Menu/MenuCatalog"
import CartSummaryButton from "@/components/Menu/CartSummaryButton"
import type { Category, Product, Store, DietaryPreference } from "@/lib/types"
import { useState } from "react"

interface Props {
  store: Store
  categories: Category[]
  products: Product[]
  dietPreferences?: DietaryPreference[]
}

export default function MenuClient({ store, categories, products, dietPreferences }: Props) {
  const { user, loading } = useUser()

  if (loading || !user) {
    return <OTPModal open={true} onClose={() => {}} />
    
  }

  return (
    <div className="p-4 space-y-4">
      <StoreInfoHeader store={store} />
      <MenuCatalog categories={categories} products={products} dietPreferences={dietPreferences} />
      {/* <CartSummaryButton /> */}
    </div>
  )
}

