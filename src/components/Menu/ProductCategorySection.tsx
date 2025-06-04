"use client"

import { motion } from "framer-motion"
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import ProductCard from "./ProductCard"
import type { Category, Product, DietaryPreference } from "@/lib/types"

interface ProductCategorySectionProps {
  category: Category
  products: Product[]
  index: number
  onProductClick: (product: Product) => void
  dietPreferences?: DietaryPreference[]
}

export default function ProductCategorySection({ category, products, index, onProductClick, dietPreferences }: ProductCategorySectionProps) {
  // Optionally filter products based on dietary preferences:
  const filteredProducts = dietPreferences
    ? products.filter((p) => p.dietaryPref.every((dp) => dietPreferences.map((d) => d.dietPrefUuid).includes(dp.dietPrefUuid)))
    : products

  return (
    <AccordionItem key={category.categoryUuid} value={category.categoryUuid} className="border rounded-lg overflow-hidden">
      <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-all">
        <motion.div className="flex items-center" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
          <h2 className="text-xl font-semibold">{category.name}</h2>
          <Badge className="ml-2" variant="outline">
            {filteredProducts.length}
          </Badge>
        </motion.div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 pt-2">
        <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.productUuid} product={product} onClick={() => onProductClick(product)} />
          ))}
        </motion.div>
      </AccordionContent>
    </AccordionItem>
  )
}