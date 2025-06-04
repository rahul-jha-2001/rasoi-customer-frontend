"use client"

import React, { use, useState } from "react"
import { useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import cartService  from "@/lib/cart-service"
import  {useUser} from "@/lib/context/UserContext"
import type { Cart,CartItem,Product } from "@/lib/types"
import type { GetCartRequest } from "@/lib/types"

interface CartViewProps {
  cart : Cart
  products : Product[]
  onClose: () => void
}


const { user } = useUser()


export default function CartView({ cart, products, onClose }: CartViewProps) {
  // Ensure cart and products are available before rendering
  const [currentCart, setCart] = useState<Cart | null>(cart)
  const [currentProducts, setProducts] = useState<Product[] | null>(products)

  if (!cart || !products) {
    return null // or a loading state
  }

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 z-50 bg-background border-t shadow-lg rounded-t-xl max-h-[80vh] overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <Button variant="ghost" onClick={onClose}>                    
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="space-y-4">
          {cart.items.map((item: CartItem) => {
            const product = products.find(p => p.productUuid === item.productUuid)
            if (!product) return null

            return (
              <div key={item.cartItemUuid} className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center space-x-4">
                  <Image src={product.ImageUrl} alt={product.name} width={50} height={50} className="rounded-md" />
                  <div>
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <span className="text-lg font-bold">${(product.price * item.quantity).toFixed(2)}</span>
              </div>
            )
          }
          )}
          {cart.items.length === 0 && (
            <div className="text-center text-muted-foreground">
              <p>Your cart is empty.</p>
            </div>
          )}
          <div className="mt-4 flex justify-between items-center">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-xl font-bold">${cart.finalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </motion.div>
    )
}
