import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Separator } from "@/components/ui/separator";
import { footerNavItems } from "@/constants/navigation";
import { APP_COMPANY, APP_NAME } from "@/constants/app";
import { siteConfig } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <Container className="py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <p className="font-heading text-lg font-bold text-primary">
              {APP_NAME}
            </p>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">Quick Links</p>
            <ul className="space-y-2">
              {footerNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">Company</p>
            <p className="text-sm text-muted-foreground">
              Built by {APP_COMPANY}
            </p>
            <p className="text-sm text-muted-foreground">
              Empowering local businesses to go digital.
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-center text-sm text-muted-foreground">
          © {year} {APP_NAME} by {APP_COMPANY}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
