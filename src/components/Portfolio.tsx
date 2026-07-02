"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useContent } from "@/lib/content-context";

const gridContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Portfolio() {
  const { portfolio, spacing } = useContent();

  return (
    <section id="portfolio" className="relative"
      style={{ paddingTop: 'var(--spacing-section-py)', paddingBottom: 'var(--spacing-section-py)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={cardItem}
          className="text-center"
          style={{ marginBottom: 'var(--spacing-section-header-mb)' }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-brand-900 mb-4 tracking-tight">
            {portfolio.title}
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto mb-6 rounded-full" />
          <p className="text-brand-500 max-w-xl mx-auto text-base md:text-lg">
            {portfolio.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3"
          style={{ gap: 'var(--spacing-section-gap)' }}
        >
          {portfolio.projects.map((project, i) => (
            <motion.div
              key={`${project.title}-${i}`}
              variants={cardItem}
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass-card p-3 overflow-hidden cursor-pointer group"
            >
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={project.src}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="px-1 py-4">
                <h3 className="text-brand-900 font-semibold text-sm tracking-tight">{project.title}</h3>
                <p className="text-brand-400 text-xs mt-0.5">{project.category}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Companies bar */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={cardItem}
          className="skills-bar p-4 md:p-6 mt-16 overflow-x-auto"
        >
          <div className="flex items-center gap-4 md:gap-6 min-w-max justify-center">
            <span className="text-sm text-brand-500 font-medium uppercase tracking-wider">
              Collaboro con
            </span>
            <svg className="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-brand-900 font-bold text-lg">Infosoft Srl</span>
            <svg className="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-brand-900 font-bold text-lg">Freelance</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
