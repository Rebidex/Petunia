import { useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Builder from './pages/Builder'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Payment from './pages/Payment'
import OrderConfirm from './pages/OrderConfirm'
import Login from './pages/Login'
import Register from './pages/Register'
import MyOrders from './pages/MyOrders'
import Profile from './pages/Profile'
import CookiePolicy from './pages/CookiePolicy'
import TermsAndConditions from './pages/TermsAndConditions'
import NotFound from './pages/NotFound'

const CookieBanner = () => {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }
    return !localStorage.getItem('cookiesAccepted')
  })

  if (!visible) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-wrap items-center justify-between gap-4 bg-slate-800 px-6 py-4 text-white">
      <p className="text-sm">
        Folosim cookie-uri pentru a-ti oferi o experienta mai buna.{' '}
        <Link to="/cookie-policy" className="underline">
          Afla mai multe
        </Link>
      </p>
      <button
        onClick={() => {
          localStorage.setItem('cookiesAccepted', 'true')
          setVisible(false)
        }}
        className="flex-shrink-0 rounded-lg bg-pink-500 px-4 py-1.5 text-sm text-white hover:bg-pink-600"
      >
        Accept
      </button>
    </div>
  )
}

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route path="/order-confirm" element={<OrderConfirm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <CookieBanner />
      <Footer />
    </div>
  )
}

export default App
