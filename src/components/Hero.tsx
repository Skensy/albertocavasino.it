"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useContent } from "@/lib/content-context";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const, delay: i * 0.15 },
  }),
};

export default function Hero() {
  const { hero, about, spacing } = useContent();

  return (
    <section id="home" className="relative min-h-screen flex items-center"
      style={{ paddingTop: 'var(--spacing-section-py)', paddingBottom: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          {/* Left: text */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="inline-block text-sm font-semibold text-accent mb-6 tracking-wider uppercase"
            >
              {hero.badge}
            </motion.div>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="font-sans text-6xl sm:text-7xl md:text-8xl font-bold text-brand-900 leading-[1.05] tracking-tight mb-6"
            >
              {hero.headingLine1}{" "}
              <span className="text-accent">{hero.headingAccent}</span>
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-base md:text-lg text-brand-500 max-w-xl leading-relaxed mb-10"
            >
              {hero.subtitle}
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <a href={hero.ctaHref} className="btn-primary">
                {hero.ctaText}
              </a>
              <a
                href="#about"
                className="btn-outline"
              >
                Scopri di pi&ugrave;
              </a>
            </motion.div>
          </div>

          {/* Right: portfolio mockup in glass card */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="shrink-0 w-full max-w-md lg:max-w-lg"
          >
            <div className="glass-card p-3">
              <div className="relative rounded-xl overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={hero.bgImage || "/images/portfolio-hero.png"}
                    alt={hero.bgAlt}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="animate-bounce" style={{ animationDuration: "3s" }}>
            <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
