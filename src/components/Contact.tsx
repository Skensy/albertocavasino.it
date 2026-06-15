"use client";

import { motion } from "framer-motion";
import { useContent } from "@/lib/content-context";
import { renderSocialIcon } from "@/lib/icons";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Contact() {
  const { contact } = useContent();
  const f = contact.formLabels;

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {contact.title}
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto mb-6 rounded-full" />
          <p className="text-brand-400 max-w-xl mx-auto text-base md:text-lg">
            {contact.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-12 md:gap-16 max-w-5xl mx-auto">
          <motion.form
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="md:col-span-3 space-y-5"
          >
            <input
              type="text"
              placeholder={f.namePlaceholder}
              className="w-full px-4 py-3.5 rounded-xl bg-brand-800/50 border border-white/10 text-white placeholder:text-brand-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
            />
            <input
              type="email"
              placeholder={f.emailPlaceholder}
              className="w-full px-4 py-3.5 rounded-xl bg-brand-800/50 border border-white/10 text-white placeholder:text-brand-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
            />
            <textarea
              rows={4}
              placeholder={f.messagePlaceholder}
              className="w-full px-4 py-3.5 rounded-xl bg-brand-800/50 border border-white/10 text-white placeholder:text-brand-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all resize-none"
            />
            <button
              type="submit"
              className="btn-gradient inline-block w-full sm:w-auto"
            >
              {f.submit}
            </button>
          </motion.form>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="md:col-span-2 space-y-8"
          >
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">{contact.sidebarTitle}</h3>
              <div className="space-y-4 text-brand-400 text-sm">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <span>{contact.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  <span>{contact.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <span>{contact.location}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">{contact.socialTitle}</h3>
              <div className="flex gap-4">
                {contact.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-brand-400 hover:text-accent hover:border-accent/40 transition-all duration-200"
                    aria-label={s.label}
                  >
                    {renderSocialIcon(s.iconName)}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
