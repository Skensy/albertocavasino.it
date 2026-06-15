"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useContent } from "@/lib/content-context";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemFadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const itemFromLeft = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const itemFromRight = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function About() {
  const content = useContent();
  const { about } = content;

  return (
    <section id="about" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid md:grid-cols-2 gap-12 md:gap-16 items-center"
        >
          <motion.div variants={itemFromLeft} className="flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-xl ring-1 ring-white/20">
              <Image
                src={about.photoUrl}
                alt={about.photoAlt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

          <motion.div variants={itemFromRight}>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-brand-900 mb-6">
              {about.title}
            </h2>
            <div className="w-12 h-0.5 bg-accent mb-6 rounded-full" />
            {about.paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-brand-700 leading-relaxed mb-4"
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-3"
            >
              {about.skills.map((skill) => (
                <motion.div
                  key={skill.label}
                  variants={itemFadeUp}
                  className="glass-card rounded-xl px-3 py-2.5 text-sm font-medium text-brand-700 flex items-center gap-2"
                >
                  <span className="text-base">{skill.icon}</span>
                  <span>{skill.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
