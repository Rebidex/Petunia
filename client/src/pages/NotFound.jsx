import { Link } from 'react-router-dom'
import { Flower2 } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-page">
      <Flower2 className="mb-4 h-16 w-16 text-pink-300 dark:text-purple-400" />
      <h1 className="mb-2 text-4xl font-extrabold text-slate-800 dark:text-slate-100">404</h1>
      <p className="mb-6 text-lg text-slate-500 dark:text-slate-400">Pagina pe care o cauti nu exista.</p>
      <Link
        to="/"
        className="rounded-lg bg-pink-500 px-6 py-2.5 font-semibold text-white hover:bg-pink-600 transition-colors"
      >
        Inapoi acasa
      </Link>
    </div>
  )
}

export default NotFound
