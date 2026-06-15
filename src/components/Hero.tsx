import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Unsplash background — designer workspace / creative studio */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=85"
          alt="Creative workspace"
          fill
          className="object-cover"
          priority
        />
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 via-brand-900/15 to-brand-950/40 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="glass-panel px-6 py-3 inline-block mb-8 rounded-full border-white/15">
          <span className="text-sm font-medium text-white/80 tracking-wider uppercase">
            Graphic Designer
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-tight mb-6 drop-shadow-lg">
          Disegno idee,{" "}
          <span className="text-accent">costruisco identità.</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow">
          Da oltre dieci anni trasformo visioni in progetti visivi: siti web,
          brochure, loghi e brand identity per aziende che vogliono raccontarsi
          con stile.
        </p>
        <a
          href="#portfolio"
          className="inline-block glass-button text-white font-medium px-8 py-3.5 rounded-xl"
        >
          Vedi i miei lavori
        </a>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-50/80 to-transparent z-10" />

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg
          className="w-5 h-5 text-white/50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
