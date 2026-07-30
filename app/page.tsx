import Link from "next/link";

import { MainLayout } from "@/components/layout/main-layout";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { headingVariants, textVariants } from "@/styles/typography";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <MainLayout>
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-secondary/30 via-background to-background">
        <Container className="py-20 sm:py-28 lg:py-32">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <p className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-sm font-medium text-primary">
              Product-first local commerce
            </p>
            <h1 className={headingVariants({ level: "h1" })}>
              {siteConfig.tagline}
            </h1>
            <p className={`mt-6 max-w-2xl ${textVariants({ variant: "lead" })}`}>
              {siteConfig.description}
            </p>
            <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                render={<Link href="/products">Explore Products</Link>}
              />
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
                render={<Link href="/seller">Become a Seller</Link>}
              />
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}
