"use client"

import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { CheckboxWithLabel } from "@/components/ui/checkbox"
import { Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { FilterOptions } from "./types"

interface SearchAndFilterProps {
  onSearch: (query: string) => void
  onFilter: (filters: FilterOptions) => void
}

export function SearchAndFilter({ onSearch, onFilter }: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50])
  const [dietary, setDietary] = useState<string[]>([])

  const debouncedSearch = useCallback(
    debounce((query: string) => onSearch(query), 300),
    []
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  const handleFilterChange = () => {
    onFilter({ priceRange, dietary })
  }

  const toggleDietary = (value: string) => {
    setDietary((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="flex gap-2">
        <Input type="search" placeholder="Search menu..." value={searchQuery} onChange={handleSearchChange} className="flex-grow" />
        <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="space-y-4 overflow-hidden">
            <div>
              <label className="text-sm font-medium">Price Range</label>
              <Slider min={0} max={50} step={1} value={priceRange} onValueChange={setPriceRange} />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Dietary Options</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <CheckboxWithLabel label="Vegetarian" checked={dietary.includes("vegetarian")} onCheckedChange={() => toggleDietary("vegetarian")} />
                <CheckboxWithLabel label="Vegan" checked={dietary.includes("vegan")} onCheckedChange={() => toggleDietary("vegan")} />
                <CheckboxWithLabel label="Gluten-Free" checked={dietary.includes("gluten-free")} onCheckedChange={() => toggleDietary("gluten-free")} />
                <CheckboxWithLabel label="Dairy-Free" checked={dietary.includes("dairy-free")} onCheckedChange={() => toggleDietary("dairy-free")} />
              </div>
            </div>

            <Button onClick={handleFilterChange} className="w-full">Apply Filters</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}