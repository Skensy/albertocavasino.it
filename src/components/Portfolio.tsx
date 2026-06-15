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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

/** Bento layout: col-span-2 for featured projects */
function projectSpan(i: number): string {
  if (i === 0 || i === 3) return "sm:col-span-2";
  return "";
}

function projectAspect(i: number): string {
  if (i === 0 || i === 3) return "aspect-[16/9]";
  return "aspect-[4/5]";
}

export default function Portfolio() {
  const { portfolio } = useContent();
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);

  return (
    <section id="portfolio" className="relative py-24 md:py-32 section-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={sectionVariants}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
            {portfolio.title}
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto mb-6 rounded-full" />
          <p className="text-brand-600 max-w-xl mx-auto text-lg">
            {portfolio.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
        >
          {portfolio.projects.map((project, i) => (
            <motion.div
              key={`${project.title}-${i}`}
              variants={cardItem}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => {
                if (window.innerWidth < 640) {
                  setTappedIndex(tappedIndex === i ? null : i);
                }
              }}
              className={`group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 cursor-pointer ${projectSpan(i)}`}
            >
              <div className={`relative w-full ${projectAspect(i)}`}>
                <Image
                  src={project.src}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Always-visible bottom overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                <h3 className="text-white font-semibold text-sm md:text-base">
                  {project.title}
                </h3>
                <p className="text-white/60 text-xs mt-0.5">
                  {project.category}
                </p>
              </div>

              {/* Mobile tap overlay */}
              {tappedIndex === i && (
                <div className="absolute inset-0 bg-brand-900/30 backdrop-blur-[2px] sm:hidden" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
