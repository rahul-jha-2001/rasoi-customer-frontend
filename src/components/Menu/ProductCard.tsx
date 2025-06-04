"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { Star, Utensils } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "./types"

interface ProductCardProps {
  product: Product
  onClick: () => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div ref={ref} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
      <Card className="overflow-hidden hover:shadow-md transition-all cursor-pointer" onClick={onClick}>
        <CardContent className="p-4">
          <motion.div className="flex gap-4" initial={false} animate={isInView ? { x: 0 } : { x: -50 }} transition={{ duration: 0.5 }}>
            <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              {product.isVeg && (
                <div className="absolute top-1 left-1">
                  <div className="h-4 w-4 rounded-full bg-white p-0.5">
                    <div className="h-full w-full rounded-full bg-green-600"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center bg-green-600 text-white text-xs px-1.5 py-0.5 rounded">
                      <Star className="h-3 w-3 mr-0.5 fill-white" />
                      {product.rating}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Utensils className="h-3 w-3" />
                      <span>{product.prepTime} min</span>
                    </div>
                    {product.bestSeller && <Badge className="bg-amber-500 hover:bg-amber-500 text-xs">Bestseller</Badge>}
                  </div>
                </div>
                <span className="font-medium">${product.price.toFixed(2)}</span>
              </div>
              <p className="text-muted-foreground text-sm line-clamp-2 mt-1">{product.description}</p>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}