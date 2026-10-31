export type Product = {
  id: number;
  name: string;
  price: number;
  category: "Clothing" | "Accessories" | "Electronics";
  image: string;
  badge: string;
};

export const products: Product[] = [
  { id: 1, name: "GALACTIC Tee", price: 999, category: "Clothing", image: "/orbit-tee.png", badge: "New" },
  { id: 2, name: "GALACTIC Hoodie", price: 1999, category: "Clothing", image: "/orbit-hoodie.png", badge: "Bestseller" },
  { id: 3, name: "GALACTIC Cap", price: 799, category: "Accessories", image: "/orbit-cap.png", badge: "Hot" },
  { id: 4, name: "GALACTIC Earbuds", price: 2499, category: "Electronics", image: "/orbit-earbuds.png", badge: "Trending" },
];
