import Link from "next/link";
import { Columns } from "@phosphor-icons/react/dist/ssr";

export default function Footer() {
  return (
    <footer className="bg-blue-midnight text-white py-24 border-t-4 border-gold-primary">
      <div className="container mx-auto px-8 max-w-[1280px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="#" className="font-display text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-6">
              <Columns weight="fill" className="text-gold-primary" size={32} />
              Legacy<span className="text-gold-primary">OS</span>
            </Link>
            <p className="text-white/80 text-lg font-body max-w-md leading-relaxed">
              The operating system for life&apos;s final chapter. <br />
              Building the digital record of civilization.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-sans text-sm uppercase tracking-wider font-bold mb-6 border-b border-gold-primary inline-block pb-2">Platform</h4>
            <ul className="space-y-3 font-body text-white/70">
              <li><Link href="#" className="hover:text-gold-primary transition-colors">The Codex</Link></li>
              <li><Link href="#" className="hover:text-gold-primary transition-colors">The Vault</Link></li>
              <li><Link href="#" className="hover:text-gold-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
             <h4 className="text-white font-sans text-sm uppercase tracking-wider font-bold mb-6 border-b border-gold-primary inline-block pb-2">Company</h4>
             <ul className="space-y-3 font-body text-white/70">
               <li><Link href="#" className="hover:text-gold-primary transition-colors">Manifesto</Link></li>
               <li><Link href="#" className="hover:text-gold-primary transition-colors">Careers</Link></li>
               <li><Link href="#" className="hover:text-gold-primary transition-colors">Contact</Link></li>
             </ul>
          </div>
        </div>
        
        <div className="text-center pt-8 border-t border-white/20 text-white/50 text-sm font-body">
          &copy; 2025 Legacy Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
