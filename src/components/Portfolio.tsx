"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useContent } from "@/lib/content-context";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const gridContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

export default function Portfolio() {
  const content = useContent();
  const { portfolio } = content;
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);

  return (
    <section id="portfolio" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={sectionVariants}
          className="text-center mb-14 md:mb-18"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-brand-900 mb-4">
            {portfolio.title}
          </h2>
          <div className="w-12 h-0.5 bg-accent mx-auto mb-4 rounded-full" />
          <p className="text-brand-600 max-w-xl mx-auto">
            {portfolio.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6"
        >
          {portfolio.projects.map((project, i) => (
            <motion.div
              key={`${project.title}-${i}`}
              variants={cardItem}
              onClick={() => {
                if (window.innerWidth < 768) {
                  setTappedIndex(tappedIndex === i ? null : i);
                }
              }}
              className="group relative block rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={project.src}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Overlay: hover desktop + tap mobile */}
              <div
                className={`absolute inset-0 transition-all duration-500 flex items-center justify-center ${
                  tappedIndex === i
                    ? "opacity-100 visible bg-brand-900/40 backdrop-blur-sm pointer-events-auto"
                    : "opacity-0 invisible md:group-hover:opacity-100 md:group-hover:visible bg-brand-900/40 backdrop-blur-sm pointer-events-none md:group-hover:pointer-events-auto"
                }`}
              >
                <span className="text-white text-sm font-medium border border-white/30 px-4 py-2 rounded-xl backdrop-blur-sm bg-white/10">
                  Vedi progetto
                </span>
              </div>

              {/* Tap hint on mobile */}
              {tappedIndex !== i && (
                <div className="absolute inset-0 flex items-center justify-center md:hidden">
                  <span className="text-white/40 text-xs border border-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm bg-white/5">
                    Tocca per vedere
                  </span>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                <h3 className="text-white font-semibold text-sm">
                  {project.title}
                </h3>
                <p className="text-white/60 text-xs mt-0.5">
                  {project.category}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
