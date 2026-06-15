import Image from "next/image";

const projects = [
  {
    title: "Ristorante La Pergola",
    category: "Logo — Brand Ristorante",
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=85",
  },
  {
    title: "TechFlow Agency",
    category: "Sito Web — Azienda Tech",
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=85",
  },
  {
    title: "Vita Verde",
    category: "Brochure — Prodotti Biologici",
    src: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=85",
  },
  {
    title: "Notte di Gala",
    category: "Locandina — Evento",
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=85",
  },
  {
    title: "Studio Architettura DM",
    category: "Marchio — Studio Professionale",
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=85",
  },
  {
    title: "Essenza Cosmetics",
    category: "Brand Identity — Cosmetica",
    src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=85",
  },
  {
    title: "Festival Musica Elettronica",
    category: "Locandina — Festival",
    src: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=85",
  },
  {
    title: "Bottega del Pane",
    category: "Logo — Artigianato Alimentare",
    src: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=85",
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intestazione */}
        <div className="text-center mb-14 md:mb-18">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-brand-900 mb-4">
            Portfolio
          </h2>
          <div className="w-12 h-0.5 bg-accent mx-auto mb-4 rounded-full" />
          <p className="text-brand-600 max-w-xl mx-auto">
            Una selezione di progetti realizzati negli anni, ciascuno con la
            propria storia e personalità.
          </p>
        </div>

        {/* Griglia progetti */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {projects.map((project) => (
            <a
              key={project.title}
              href="#"
              className="group relative block rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              {/* Unsplash image */}
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={project.src}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Glass overlay hover — visible solo su hover desktop */}
              <div className="absolute inset-0 opacity-0 invisible md:group-hover:opacity-100 md:group-hover:visible bg-brand-900/40 backdrop-blur-sm transition-all duration-500 flex items-center justify-center pointer-events-none md:group-hover:pointer-events-auto">
                <span className="text-white text-sm font-medium border border-white/30 px-4 py-2 rounded-xl backdrop-blur-sm bg-white/10">
                  Vedi progetto
                </span>
              </div>

              {/* Info bottom */}
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
