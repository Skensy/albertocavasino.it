"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useContent } from "@/lib/content-context";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const, delay: i * 0.2 },
  }),
};

export default function Hero() {
  const content = useContent();
  const { hero, about } = content;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center py-20 md:py-0"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Left column — text */}
          <div className="flex-1 text-center md:text-left">
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="inline-block border border-accent/30 rounded-full px-5 py-2 text-sm text-brand-600 mb-8"
            >
              {hero.badge}
            </motion.div>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-brand-900 leading-[1.05] tracking-tight mb-6"
            >
              {hero.headingLine1}{" "}
              <span className="text-accent">{hero.headingAccent}</span>
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-base md:text-lg text-brand-600 max-w-xl leading-relaxed mb-8"
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
              <a
                href={hero.ctaHref}
                className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl px-8 py-4 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {hero.ctaText}
              </a>
              <a
                href="#about"
                className="border border-accent/40 text-accent hover:bg-accent/5 font-semibold rounded-xl px-8 py-4 transition-all duration-200"
              >
                Scopri di pi&ugrave;
              </a>
            </motion.div>
          </div>

          {/* Right column — profile photo */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="shrink-0"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-96 lg:w-96 lg:h-[420px] rounded-3xl overflow-hidden shadow-2xl ring-4 ring-accent/30">
              <Image
                src={about.photoUrl}
                alt={about.photoAlt}
                fill
                className="object-cover"
                priority
              />
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
            <svg
              className="w-5 h-5 text-brand-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
