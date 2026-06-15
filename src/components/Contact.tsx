"use client";

import { motion } from "framer-motion";
import content from "@/lib/content";
import { renderSocialIcon } from "@/lib/icons";

const fromLeft = {
  hidden: { opacity: 0, x: -50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const fromRight = {
  hidden: { opacity: 0, x: 50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const sectionTitle = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const infoCard = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const, delay: 0.2 + i * 0.15 },
  }),
};

export default function Contact() {
  const { contact } = content;
  const f = contact.formLabels;

  return (
    <section id="contact" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={sectionTitle}
          className="text-center mb-14 md:mb-18"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-brand-900 mb-4">
            {contact.title}
          </h2>
          <div className="w-12 h-0.5 bg-accent mx-auto mb-4 rounded-full" />
          <p className="text-brand-600 max-w-xl mx-auto">
            {contact.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-10 md:gap-16 max-w-5xl mx-auto">
          <motion.form
            variants={fromLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="md:col-span-3 space-y-5 glass-card rounded-2xl p-6 md:p-8"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-brand-700 mb-1.5">
                {f.name}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder={f.namePlaceholder}
                className="w-full px-4 py-3 rounded-xl glass-input text-brand-800 placeholder:text-brand-400/60"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-700 mb-1.5">
                {f.email}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder={f.emailPlaceholder}
                className="w-full px-4 py-3 rounded-xl glass-input text-brand-800 placeholder:text-brand-400/60"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-brand-700 mb-1.5">
                {f.message}
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder={f.messagePlaceholder}
                className="w-full px-4 py-3 rounded-xl glass-input text-brand-800 placeholder:text-brand-400/60 resize-none"
              />
            </div>
            <button
              type="submit"
              className="glass-button text-white font-medium px-8 py-3 rounded-xl w-full sm:w-auto"
            >
              {f.submit}
            </button>
          </motion.form>

          <motion.div
            variants={fromRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="md:col-span-2 space-y-8"
          >
            <motion.div
              custom={0}
              variants={infoCard}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-brand-900 mb-4">
                {contact.sidebarTitle}
              </h3>
              <div className="space-y-3 text-brand-600 text-sm">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-accent shrink-0 contact-icon-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <span>{contact.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-accent shrink-0 contact-icon-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  <span>{contact.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-accent shrink-0 contact-icon-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <span>{contact.location}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              custom={1}
              variants={infoCard}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-brand-900 mb-4">
                {contact.socialTitle}
              </h3>
              <div className="flex gap-4">
                {contact.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-brand-600 hover:text-accent hover:bg-white/15 transition-all duration-200"
                    aria-label={s.label}
                  >
                    {renderSocialIcon(s.iconName)}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
