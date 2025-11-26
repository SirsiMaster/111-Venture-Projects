import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function GlassCard({ children, className = "", noPadding = false }: GlassCardProps) {
  return (
    <div 
      className={`
        group relative flex flex-col h-full overflow-hidden rounded-none
        bg-white/60 backdrop-blur-xl 
        border border-white/40
        shadow-glass-card transition-all duration-500 ease-out
        hover:-translate-y-2 hover:shadow-glass-hover hover:bg-white/80
        ${className}
      `}
    >
      {/* Top Bevel Highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
      
      {/* Content Container */}
      <div className={`relative z-10 h-full ${noPadding ? 'p-0' : 'p-10'}`}>
        {children}
      </div>
    </div>
  );
}
