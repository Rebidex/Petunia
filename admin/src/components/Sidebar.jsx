import { LayoutDashboard, Package, ShoppingBag, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/users', label: 'Users', icon: Users }
]

const Sidebar = () => {
  return (
    <aside className="w-full border-r border-slate-200 bg-white md:w-64">
      <div className="border-b border-slate-200 px-4 py-4 text-xl font-extrabold text-pink-600">Petunia Admin</div>
      <nav className="space-y-1 p-3">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                  isActive ? 'bg-pink-50 text-pink-600' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
