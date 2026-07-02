"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useContent } from "@/lib/content-context";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { nav, site } = useContent();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-nav-scrolled" : "glass-nav-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="#home" className="text-xl font-bold text-brand-900 tracking-tight">
            {site.name}
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {nav.map((link, i) => (
              <a
                key={`${link.label}-${i}`}
                href={link.href}
                className="relative text-sm font-medium text-brand-500 hover:text-brand-900 transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full w-0 rounded-full" />
              </a>
            ))}
          </nav>

          <button
            className="md:hidden flex flex-col gap-1.5 p-2 relative z-10"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span className={`block w-6 h-[1.5px] bg-brand-900 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[3.5px]" : ""}`} />
            <span className={`block w-6 h-[1.5px] bg-brand-900 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-[1.5px] bg-brand-900 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
          </button>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: menuOpen ? "auto" : 0 }}
        className="md:hidden overflow-hidden"
      >
        <nav className="mx-4 mb-4 px-4 py-5 flex flex-col gap-4 rounded-2xl glass-panel">
          {nav.map((link, i) => (
            <a
              key={`${link.label}-${i}`}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-base font-medium text-brand-600 hover:text-brand-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </motion.div>
    </header>
  );
}
