export default function MetricStrip() {
  const metrics = [
    { val: "2.5M+", lbl: "Lives Archived" },
    { val: "500y", lbl: "Data Durability" },
    { val: "$40B+", lbl: "Assets Secured" },
  ];

  return (
    <div className="bg-blue-deep text-ivory py-12 border-y-4 border-gold-primary">
      <div className="container mx-auto px-8 max-w-[1280px]">
        <div className="flex justify-around items-center">
          {metrics.map((m, i) => (
            <div key={i} className={`flex-1 text-center px-4 ${i !== metrics.length - 1 ? "border-r border-white/15" : ""}`}>
              <span className="block font-display text-5xl md:text-6xl text-gold-primary mb-2 leading-none">{m.val}</span>
              <span className="font-sans uppercase tracking-[0.15em] text-sm opacity-80">{m.lbl}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
