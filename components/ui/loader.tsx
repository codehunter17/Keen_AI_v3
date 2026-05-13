"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  fullScreen?: boolean;
}

export function Loader({ className, fullScreen = true }: LoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-[#FDFCFB] dark:bg-background transition-colors duration-500",
        fullScreen
          ? "fixed inset-0 z-[100] h-screen w-screen"
          : "h-full w-full py-12",
        className,
      )}
    >
      <div className="relative">
        {/* Outer Rotating Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 rounded-full border-2 border-t-primary border-r-secondary/30 border-b-primary/10 border-l-secondary/50 "
        />

        {/* Pulsing Glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-8 rounded-full bg-primary/20 blur-2xl"
        />

        {/* Logo Container */}
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-20 h-20 rounded-full overflow-hidden shadow-2xl border border-white/20"
        >
          <Image
            src="/NutriLogo.svg"
            alt="NutriMama Logo"
            fill
            priority
            sizes="80px"
            className="object-cover"
          />
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 flex flex-col items-center space-y-2"
      >
        <span className="text-xl font-heading font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
          NutriMama
        </span>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-primary/40"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
