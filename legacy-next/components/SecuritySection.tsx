import { ShieldCheck, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import Reveal from "./ui/Reveal";

export default function SecuritySection() {
  return (
    <section className="relative w-full py-24 z-10">
      <div className="container mx-auto px-8 max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           {/* Left: Badge */}
           <Reveal>
              <div className="border border-white/60 p-8 relative flex flex-col items-center text-center bg-white/60 backdrop-blur-xl shadow-glass-card transition-all duration-500 hover:shadow-glass-hover hover:-translate-y-1">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-primary to-transparent opacity-80" />
                <ShieldCheck weight="duotone" className="text-blue-deep mb-6 drop-shadow-sm" size={128} />
                <h3 className="text-2xl font-display font-bold text-blue-deep mb-2 tracking-tight">Bank-Grade Security</h3>
                <p className="text-charcoal text-sm font-sans tracking-wider uppercase opacity-80">Verified & Monitored 24/7</p>
              </div>
           </Reveal>

           {/* Right: Content */}
           <div>
             <Reveal delay={0.2}>
                <span className="block font-sans uppercase tracking-[0.2em] text-gold-dark mb-6 font-semibold">Security</span>
                <h2 className="text-4xl md:text-5xl font-display font-semibold text-blue-deep mb-6 tracking-tight-display">Fort Knox for your Family Data</h2>
                <p className="text-lg text-charcoal mb-8 font-body leading-relaxed text-balance">We deal with the most sensitive documents in your life. We treat them accordingly.</p>
             </Reveal>
             
             <ul className="space-y-6">
               <li className="flex gap-4 items-start group">
                 <Reveal delay={0.3} className="flex gap-4 items-start w-full p-4 rounded-lg transition-colors hover:bg-white/40">
                     <CheckCircle weight="fill" className="text-gold-primary shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300" size={32} />
                     <div>
                       <strong className="block font-heading text-xl text-blue-deep mb-1 tracking-tight">AES-256 Encryption</strong>
                       <p className="text-base text-charcoal font-body leading-relaxed opacity-90">Data is encrypted at rest and in transit. Even we can&apos;t see your documents.</p>
                     </div>
                 </Reveal>
               </li>
               <li className="flex gap-4 items-start group">
                 <Reveal delay={0.4} className="flex gap-4 items-start w-full p-4 rounded-lg transition-colors hover:bg-white/40">
                     <CheckCircle weight="fill" className="text-gold-primary shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300" size={32} />
                     <div>
                       <strong className="block font-heading text-xl text-blue-deep mb-1 tracking-tight">Role-Based Access</strong>
                       <p className="text-base text-charcoal font-body leading-relaxed opacity-90">Share funeral plans with your sister, but keep bank details private.</p>
                     </div>
                 </Reveal>
               </li>
               <li className="flex gap-4 items-start group">
                 <Reveal delay={0.5} className="flex gap-4 items-start w-full p-4 rounded-lg transition-colors hover:bg-white/40">
                     <CheckCircle weight="fill" className="text-gold-primary shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300" size={32} />
                     <div>
                       <strong className="block font-heading text-xl text-blue-deep mb-1 tracking-tight">SOC2 Type II Compliant</strong>
                       <p className="text-base text-charcoal font-body leading-relaxed opacity-90">Audited security controls and processes.</p>
                     </div>
                 </Reveal>
               </li>
             </ul>
           </div>
        </div>
      </div>
    </section>
  );
}
