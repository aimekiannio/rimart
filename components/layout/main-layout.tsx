import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";

type MainLayoutProps = {
  children: ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
