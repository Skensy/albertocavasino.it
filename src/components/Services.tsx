"use client";

import { motion } from "framer-motion";
import { useContent } from "@/lib/content-context";
import { renderServiceIcon } from "@/lib/icons";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const gridContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Services() {
  const content = useContent();
  const { services } = content;

  return (
    <section id="services" className="relative py-20 md:py-28 section-fade-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={sectionVariants}
          className="text-center mb-14 md:mb-18"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-brand-900 mb-4">
            {services.title}
          </h2>
          <div className="w-12 h-0.5 bg-accent mx-auto mb-4 rounded-full" />
          <p className="text-brand-600 max-w-xl mx-auto">
            {services.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {services.items.map((item, i) => (
            <motion.div
              key={`${item.title}-${i}`}
              variants={cardItem}
              whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass-card rounded-2xl p-6 md:p-8"
            >
              <motion.div
                className="text-accent mb-4 service-icon-glow"
                whileHover={{ scale: 1.15 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {renderServiceIcon(item.iconName)}
              </motion.div>
              <h3 className="text-lg font-semibold text-brand-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-brand-600 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
