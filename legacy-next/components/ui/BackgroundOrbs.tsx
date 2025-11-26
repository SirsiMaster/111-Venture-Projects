"use client";

import { motion } from "framer-motion";

export default function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-grey-soft">
      {/* Primary Blue Orb - Top Left */}
      <motion.div
        className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-deep/5 blur-[120px]"
        animate={{
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Gold Warmth - Center Right */}
      <motion.div
        className="absolute top-[30%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-gold-primary/5 blur-[100px]"
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Deep Anchor - Bottom Left */}
      <motion.div
        className="absolute -bottom-[10%] left-[10%] w-[45vw] h-[45vw] rounded-full bg-blue-royal/5 blur-[120px]"
        animate={{
          y: [0, 40, 0],
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Noise Texture overlay for film grain feel */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
    </div>
  );
}
