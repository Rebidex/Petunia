import { useAuth } from '../context/AuthContext'

const Topbar = () => {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
      <h1 className="text-lg font-bold text-slate-800">Panou Administrare</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-600">{user?.name}</span>
        <button
          onClick={logout}
          className="rounded-lg bg-pink-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-pink-600"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default Topbar
