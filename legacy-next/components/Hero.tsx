import Button from "./ui/Button";
import Reveal from "./ui/Reveal";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center pt-[100px] pb-16 overflow-hidden bg-transparent">
       {/* Background Image with Gradient */}
       <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center opacity-90" />
         <div className="absolute inset-0 bg-gradient-to-r from-[#F5F5F7] via-[#F5F5F7]/90 to-[#F5F5F7]/10" />
       </div>

       <div className="w-full max-w-[1440px] mx-auto px-6 md:px-8 relative z-10 h-full">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-full">
           <div className="lg:col-span-5 flex flex-col justify-center">
             <Reveal>
                <span className="block font-sans text-xs font-bold uppercase tracking-[0.2em] text-gold-dark mb-6 opacity-90">The Permanent Digital Archive</span>
             </Reveal>
             <Reveal delay={0.1}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-blue-deep leading-[1.1] tracking-tight-display text-balance mb-6">
                  The Operating System for Life’s <span className="text-gold-primary">Final Chapter</span>
                </h1>
             </Reveal>
             <Reveal delay={0.2}>
                <p className="text-base md:text-lg text-charcoal mb-8 leading-relaxed font-body text-balance opacity-80 max-w-lg">
                  When a loved one passes, the world doesn&apos;t stop. Legacy automates the 500+ hours of administrative burden—from government filings to asset security—so you can focus on what matters.
                </p>
             </Reveal>
             <Reveal delay={0.3}>
                <div className="flex gap-4">
                  <Button href="/app" className="!px-8 !py-4 text-xs">Start Free Trial</Button>
                  <Button variant="secondary" href="#solution" className="!px-8 !py-4 text-xs">Watch the Film</Button>
                </div>
             </Reveal>
           </div>

           <div className="lg:col-span-7 relative h-full min-h-[500px] flex items-center">
              <Reveal delay={0.4} className="w-full">
                <div className="relative w-full aspect-[16/10] md:aspect-[16/9] lg:aspect-auto lg:h-[600px]">
                  <div className="absolute inset-0 bg-white/30 backdrop-blur-md rounded-sm shadow-glass-card border border-white/40 p-2 transform rotate-1 lg:translate-x-8">
                    <img 
                      src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2560&auto=format&fit=crop" 
                      alt="Intergenerational Connection" 
                      className="w-full h-full object-cover shadow-sm rounded-[1px]"
                    />
                  </div>
                  {/* Decorative offset frame */}
                  <div className="absolute -inset-4 border border-gold-primary/20 -z-10 rounded-sm hidden lg:block" />
                </div>
              </Reveal>
           </div>
         </div>
       </div>
    </section>
  );
}
