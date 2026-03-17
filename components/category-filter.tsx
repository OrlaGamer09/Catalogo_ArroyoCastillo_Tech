"use client"

import { cn } from "@/lib/utils"

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => onCategoryChange(null)}
        className={cn(
          "px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300",
          selectedCategory === null
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            : "bg-secondary text-secondary-foreground hover:bg-muted"
        )}
      >
        Todos
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={cn(
            "px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300",
            selectedCategory === category
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              : "bg-secondary text-secondary-foreground hover:bg-muted"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
