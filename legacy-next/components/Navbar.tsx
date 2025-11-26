import Link from "next/link";
import { Columns } from "@phosphor-icons/react/dist/ssr"; // SSR import for icons
import Button from "./ui/Button";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full h-20 z-50 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-glass-sm flex items-center transition-all duration-300">
      <div className="container mx-auto px-8 flex justify-between items-center max-w-[1280px]">
        <Link href="#" className="font-display text-2xl font-bold text-blue-deep uppercase tracking-wider flex items-center gap-2">
          <Columns weight="fill" className="text-gold-primary" size={32} />
          Legacy<span className="text-gold-primary">OS</span>
        </Link>
        
        <div className="flex gap-10 items-center">
          <Link href="#problem" className="text-charcoal text-sm font-semibold uppercase tracking-wider hover:text-gold-primary transition-colors">The Problem</Link>
          <Link href="#solution" className="text-charcoal text-sm font-semibold uppercase tracking-wider hover:text-gold-primary transition-colors">Solution</Link>
          <Link href="#pricing" className="text-charcoal text-sm font-semibold uppercase tracking-wider hover:text-gold-primary transition-colors">Pricing</Link>
          
          <div className="flex gap-4">
            <Button variant="secondary" href="/app" className="!px-6 !py-3 text-xs">Log In</Button>
            <Button variant="primary" href="/app" className="!px-6 !py-3 text-xs">Start Free Trial</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
