import Image from "next/image";
import content from "@/lib/content";

export default function Portfolio() {
  const { portfolio } = content;

  return (
    <section id="portfolio" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 md:mb-18">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-brand-900 mb-4">
            {portfolio.title}
          </h2>
          <div className="w-12 h-0.5 bg-accent mx-auto mb-4 rounded-full" />
          <p className="text-brand-600 max-w-xl mx-auto">
            {portfolio.subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {portfolio.projects.map((project) => (
            <a
              key={project.title}
              href="#"
              className="group relative block rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={project.src}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="absolute inset-0 opacity-0 invisible md:group-hover:opacity-100 md:group-hover:visible bg-brand-900/40 backdrop-blur-sm transition-all duration-500 flex items-center justify-center pointer-events-none md:group-hover:pointer-events-auto">
                <span className="text-white text-sm font-medium border border-white/30 px-4 py-2 rounded-xl backdrop-blur-sm bg-white/10">
                  Vedi progetto
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                <h3 className="text-white font-semibold text-sm">
                  {project.title}
                </h3>
                <p className="text-white/60 text-xs mt-0.5">
                  {project.category}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
