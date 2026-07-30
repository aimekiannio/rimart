import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  Package,
  ShoppingCart,
  Store,
  User,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
};

export const mainNavItems: NavItem[] = [
  { label: "Products", href: "/products", icon: Package },
  { label: "Categories", href: "/categories", icon: LayoutGrid },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
];

export const authNavItems: NavItem[] = [
  { label: "Login", href: "/login", icon: User },
  { label: "Register", href: "/register" },
];

export const sellerNavItem: NavItem = {
  label: "Become a Seller",
  href: "/seller",
  icon: Store,
};

export const footerNavItems: NavItem[] = [
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Seller", href: "/seller" },
  { label: "About", href: "/" },
];
