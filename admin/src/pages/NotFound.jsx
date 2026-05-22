import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="mb-2 text-4xl font-extrabold text-slate-800">404</h1>
      <p className="mb-6 text-lg text-slate-500">Pagina nu a fost gasita.</p>
      <Link
        to="/"
        className="rounded-lg bg-pink-500 px-6 py-2.5 font-semibold text-white hover:bg-pink-600"
      >
        Inapoi la Dashboard
      </Link>
    </div>
  )
}

export default NotFound
