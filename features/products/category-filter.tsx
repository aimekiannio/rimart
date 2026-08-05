type CategoryFilterProps = {
    categories: string[];
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
  };
  
  export function CategoryFilter({
    categories,
    selectedCategory,
    setSelectedCategory,
  }: CategoryFilterProps) {
    return (
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-lg border px-4 py-2 transition ${
              selectedCategory === category
                ? "bg-black text-white"
                : "bg-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    );
  }