import content from "@/lib/content";
import { renderSocialIcon } from "@/lib/icons";

export default function Footer() {
  const year = new Date().getFullYear();
  const { site, footer, contact, nav } = content;

  const navMap = Object.fromEntries(
    nav.map((item) => [item.label, item.href])
  );

  return (
    <footer className="relative bg-brand-900 text-brand-300 overflow-hidden">
      <div className="glass-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-xl font-semibold text-white mb-2">
              {site.name}
            </h3>
            <p className="text-sm text-brand-400">{site.role}</p>
          </div>

          <div>
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
          </div>

          <div>
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
          </div>
        </div>

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
