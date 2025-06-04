// File: components/MenuCatalog/MenuCatalog.tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, X, Star, Utensils, ShoppingCart, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { useEffect } from "react"
import { useUser } from "@/lib/context/UserContext"
import ProductCategorySection from "./ProductCategorySection"
import ProductDetailView from "@/components/Menu/ProductDetailView"
import CartView from "@/components/Cart/CartView"
import { RainbowButton } from "@/components/ui/rainbow-button"
import next from "next"
import type { Product, CartItem, Category, DietaryPreference, Cart } from "@/lib/types"

interface MenuCatalogProps {
  categories: Category[]
  products: Product[]
  dietPreferences?: DietaryPreference[]
}

export default function MenuCatalog({ categories, products, dietPreferences }: MenuCatalogProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cart, setCart] = useState<Cart|null>(null)
  const { user } = useUser()
  const [isCartOpen, setIsCartOpen] = useState(false)

  const openProductDetails = (product: Product) => setSelectedProduct(product)
  const closeProductDetails = () => setSelectedProduct(null)
  const toggleCart = () => setIsCartOpen((prev) => !prev)

  useEffect(() => {
    // Fetch the cart and products if they are not passed as props
    const createCart = async () => {
      const response = await fetch("/api/cart/createCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          storeUuid: cart?.storeUuid,
          userPhoneNo: user?.phoneNumber,
          
        }),
      })

      if (!response.ok) {
        console.error("Failed to create cart")
        return
      }

      const fetchedCart = await response.json()
      setCart(fetchedCart.cart)
    }

    if (!cart) createCart()
  }, [])


  return (
    <div className="container mx-auto py-6 px-4 md:px-6 relative">

      <motion.h1 className="text-3xl font-bold mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        Food Menu
      </motion.h1>

      <Accordion type="multiple" className="w-full space-y-4">
        {categories.map((category, index) => (
          <ProductCategorySection
            key={category.categoryUuid}
            category={category}
            products={products.filter((p) => p.category.categoryUuid === category.categoryUuid)}
            index={index}
            onProductClick={openProductDetails}
            // dietPreferences={dietPreferences}
          />
        ))}
      </Accordion>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed inset-x-0 bottom-0 z-50 bg-background border-t shadow-lg rounded-t-xl max-h-[80vh] overflow-y-auto">
            <ProductDetailView product={selectedProduct} onClose={closeProductDetails} onAddToCart={addToCart} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed inset-y-0 right-0 z-50 bg-background border-l shadow-lg w-full max-w-md overflow-y-auto">
            <CartView cart={cart} products={products} onClose={toggleCart} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="fixed bottom-4 right-4 z-40" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <RainbowButton size="lg" className="rounded-full w-16 h-16 shadow-lg" onClick={toggleCart}>
          <ShoppingCart className="h-6 w-6" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {cartItems.length}
            </span>
          )}
        </RainbowButton>
      </motion.div>
    </div>
  )
}
