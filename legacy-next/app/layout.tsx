import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Lora, Montserrat } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-body",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Legacy - The Digital Record of Civilization",
  description: "The operating system for life's final chapter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${cinzel.variable} ${cormorant.variable} ${lora.variable} ${montserrat.variable} antialiased bg-grey-soft text-charcoal w-full min-h-screen overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
