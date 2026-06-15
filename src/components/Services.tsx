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
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Services() {
  const { services } = useContent();

  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={sectionVariants}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
            {services.title}
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto mb-6 rounded-full" />
          <p className="text-brand-400 max-w-xl mx-auto text-lg">
            {services.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {services.items.map((item, i) => (
            <motion.div
              key={`${item.title}-${i}`}
              variants={cardItem}
              whileHover={{ y: -4, borderColor: "var(--color-accent)" }}
              className="relative rounded-2xl border border-white/10 p-8 transition-all duration-300"
            >
              {/* Giant number */}
              <span
                className="absolute top-4 right-6 text-7xl md:text-8xl font-bold text-white/5 select-none pointer-events-none"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="relative">
                <div className="w-12 h-12 text-accent mb-6 service-icon-glow">
                  {renderServiceIcon(item.iconName)}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-brand-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
