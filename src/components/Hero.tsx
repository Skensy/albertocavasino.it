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
  const { hero, about, site } = useContent();

  return (
    <section id="home" className="relative min-h-screen flex items-center py-24 md:py-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          {/* Left: text */}
          <div className="flex-1 text-center lg:text-left">
            {/* Emoji badge */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="inline-flex items-center gap-2 text-lg mb-6"
            >
              <span>💼</span>
              <span className="text-brand-400 text-sm font-medium">{hero.badge}</span>
              <span>🎤</span>
            </motion.div>

            {/* "I'm" + Name */}
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-4"
            >
              <span className="font-serif text-5xl md:text-6xl italic text-accent">
                I&rsquo;m
              </span>
            </motion.div>

            <motion.h1
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="font-sans text-6xl sm:text-7xl md:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-6"
            >
              {site.name}
            </motion.h1>

            <motion.p
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-base md:text-lg text-brand-400 max-w-xl leading-relaxed mb-10"
            >
              {hero.subtitle}
            </motion.p>

            {/* Two CTA buttons */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <a href={hero.ctaHref} className="btn-gradient inline-block">
                {hero.ctaText}
              </a>
              <a
                href="#about"
                className="text-white font-semibold rounded-xl px-8 py-4 transition-all duration-200 border border-white/20 hover:bg-white/5"
              >
                My Story
              </a>
            </motion.div>
          </div>

          {/* Right: portfolio mockup */}
          <motion.div
            custom={5}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="shrink-0 w-full max-w-md lg:max-w-lg"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-brand-800">
              <div className="aspect-[4/3] relative">
                <Image
                  src={about.photoUrl}
                  alt={about.photoAlt}
                  fill
                  className="object-cover opacity-80"
                  priority
                />
                {/* Portfolio overlay mockup */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 bg-black/60 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                    <div className="w-full h-2 bg-accent/40 rounded mb-3" />
                    <div className="w-2/3 h-2 bg-white/20 rounded mb-2" />
                    <div className="w-1/2 h-2 bg-white/10 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          custom={6}
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
