"use client"

import { cn } from "@/lib/utils"

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex border-b border-border">
        <button
          onClick={() => onCategoryChange(null)}
          className={cn(
            "px-3 sm:px-5 pb-2.5 pt-1 text-sm whitespace-nowrap transition-all duration-200 border-b-2 -mb-px",
            selectedCategory === null
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Todos
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "px-3 sm:px-5 pb-2.5 pt-1 text-sm whitespace-nowrap transition-all duration-200 border-b-2 -mb-px",
              selectedCategory === category
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
