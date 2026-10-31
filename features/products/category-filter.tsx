"use client";

import React from "react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  setSelectedCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`rounded-md px-4 py-2 text-sm ${
            selectedCategory === category
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}