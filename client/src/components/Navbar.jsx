import { useState } from 'react'
import { Flower2, ShoppingCart, UserCircle2, Menu, X, Sun, Moon } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useDarkMode } from '../context/DarkModeContext'

const navLinks = [
  ['/', 'Acasa'],
  ['/catalog', 'Catalog'],
  ['/builder', 'Builder'],
  ['/checkout', 'Checkout']
]

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const { cartItems } = useCart()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = () => setMobileOpen(false)

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-pink-600 dark:text-pink-500">
          <Flower2 className="h-6 w-6" />
          Petunia
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${isActive ? 'text-pink-600 dark:text-pink-400' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Schimba tema"
          >
            {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
          </button>

          <Link to="/cart" className="relative rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            <ShoppingCart className="h-5 w-5" />
            {cartItems.length > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-pink-500 px-1.5 text-xs text-white">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* Desktop auth links */}
          {isAuthenticated ? (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                to="/my-orders"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                Comenzile mele
              </Link>
              <Link to="/profile" className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                Profilul meu
              </Link>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{user?.name}</span>
              <button
                onClick={logout}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Deconectare
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden items-center gap-1 rounded-lg bg-pink-500 px-3 py-2 text-sm font-semibold text-white hover:bg-pink-600 md:flex"
            >
              <UserCircle2 className="h-4 w-4" />
              Autentificare
            </Link>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
            aria-label="Meniu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <nav className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 dark:border-slate-800 dark:bg-slate-950 md:hidden animate-slide-in">
          <div className="flex flex-col gap-1">
            {navLinks.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-850'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            <hr className="my-2 border-slate-200 dark:border-slate-800" />

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/my-orders"
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-850'
                    }`
                  }
                >
                  Comenzile mele
                </NavLink>
                <NavLink
                  to="/profile"
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-850'
                    }`
                  }
                >
                  Profilul meu
                </NavLink>
                <div className="mt-1 flex items-center justify-between px-3">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{user?.name}</span>
                  <button
                    onClick={() => {
                      logout()
                      closeMobile()
                    }}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Deconectare
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                onClick={closeMobile}
                className="flex items-center gap-2 rounded-lg bg-pink-500 px-3 py-2 text-sm font-semibold text-white hover:bg-pink-600"
              >
                <UserCircle2 className="h-4 w-4" />
                Autentificare
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}

export default Navbar
