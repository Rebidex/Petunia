import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="mt-14 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 transition-colors duration-200">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500 dark:text-slate-400">
        <p className="font-semibold text-slate-700 dark:text-slate-300">Petunia Florarie Online</p>
        <p>Buchete premium, livrare rapida si builder custom pentru buchetul perfect.</p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <Link to="/cookie-policy" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors">
            Politica de cookie-uri
          </Link>
          <Link to="/terms" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors">
            Termeni si Conditii
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
