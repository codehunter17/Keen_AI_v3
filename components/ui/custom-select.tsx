"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const CustomSelect = ({
  value,
  onChange,
  options,
  icon,
  className,
  placeholder = "Select...",
  disabled = false,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full p-4 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium flex items-center justify-between group text-left shadow-sm",
          disabled ? "opacity-60 cursor-not-allowed bg-muted" : "hover:border-primary/30"
        )}
      >
        <div className="flex items-center space-x-3 overflow-hidden">
          {icon && (
            <div className={cn(
              "text-muted-foreground transition-colors shrink-0",
              !disabled && "group-hover:text-primary"
            )}>
              {icon}
            </div>
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        {!disabled && (
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-300 shrink-0",
              isOpen && "rotate-180",
            )}
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute z-[100] w-full mt-1 bg-card/80 border border-border rounded-2xl shadow-2xl overflow-hidden py-2 backdrop-blur-2xl"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-5 py-3 text-sm font-medium transition-all flex items-center justify-between",
                    value === opt.value
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/50 text-foreground",
                  )}
                >
                  <span className="truncate mr-2">{opt.label}</span>
                  {value === opt.value && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
