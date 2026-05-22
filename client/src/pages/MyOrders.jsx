import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
}

const statusLabels = {
  pending: 'In asteptare',
  confirmed: 'Confirmata',
  delivered: 'Livrata',
  cancelled: 'Anulata'
}

const formatDate = (value) => {
  if (!value) {
    return '-'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
}

const EmptyState = () => (
  <div className="rounded-xl border border-slate-100 bg-white p-6 text-center shadow-sm dark:bg-slate-900 dark:border-slate-800">
    <p className="mb-4 text-slate-600 dark:text-slate-400">Nu ai plasat nicio comanda inca.</p>
    <Link to="/catalog" className="rounded-lg bg-pink-500 px-4 py-2 font-semibold text-white">
      Exploreaza buchetele
    </Link>
  </div>
)

const OrderCard = ({ order, onCancel }) => {
  const badgeClass = statusStyles[order.status] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
  const statusLabel = statusLabels[order.status] || 'In procesare'
  const shortId = order.id ? `#${order.id.slice(0, 8)}` : '#'
  const canCancel = order.status === 'pending'

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(order.createdAt)}</p>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{shortId}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>{statusLabel}</span>
      </div>

      <ul className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-400">
        {(order.items || []).map((item, index) => (
          <li key={`${order.id}-${item.productId}-${index}`}>
            {item.name} x {item.quantity}
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Total: {Number(order.totalPrice || 0).toFixed(2)} RON
        </p>
        
        {canCancel && (
          <button
            onClick={() => onCancel(order.id)}
            className="rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors"
          >
            Anuleaza comanda
          </button>
        )}
      </div>
    </div>
  )
}

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadOrders = async () => {
      try {
        const response = await api.get('/orders/my')
        const rawOrders = Array.isArray(response.data) ? response.data : response.data.orders || []
        const sorted = [...rawOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        if (active) {
          setOrders(sorted)
        }
      } catch {
        if (active) {
          setError('Nu s-au putut incarca comenzile.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadOrders()

    return () => {
      active = false
    }
  }, [])

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Sigur doresti sa anulezi aceasta comanda?')) {
      return
    }
    try {
      await api.post(`/orders/${orderId}/cancel`)
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status: 'cancelled' } : order))
      )
    } catch {
      alert('Nu s-a putut anula comanda.')
    }
  }

  if (loading) {
    return <p className="text-slate-600 dark:text-slate-400 animate-pulse">Se incarca comenzile...</p>
  }

  if (error) {
    return <p className="text-red-500 dark:text-red-400">{error}</p>
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6 animate-page">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Comenzile mele</h1>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <EmptyState />
        ) : (
          orders.map((order) => (
            <OrderCard key={order.id} order={order} onCancel={handleCancelOrder} />
          ))
        )}
      </div>
    </div>
  )
}

export default MyOrders
