"use client";

import { useMemo, useState } from "react";
import { Headphones, Shirt, Sparkles } from "lucide-react";
import { products } from "./data";
import { ProductCard } from "./product-card";

const categories = [
  { name: "Clothing", title: "CLOTHING", subtitle: "Wear the vision.", icon: Shirt },
  { name: "Accessories", title: "ACCESSORIES", subtitle: "Complete your look.", icon: Sparkles },
  { name: "Electronics", title: "ELECTRONICS", subtitle: "Power your world.", icon: Headphones },
  { name: "All", title: "VIEW ALL", subtitle: "Shop smarter.", icon: Sparkles },
] as const;

export function ProductList() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesCategory && product.name.toLowerCase().includes(search.toLowerCase().trim());
  }), [search, selectedCategory]);

  return (
    <>
      <section className="category-strip" aria-label="Shop categories">
        {categories.map(({ name, title, subtitle, icon: Icon }) => (
          <button className={`category-item${selectedCategory === name ? " selected" : ""}`} key={name} type="button" onClick={() => setSelectedCategory(name)} aria-pressed={selectedCategory === name}>
            <Icon className="category-icon" size={37} strokeWidth={1.55} />
            <span className="category-copy"><strong>{title}</strong><small>{subtitle}</small></span>
          </button>
        ))}
      </section>
      <section className="catalog-section" id="shop">
        <div className="catalog-heading"><h2>FEATURED PRODUCTS</h2><span className="heading-rule" /><span className="catalog-star" aria-hidden="true">✦</span></div>
        <div className="catalog-tools">
          <p>{selectedCategory === "All" ? "Explore the Galactic essentials." : `Shop ${selectedCategory.toLowerCase()}.`}</p>
          <label><span className="sr-only">Search products</span><input className="search-field" type="search" placeholder="Search products" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
        </div>
        {filteredProducts.length ? <div className="product-grid">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p>No pieces found. Try another search.</p>}
      </section>
    </>
  );
}
