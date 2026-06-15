import content from "@/lib/content";
import { renderServiceIcon } from "@/lib/icons";

export default function Services() {
  const { services } = content;

  return (
    <section id="services" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 md:mb-18">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-brand-900 mb-4">
            {services.title}
          </h2>
          <div className="w-12 h-0.5 bg-accent mx-auto mb-4 rounded-full" />
          <p className="text-brand-600 max-w-xl mx-auto">
            {services.subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.items.map((item) => (
            <div
              key={item.title}
              className="glass-card glass-card-hover rounded-2xl p-6 md:p-8"
            >
              <div className="text-accent mb-4 drop-shadow-[0_0_8px_rgba(200,169,126,0.3)]">
                {renderServiceIcon(item.iconName)}
              </div>
              <h3 className="text-lg font-semibold text-brand-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-brand-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
