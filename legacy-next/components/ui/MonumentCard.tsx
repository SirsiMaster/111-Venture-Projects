import { ReactNode } from "react";

interface MonumentCardProps {
  children: ReactNode;
  className?: string;
}

export default function MonumentCard({ children, className = "" }: MonumentCardProps) {
  return (
    <div className={`group relative flex flex-col h-full bg-ivory border border-gold-primary/30 shadow-[0_10px_30px_-5px_rgba(0,60,255,0.15)] transition-all duration-600 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-4 hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.2)] overflow-hidden ${className}`}>
      {/* Gold Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-br from-gold-primary via-gold-light to-gold-primary z-10" />
      {children}
    </div>
  );
}
