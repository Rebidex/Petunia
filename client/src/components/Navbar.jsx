import { Flower2, ShoppingCart, UserCircle2 } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const { cartItems } = useCart()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-pink-600">
          <Flower2 className="h-6 w-6" />
          Petunia
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {[
            ['/', 'Acasa'],
            ['/catalog', 'Catalog'],
            ['/builder', 'Builder'],
            ['/checkout', 'Checkout']
          ].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-semibold ${isActive ? 'text-pink-600' : 'text-slate-600 hover:text-slate-900'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative rounded-lg p-2 text-slate-700 hover:bg-slate-100">
            <ShoppingCart className="h-5 w-5" />
            {cartItems.length > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-pink-500 px-1.5 text-xs text-white">
                {cartItems.length}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/my-orders"
                className="hidden text-sm font-semibold text-slate-600 hover:text-slate-900 md:inline"
              >
                Comenzile mele
              </Link>
              <Link to="/profile" className="hidden text-sm font-semibold text-slate-600 hover:text-slate-900 md:inline">
                Profilul meu
              </Link>
              <span className="hidden text-sm font-medium text-slate-700 md:inline">{user?.name}</span>
              <button
                onClick={logout}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 rounded-lg bg-pink-500 px-3 py-2 text-sm font-semibold text-white hover:bg-pink-600"
            >
              <UserCircle2 className="h-4 w-4" />
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
