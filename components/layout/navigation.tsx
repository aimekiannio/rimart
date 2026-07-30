import Link from "next/link";

import { Container } from "@/components/layout/container";
import { DesktopNav, MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { authNavItems, sellerNavItem } from "@/constants/navigation";
import { APP_NAME } from "@/constants/app";

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <MobileNav />
            <Link
              href="/"
              className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight text-primary"
            >
              {APP_NAME}
            </Link>
            <DesktopNav />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex"
              render={<Link href={sellerNavItem.href}>{sellerNavItem.label}</Link>}
            />
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
              render={<Link href={authNavItems[0].href}>{authNavItems[0].label}</Link>}
            />
            <Button
              size="sm"
              render={<Link href={authNavItems[1].href}>{authNavItems[1].label}</Link>}
            />
          </div>
        </div>
      </Container>
    </header>
  );
}
