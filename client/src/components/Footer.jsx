import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="mt-14 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500">
        <p className="font-semibold text-slate-700">Petunia Florarie Online</p>
        <p>Buchete premium, livrare rapida si builder custom pentru buchetul perfect.</p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <Link to="/cookie-policy" className="text-slate-500 hover:text-slate-700">
            Cookie Policy
          </Link>
          <Link to="/terms" className="text-slate-500 hover:text-slate-700">
            Termeni si Conditii
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
