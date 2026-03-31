import { Link } from '@tanstack/react-router'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0f172a] text-white/70 mt-0">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="space-y-4">
          <span className="font-serif text-2xl text-white">
            Zlatni <span className="text-gold">Kvadrat</span>
          </span>
          <p className="text-sm text-white/60 max-w-sm">
            Premium real estate advisory for the Balkan market. We curate listings, verify documentation,
            and guide clients from discovery to closing.
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <p className="text-white font-medium">Explore</p>
          <div className="flex flex-col gap-2">
            <Link to="/listings" className="hover:text-gold transition-colors">All Properties</Link>
            <a href="/#featured" className="hover:text-gold transition-colors">Featured Picks</a>
            <a href="/#insights" className="hover:text-gold transition-colors">Market Insights</a>
            <Link to="/login" className="hover:text-gold transition-colors">List a Property</Link>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <p className="text-white font-medium">Contact</p>
          <div className="space-y-2">
            <p className="text-white/60">Sarajevo • Banja Luka • Mostar</p>
            <a className="block hover:text-gold transition-colors" href="tel:+38733123456">+387 33 123 456</a>
            <a className="block hover:text-gold transition-colors" href="mailto:hello@zlatnikvadrat.ba">hello@zlatnikvadrat.ba</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <span>© {year} Zlatni Kvadrat. All rights reserved.</span>
          <span>Premium Real Estate Platform</span>
        </div>
      </div>
    </footer>
  )
}
