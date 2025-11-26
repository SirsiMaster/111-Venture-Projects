import Reveal from "./ui/Reveal";

export default function SolutionSection() {
  const steps = [
    {
      title: "Intake & Discovery",
      desc: "Upload a death certificate. Our AI scans it and instantly generates your state-specific probate checklist."
    },
    {
      title: "Auto-Notification",
      desc: "We automatically notify the Social Security Administration, credit bureaus, and DMV to prevent fraud."
    },
    {
      title: "Asset Hunting",
      desc: "Connect bank accounts and emails. We hunt for recurring charges and hidden assets to ensure nothing is lost."
    },
    {
      title: "Distribution & Close",
      desc: "Generate the final accounting report for beneficiaries. Close the estate with confidence."
    }
  ];

  return (
    <section id="solution" className="py-20 relative z-10 bg-white/30 backdrop-blur-sm w-full">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <Reveal>
               <span className="block font-sans text-xs font-bold uppercase tracking-[0.2em] text-gold-dark mb-4">The Solution</span>
               <h2 className="text-3xl md:text-4xl font-display font-semibold text-blue-deep mb-6 tracking-tight-display leading-tight">From Chaos to Closure</h2>
               <p className="text-base text-charcoal mb-10 font-body leading-relaxed text-balance opacity-80">We replace the fragmented legal system with a linear, automated path.</p>
            </Reveal>

            <div className="flex flex-col gap-6">
              {steps.map((step, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="flex gap-5 group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display text-lg font-semibold shrink-0 transition-all duration-300 ${i === 0 ? 'bg-gold-primary text-white shadow-glass-sm' : 'border border-gold-primary/60 text-gold-primary bg-white/50 group-hover:bg-gold-primary group-hover:text-white'}`}>
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-semibold text-blue-deep mb-1 tracking-tight">{step.title}</h3>
                      <p className="text-sm text-charcoal font-body leading-relaxed opacity-90">{step.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 relative pl-0 lg:pl-12">
             <Reveal delay={0.4}>
                <div className="relative p-2 bg-white/40 backdrop-blur-xl rounded-sm shadow-glass-card border border-white/60">
                  {/* High Res Dashboard/App Shot */}
                  <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2560&auto=format&fit=crop" alt="Using Legacy App" className="w-full block shadow-none relative z-10 opacity-95" />
                  
                  {/* Floating Glass Caption */}
                  <div className="absolute -bottom-6 -left-6 bg-white/80 backdrop-blur-xl p-6 shadow-glass-hover max-w-xs border border-white/50 z-20">
                     <p className="font-display text-base italic text-blue-deep">"It feels like having a lawyer in your pocket."</p>
                  </div>
                </div>
             </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
