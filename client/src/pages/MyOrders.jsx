import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
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
  <div className="rounded-xl border border-slate-100 bg-white p-6 text-center shadow-sm">
    <p className="mb-4 text-slate-600">Nu ai plasat nicio comanda inca.</p>
    <Link to="/catalog" className="rounded-lg bg-pink-500 px-4 py-2 font-semibold text-white">
      Exploreaza buchetele
    </Link>
  </div>
)

const OrderCard = ({ order }) => {
  const badgeClass = statusStyles[order.status] || 'bg-slate-100 text-slate-600'
  const statusLabel = statusLabels[order.status] || 'In procesare'
  const shortId = order.id ? `#${order.id.slice(0, 8)}` : '#'

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
          <p className="text-sm font-semibold text-slate-700">{shortId}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>{statusLabel}</span>
      </div>

      <ul className="mt-3 space-y-1 text-sm text-slate-600">
        {(order.items || []).map((item, index) => (
          <li key={`${order.id}-${item.productId}-${index}`}>
            {item.name} x {item.quantity}
          </li>
        ))}
      </ul>

      <p className="mt-3 text-sm font-semibold text-slate-800">
        Total: {Number(order.totalPrice || 0).toFixed(2)} RON
      </p>
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

  if (loading) {
    return <p className="text-slate-600">Se incarca comenzile...</p>
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Comenzile mele</h1>
      {orders.length === 0 ? <EmptyState /> : orders.map((order) => <OrderCard key={order.id} order={order} />)}
    </div>
  )
}

export default MyOrders
