"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// Single-shot splash on first load — sets a flag in sessionStorage so it
// doesn't replay on every nav. Used on root marketing page only.
export function Splash() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("nm-splash-seen")) return;
    sessionStorage.setItem("nm-splash-seen", "1");
    setShow(true);
    const t = setTimeout(() => setShow(false), 1700);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center"
          >
            <div className="mx-auto h-20 w-20 rounded-3xl surface-premium lift-strong flex items-center justify-center">
              <span className="font-heading text-3xl text-primary">N</span>
            </div>
            <h1 className="mt-4 font-heading text-3xl text-primary tracking-tight">
              NutriMama
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Women's health · made for India
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
