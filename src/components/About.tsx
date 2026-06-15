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
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function About() {
  const { about } = useContent();

  return (
    <section id="about" className="relative py-24 md:py-32 section-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid md:grid-cols-2 gap-12 md:gap-20 items-center"
        >
          <motion.div variants={itemFadeUp} className="flex justify-center md:justify-start">
            <div className="relative w-72 h-80 md:w-[380px] md:h-[480px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={about.photoUrl}
                alt={about.photoAlt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </motion.div>

          <motion.div variants={itemFadeUp}>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
              {about.title}
            </h2>
            <div className="w-16 h-1 bg-accent mb-8 rounded-full" />
            {about.paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-brand-700 leading-relaxed mb-4"
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}

            {/* Testimonial / citation */}
            <motion.div
              variants={itemFadeUp}
              className="border-l-2 border-accent pl-5 mt-8 mb-8"
            >
              <p className="text-lg text-brand-600 italic leading-relaxed">
                &ldquo;Il buon design &egrave; strategia, ascolto,
                capacit&agrave; di tradurre bisogni in soluzioni visive
                che funzionano.&rdquo;
              </p>
            </motion.div>

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
                  className="border border-white/10 rounded-lg px-4 py-3 text-sm font-medium text-brand-600 flex items-center gap-2"
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
