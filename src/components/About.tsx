"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useContent } from "@/lib/content-context";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function About() {
  const { about, spacing } = useContent();
  const stats = about.stats;

  return (
    <section id="about" className="relative"
      style={{ paddingTop: 'var(--spacing-section-py)', paddingBottom: 'var(--spacing-section-py)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Skills inline bar */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="skills-bar p-4 md:p-6 overflow-x-auto"
          style={{ marginBottom: 'var(--spacing-section-header-mb)' }}
        >
          <div className="flex items-center gap-4 md:gap-6 min-w-max justify-center">
            {about.skills.map((skill, i) => (
              <div key={skill.label} className="flex items-center gap-3">
                {i > 0 && (
                  <svg className="w-5 h-5 text-accent shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                )}
                <span className="text-brand-900 text-sm md:text-base font-medium whitespace-nowrap">
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
            className="flex justify-center md:justify-start"
          >
            <div className="glass-card p-3">
              <div className="relative w-64 h-[420px] md:w-[355px] md:h-[467px] rounded-xl overflow-hidden">
                <Image
                  src={about.photoUrl || "/images/avatar-desktop.png"}
                  alt={about.photoAlt}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-brand-900 mb-8 tracking-tight">
              {about.title}
            </h2>
            {about.paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-brand-500 leading-relaxed text-base md:text-lg mb-4"
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="glass-card p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-center"
            style={{ gap: 'var(--spacing-section-gap)' }}
          >
            {stats?.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-8 md:gap-16">
                <div className="text-center">
                  <div className="text-7xl md:text-8xl font-bold stat-gradient leading-none mb-2">
                    {stat.number}
                  </div>
                  <p
                    className="text-sm md:text-base text-brand-500 max-w-[160px]"
                    dangerouslySetInnerHTML={{ __html: stat.label }}
                  />
                </div>
                {stats && i < stats.length - 1 && (
                  <div className="w-px h-24 bg-brand-200 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
