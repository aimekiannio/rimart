"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authNavItems, mainNavItems, sellerNavItem } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/constants/app";

function NavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        isActive ? "text-primary" : "text-muted-foreground",
      )}
    >
      {label}
    </Link>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        }
      />
      <SheetContent side="left" className="w-[300px] sm:w-[340px]">
        <SheetHeader>
          <SheetTitle>{APP_NAME}</SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-4">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              onClick={close}
            />
          ))}
          <NavLink
            href={sellerNavItem.href}
            label={sellerNavItem.label}
            onClick={close}
          />
          <div className="my-2 h-px bg-border" />
          {authNavItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              onClick={close}
            />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function DesktopNav() {
  return (
    <nav className="hidden items-center gap-6 md:flex">
      {mainNavItems.map((item) => (
        <NavLink key={item.href} href={item.href} label={item.label} />
      ))}
    </nav>
  );
}
