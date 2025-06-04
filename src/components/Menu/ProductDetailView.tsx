"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Plus, Minus, X,Star,Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import type { Product, CartItem, AddOn} from "@/lib/types"
import { RainbowButton } from "@/components/ui/rainbow-button"

interface ProductDetailViewProps {
  product: Product
  onClose: () => void
  onAddToCart: (item: CartItem) => void
}

export default function ProductDetailView({ product, onClose, onAddToCart }: ProductDetailViewProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const { scrollYProgress } = useScroll()
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 50])

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const toggleAddOn = (addOnUuid: string) => {
    const addOn = product.addOns.find((a) => a.addOnUuid === addOnUuid)
    if (!addOn) return

    setSelectedAddOns((prev) => {
      const currentCount = prev.filter((id) => id === addOnUuid).length

      if (prev.includes(addOnUuid)) {
        // Remove one instance
        const index = prev.indexOf(addOnUuid)
        return prev.filter((_, i) => i !== index)
      } else {
        // Add if under max limit
        if (currentCount < addOn.maxSelectable) {
          return [...prev, addOnUuid]
        }
        return prev
      }
    })
  }

  const getAddOnCount = (addOnUuid: string) => {
    return selectedAddOns.filter((id) => id === addOnUuid).length
  }

  const calculateTotalPrice = () => {
    let total = product.price * quantity

    selectedAddOns.forEach((addOnUuid) => {
      const addOn = product.addOns.find((a) => a.addOnUuid === addOnUuid)
      if (addOn) {
        total += addOn.price
      }
    })

    total += product.packagingCost * quantity
    return total.toFixed(2)
  }

  const handleAddToCart = () => {
    const item: CartItem = {
      product,
      quantity,
      selectedAddOns,
      totalPrice: Number.parseFloat(calculateTotalPrice()),
    }
    onAddToCart(item)
  }

  // const isVeg = product.dietaryPref.includes(DietaryPreference.VEG)
  const rating = 4.5 // You can add rating to your Product interface if needed
  const prepTime = 20 // You can add prepTime to your Product interface if needed

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <motion.div className="relative w-24 h-24 rounded-md overflow-hidden" style={{ y: imageY }}>
          <Image src={product.imageURL || "/placeholder.svg"} alt={product.name} fill className="object-cover" unoptimized />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className="text-muted-foreground mt-1">{product.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center bg-green-600 text-white text-xs px-1.5 py-0.5 rounded">
                <Star className="h-3 w-3 mr-0.5 fill-white" />
                {rating}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Utensils className="h-3 w-3" />
                <span>{prepTime} min</span>
              </div>
              {(
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                  <span className="h-2 w-2 rounded-full bg-green-600 mr-1"></span> {product.dietaryPref.map((dp) => dp.name).join(", ")}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="flex items-center border rounded-md">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={decrementQuantity}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={incrementQuantity}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <span className="font-medium">Base price: ${product.displayPrice.toFixed(2)}</span>
      </div>

      {product.addOns.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Add-ons</h4>
          <div className="space-y-2">
            {product.addOns
              .filter((addOn) => addOn.isAvailable)
              .map((addOn) => {
                const count = getAddOnCount(addOn.addOnUuid)
                const canAdd = count < addOn.maxSelectable

                return (
                  <motion.div
                    key={addOn.addOnUuid}
                    className={`flex items-center justify-between p-2 rounded-md ${
                      count > 0 ? "bg-primary/10 border border-primary/30" : "hover:bg-muted"
                    }`}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-normal cursor-pointer">
                          {addOn.name}
                          {addOn.isFree && <span className="text-green-600 ml-1">(Free)</span>}
                        </Label>
                        {count > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {count}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{addOn.isFree ? "Free" : `+$${addOn.price.toFixed(2)}`}</span>
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-none"
                          onClick={() => toggleAddOn(addOn.addOnUuid)}
                          disabled={count === 0}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-xs">{count}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-none"
                          onClick={() => toggleAddOn(addOn.addOnUuid)}
                          disabled={!canAdd}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
          </div>
        </div>
      )}

      <div className="sticky bottom-0 bg-background pt-4">
        <Separator className="mb-4" />
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Total price</p>
            <p className="text-2xl font-bold">${calculateTotalPrice()}</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <RainbowButton size="lg" className="gap-2" onClick={handleAddToCart}>
              <Plus className="h-4 w-4" /> Add to cart
            </RainbowButton>
          </motion.div>
        </div>
      </div>
    </div>
  )
}