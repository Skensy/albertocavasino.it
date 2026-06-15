"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useContent } from "@/lib/content-context";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stats = [
  { number: "5+", label: "Years of Design<br/>Experience" },
  { number: "50+", label: "Overall Global<br/>Customers" },
  { number: "90+", label: "Projects I Have<br/>Worked on" },
];

export default function About() {
  const { about, site } = useContent();

  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Skills inline bar (Figma Frame 12 style) */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="skills-bar p-4 md:p-6 mb-16 overflow-x-auto"
        >
          <div className="flex items-center gap-4 md:gap-6 min-w-max">
            {about.skills.map((skill, i) => (
              <div key={skill.label} className="flex items-center gap-3">
                {i > 0 && (
                  <svg className="w-5 h-5 text-accent shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                )}
                <span className="text-white text-sm md:text-base font-medium whitespace-nowrap">
                  {skill.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* About Me Section */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center mb-20">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              About Me
            </h2>
            <p className="text-brand-400 leading-relaxed text-base md:text-lg">
              {about.paragraphs[0]}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="flex justify-center md:justify-end"
          >
            <div className="relative w-64 h-72 md:w-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={about.photoUrl}
                alt={about.photoAlt}
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Stats Section (Figma Frame 13 style) */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
        >
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-8 md:gap-16">
              <div className="text-center">
                <div className="text-7xl md:text-8xl font-bold stat-gradient leading-none mb-2 drop-shadow-[0_0_12px_rgba(152,28,130,0.3)]">
                  {stat.number}
                </div>
                <p
                  className="text-sm md:text-base text-brand-400 max-w-[160px]"
                  dangerouslySetInnerHTML={{ __html: stat.label }}
                />
              </div>
              {i < stats.length - 1 && (
                <div className="w-px h-24 bg-brand-500 hidden md:block" />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
