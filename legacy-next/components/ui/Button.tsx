import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  variant?: "primary" | "secondary";
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Button({
  variant = "primary",
  href,
  children,
  className = "",
  onClick,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center px-10 py-5 font-sans text-sm font-semibold uppercase tracking-[0.1em] transition-all duration-400 ease-out relative overflow-hidden";

  const variants = {
    primary:
      "bg-blue-deep text-white border border-blue-deep hover:bg-blue-royal hover:shadow-[0_10px_20px_rgba(0,60,255,0.15)] group",
    secondary:
      "bg-transparent text-blue-deep border border-gold-primary hover:bg-gold-light",
  };

  const shimmer =
    variant === "primary" ? (
      <span className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover:left-full" />
    ) : null;

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {shimmer}
        <span className="relative z-10">{children}</span>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={combinedClassName}>
      {shimmer}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
