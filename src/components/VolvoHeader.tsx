export default function VolvoHeader() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-volvo-line">
      <div className="flex items-center justify-between px-4 md:px-8 h-14">
        <div className="flex items-center gap-6 md:gap-8">
          <button aria-label="Menu" className="p-2">
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
              <path d="M0 1h20M0 7h20M0 13h20" stroke="#141414" strokeWidth="1.4" />
            </svg>
          </button>
          <nav className="hidden md:flex items-center gap-7 text-[15px]">
            <a className="hover:opacity-60 transition-opacity" href="#">Nos voitures</a>
            <a className="hover:opacity-60 transition-opacity" href="#">Achat</a>
            <a className="hover:opacity-60 transition-opacity" href="#">Ma Volvo</a>
            <a className="hover:opacity-60 transition-opacity" href="#">Électrique</a>
          </nav>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <span
            className="font-serif text-[22px] tracking-[0.5em] pl-[0.5em]"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            VOLVO
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button aria-label="Compte" className="p-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#141414" strokeWidth="1.4" />
              <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#141414" strokeWidth="1.4" />
            </svg>
          </button>
          <button aria-label="Recherche" className="p-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#141414" strokeWidth="1.4" />
              <path d="M21 21l-5-5" stroke="#141414" strokeWidth="1.4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-black text-white text-sm">
        <div className="flex items-center justify-center gap-6 px-4 py-3">
          <span>Conçue en Suède, fabriquée en Belgique</span>
          <a className="underline underline-offset-4 hover:opacity-80" href="#">
            Profitez de la Volvo EX30 à partir de 299 € / mois*
          </a>
        </div>
      </div>
    </header>
  );
}
