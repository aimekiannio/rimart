import Image from "next/image";
import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { ProductList } from "@/features/products/product-list";
import { assetPath } from "@/lib/asset-path";

export default function HomePage() {
  return (
    <MainLayout>
      <main className="storefront">
        <section className="hero-shell" aria-label="GALACTIC collection">
          <div className="hero-orbit" aria-hidden="true" />
          <span className="hero-spark hero-spark-one" aria-hidden="true" />
          <span className="hero-spark hero-spark-two" aria-hidden="true" />
          <div className="hero-stamp"><span>EST. 2026</span><i /></div>
          <div className="hero-copy">
            <p>LESS,<br />BUT BETTER.</p>
            <Link href="#shop" className="button button-dark">Explore store <span aria-hidden="true">→</span></Link>
          </div>
          <div className="hero-brand">
            <Image src={assetPath("galactic-logo.png")} alt="GALACTIC" width={794} height={410} priority className="hero-logo" />
            <p>FASHION <span>/</span> ACCESSORIES <span>/</span> ELECTRONICS</p>
          </div>
          <div className="hero-caption">GALACTIC // <br />SHOP SMARTER.<i /></div>
          <div className="hero-pagination" aria-hidden="true"><i className="current" /><i /><i /></div>
        </section>
        <ProductList />
        <section className="about-strip" id="about"><span className="about-spark" aria-hidden="true">✦</span><p>LESS, BUT BETTER.</p><span>Good things for your orbit.</span></section>
      </main>
    </MainLayout>
  );
}
