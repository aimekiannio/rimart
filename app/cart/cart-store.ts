"use client";

import { create } from "zustand";

export type CartItem = {
  id: number;
  name: string;
  price: number;
};

type CartStore = {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
};

export const useCartStore = create<CartStore>((set) => ({
  cart: [],

  addToCart: (product) =>
    set((state) => ({
      cart: [...state.cart, product],
    })),
}));