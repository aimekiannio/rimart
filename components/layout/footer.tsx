import Image from "next/image";
import Link from "next/link";
import { assetPath } from "@/lib/asset-path";

export function Footer() {
  return <footer className="site-footer" id="contact"><div className="footer-brand"><Image src={assetPath("galactic-logo.svg")} alt="GALACTIC" width={874} height={430} className="footer-logo" /></div><span>© {new Date().getFullYear()} GALACTIC<br />ALL RIGHTS RESERVED.</span><Link href="/#shop">Scroll to shop ↑</Link></footer>;
}
