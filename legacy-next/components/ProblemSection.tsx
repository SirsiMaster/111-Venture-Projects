import { Crown, Files, WarningCircle, UsersThree } from "@phosphor-icons/react/dist/ssr";
import GlassCard from "./ui/GlassCard";
import Reveal from "./ui/Reveal";

export default function ProblemSection() {
  return (
    <section id="problem" className="relative w-full py-24 z-10">
      {/* Ornamental Divider */}
      <div className="flex items-center justify-center mb-20 opacity-60">
        <div className="h-px bg-gold-primary w-24 mx-5" />
        <Crown weight="fill" className="text-gold-primary" size={32} />
        <div className="h-px bg-gold-primary w-24 mx-5" />
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
           <Reveal>
              <span className="block font-sans text-xs font-bold uppercase tracking-[0.2em] text-gold-dark mb-4 text-opacity-80">The Challenge</span>
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-blue-deep mb-4 tracking-tight-display leading-tight">The 500-Hour Problem</h2>
              <p className="text-base md:text-lg text-charcoal font-body leading-relaxed text-balance text-opacity-80">The average estate takes 18 months to settle. It&apos;s a second full-time job you didn&apos;t ask for.</p>
           </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
           <Reveal delay={0.1} className="h-full">
               <GlassCard className="h-full" noPadding>
                  <div className="relative h-40 w-full overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop" className="object-cover w-full h-full opacity-90 transition-transform duration-700 hover:scale-105" alt="Paperwork" />
                    <div className="absolute inset-0 bg-blue-deep/5 mix-blend-multiply" />
                  </div>
                  <div className="p-8 flex flex-col h-full relative z-10">
                     <Files weight="duotone" className="text-gold-primary mb-4" size={32} />
                     <h3 className="text-xl font-heading font-semibold text-blue-deep mb-3 tracking-tight">Paperwork Mountain</h3>
                     <p className="text-sm text-charcoal font-body leading-relaxed opacity-90">Death certificates, probate forms, tax returns (1040 & 706), and SSA-721 notifications. One mistake restarts the clock.</p>
                  </div>
               </GlassCard>
           </Reveal>
           
           <Reveal delay={0.2} className="h-full">
               <GlassCard className="h-full" noPadding>
                  <div className="relative h-40 w-full overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=800&auto=format&fit=crop" className="object-cover w-full h-full opacity-90 transition-transform duration-700 hover:scale-105" alt="Assets" />
                    <div className="absolute inset-0 bg-blue-deep/5 mix-blend-multiply" />
                  </div>
                  <div className="p-8 flex flex-col h-full relative z-10">
                     <WarningCircle weight="duotone" className="text-blue-royal mb-4" size={32} />
                     <h3 className="text-xl font-heading font-semibold text-blue-deep mb-3 tracking-tight">Asset Risk</h3>
                     <p className="text-sm text-charcoal font-body leading-relaxed opacity-90">Unclaimed accounts, forgotten crypto wallets, and subscription drains. $70B in assets go unclaimed every year.</p>
                  </div>
               </GlassCard>
           </Reveal>
           
           <Reveal delay={0.3} className="h-full">
               <GlassCard className="h-full" noPadding>
                  <div className="relative h-40 w-full overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?q=80&w=800&auto=format&fit=crop" className="object-cover w-full h-full opacity-90 transition-transform duration-700 hover:scale-105" alt="Conflict" />
                    <div className="absolute inset-0 bg-blue-deep/5 mix-blend-multiply" />
                  </div>
                  <div className="p-8 flex flex-col h-full relative z-10">
                     <UsersThree weight="duotone" className="text-bronze mb-4" size={32} />
                     <h3 className="text-xl font-heading font-semibold text-blue-deep mb-3 tracking-tight">Family Conflict</h3>
                     <p className="text-sm text-charcoal font-body leading-relaxed opacity-90">Lack of transparency leads to disputes. &quot;Who has the will?&quot; &quot;What did the lawyer say?&quot; Legacy keeps everyone aligned.</p>
                  </div>
               </GlassCard>
           </Reveal>
        </div>
      </div>
    </section>
  );
}
