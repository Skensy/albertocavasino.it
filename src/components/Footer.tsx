"use client";

import { motion } from "framer-motion";
import { useContent } from "@/lib/content-context";
import { renderSocialIcon } from "@/lib/icons";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const colItem = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Footer() {
  const content = useContent();
  const year = new Date().getFullYear();
  const { site, footer, contact, nav } = content;

  const navMap = Object.fromEntries(
    nav.map((item) => [item.label, item.href])
  );

  return (
    <footer className="relative bg-brand-900 text-brand-300 overflow-hidden">
      <div className="glass-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid sm:grid-cols-3 gap-8"
        >
          <motion.div variants={colItem}>
            <h3 className="font-serif text-xl font-semibold text-white mb-2">
              {site.name}
            </h3>
            <p className="text-sm text-brand-400">{site.role}</p>
          </motion.div>

          <motion.div variants={colItem}>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {footer.linkSectionTitle}
            </h4>
            <nav className="flex flex-col gap-2">
              {footer.footerLinks.map((label) => (
                <a
                  key={label}
                  href={navMap[label] || `#${label.toLowerCase()}`}
                  className="text-sm text-brand-400 hover:text-accent transition-colors duration-300"
                >
                  {label}
                </a>
              ))}
            </nav>
          </motion.div>

          <motion.div variants={colItem}>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {footer.socialSectionTitle}
            </h4>
            <div className="flex gap-3">
              {contact.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  className="w-9 h-9 rounded-lg bg-white/5 backdrop-blur-sm border border-white/[0.06] flex items-center justify-center text-brand-400 hover:text-accent hover:bg-white/10 hover:border-accent/30 transition-all duration-300"
                  aria-label={s.label}
                >
                  {renderSocialIcon(s.iconName, "w-4 h-4")}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <div className="glass-divider mt-10" />
        <div className="pt-6 text-center">
          <p className="text-sm text-brand-500">
            {footer.copyright.replace("{year}", String(year))}
          </p>
        </div>
      </div>
    </footer>
  );
}
