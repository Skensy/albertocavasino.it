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
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Footer() {
  const year = new Date().getFullYear();
  const { site, footer, contact, nav } = useContent();

  const navMap = Object.fromEntries(
    nav.map((item) => [item.label, item.href])
  );

  return (
    <footer className="relative bg-brand-950 text-brand-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid md:grid-cols-3 gap-10 pb-12"
        >
          <motion.div variants={colItem}>
            <h3 className="font-serif text-2xl font-bold text-white mb-2">
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
                  className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-brand-400 hover:text-accent hover:border-accent/40 transition-all duration-300"
                  aria-label={s.label}
                >
                  {renderSocialIcon(s.iconName, "w-4 h-4")}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <div className="h-px bg-accent/10" />
        <div className="pt-8 text-center">
          <p className="text-sm text-brand-500">
            {footer.copyright.replace("{year}", String(year))}
          </p>
        </div>
      </div>
    </footer>
  );
}
