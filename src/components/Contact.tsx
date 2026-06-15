export default function Contact() {
  return (
    <section id="contact" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intestazione */}
        <div className="text-center mb-14 md:mb-18">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-brand-900 mb-4">
            Contattami
          </h2>
          <div className="w-12 h-0.5 bg-accent mx-auto mb-4 rounded-full" />
          <p className="text-brand-600 max-w-xl mx-auto">
            Hai un progetto in mente? Parliamone. Sarò felice di ascoltare la tua
            idea e trasformarla in qualcosa di bello.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-10 md:gap-16 max-w-5xl mx-auto">
          {/* Form — glass style */}
          <form className="md:col-span-3 space-y-5 glass-card rounded-2xl p-6 md:p-8">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-brand-700 mb-1.5">
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Il tuo nome"
                className="w-full px-4 py-3 rounded-xl glass-input text-brand-800 placeholder:text-brand-400/60"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="la tua@email.com"
                className="w-full px-4 py-3 rounded-xl glass-input text-brand-800 placeholder:text-brand-400/60"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-brand-700 mb-1.5">
                Messaggio
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Ciao Alessandro, vorrei parlarti di..."
                className="w-full px-4 py-3 rounded-xl glass-input text-brand-800 placeholder:text-brand-400/60 resize-none"
              />
            </div>
            <button
              type="submit"
              className="glass-button text-white font-medium px-8 py-3 rounded-xl w-full sm:w-auto"
            >
              Invia messaggio
            </button>
          </form>

          {/* Info laterali — glass style */}
          <div className="md:col-span-2 space-y-8">
            {/* Contatti */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-brand-900 mb-4">
                Informazioni
              </h3>
              <div className="space-y-3 text-brand-600 text-sm">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-accent shrink-0 drop-shadow-[0_0_4px_rgba(200,169,126,0.3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <span>alessandro@rizzo-design.it</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-accent shrink-0 drop-shadow-[0_0_4px_rgba(200,169,126,0.3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  <span>+39 333 12 34 567</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-accent shrink-0 drop-shadow-[0_0_4px_rgba(200,169,126,0.3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <span>Milano, Italia</span>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-brand-900 mb-4">
                Social
              </h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-brand-600 hover:text-accent hover:bg-white/15 transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-brand-600 hover:text-accent hover:bg-white/15 transition-all duration-200"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-brand-600 hover:text-accent hover:bg-white/15 transition-all duration-200"
                  aria-label="Behance"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
