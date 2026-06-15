import Image from "next/image";

const skills = [
  { label: "Siti Web", icon: "🌐" },
  { label: "Brochure", icon: "📄" },
  { label: "Locandine", icon: "🎨" },
  { label: "Loghi", icon: "✏️" },
  { label: "Marchi", icon: "🏷️" },
  { label: "Brand Identity", icon: "✨" },
];

export default function About() {
  return (
    <section id="about" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Colonna sinistra — foto Unsplash */}
          <div className="flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-xl ring-1 ring-white/20">
              <Image
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=640&q=85"
                alt="Alessandro Rizzo — Graphic Designer"
                fill
                className="object-cover"
              />
              {/* Glass glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Colonna destra — testo */}
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-brand-900 mb-6">
              Chi Sono
            </h2>
            <div className="w-12 h-0.5 bg-accent mb-6 rounded-full" />
            <p className="text-brand-700 leading-relaxed mb-4">
              Mi chiamo <strong className="text-brand-900">Alessandro Rizzo</strong> e da oltre un
              decennio lavoro come graphic designer in una realtà di comunicazione
              visiva a tutto tondo. Ho avuto la fortuna di crescere in un&apos;agenzia
              dove ogni giorno era diverso: si passava dalla progettazione di un
              sito web alla costruzione di un&apos;identità di marca, dalla brochure
              istituzionale alla locandina per un evento.
            </p>
            <p className="text-brand-700 leading-relaxed mb-8">
              Questa esperienza mi ha insegnato che il buon design non è solo
              estetica: è strategia, ascolto, e capacità di tradurre bisogni in
              soluzioni visive che funzionano. Ogni progetto è una storia nuova
              da raccontare.
            </p>

            {/* Griglia skill — glass style */}
            <div className="grid grid-cols-3 gap-3">
              {skills.map((skill) => (
                <div
                  key={skill.label}
                  className="glass-card rounded-xl px-3 py-2.5 text-sm font-medium text-brand-700 flex items-center gap-2"
                >
                  <span className="text-base">{skill.icon}</span>
                  <span>{skill.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
